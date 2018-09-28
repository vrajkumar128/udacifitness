import React from 'react';
import { View, Text, Button, TouchableNativeFeedback,
  TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue,
  clearLocalNotifications, setLocalNotification } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciStepper';
import DateHeader from './DateHeader';
import { Ionicons } from 'react-native-vector-icons';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { purple, white } from '../utils/colors';
import { NavigationActions } from 'react-navigation';

class AddEntry extends React.Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  // Increment a metric after pressing its stepper
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((currentState) => {
      const count = currentState[metric] + step;

      return {
        [metric]: count > max ? max : count
      };
    });
  }

  // Decrement a metric after pressing its stepper
  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((currentState) => {
      const count = currentState[metric] - step;

      return {
        [metric]: count < 0 ? 0 : count
      };
    });
  }

  // Update a metric with slider value
  slide = (metric, value) => {
    this.setState({
      [metric]: value
    });
  }

  // Redirect to home
  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry'
    }));
  }

  // Submit data for the day
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    submitEntry({ key, entry });
    this.props.dispatch(addEntry({
      [key]: entry
    }));

    clearLocalNotifications()
      .then(setLocalNotification());

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    });

    this.toHome();
  }

  // Reset data for the day
  reset = () => {
    const key = timeToString();

    removeEntry(key);
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }));

    this.toHome();
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    // If data for this day have already been submitted, show a corresponding screen
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TouchableOpacity style={{ padding: 10 }} onPress={this.reset}>
            <Text style={{ textAlign: 'center', color: purple }}>Reset</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((metric) => {
          const { getIcon, type, ...rest } = metaInfo[metric];
          const value = this.state[metric];

          return (
            <View key={metric} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onValueChange={(value) => this.slide(metric, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(metric)}
                    onDecrement={() => this.decrement(metric)}
                    {...rest}
                  />}
            </View>
          );
        })}
        {Platform.OS === 'ios'
          ? (
            <TouchableOpacity onPress={this.submit} style={styles.iosSubmitBtn}>
              <Text style={styles.submitBtnText}>SUBMIT</Text>
            </TouchableOpacity>
          )
          : (
            <TouchableNativeFeedback onPress={this.submit}>
              <View style={styles.AndroidSubmitBtn}>
                <Text style={styles.submitBtnText}>SUBMIT</Text>
              </View>
            </TouchableNativeFeedback>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  AndroidSubmitBtn: {
    backgroundColor: purple,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  }
});

// Grab data from Redux store as props
const mapStateToProps = (state) => {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  };
};

// Connect component to Redux store
export default connect(mapStateToProps)(AddEntry);
