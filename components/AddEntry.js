import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciStepper';
import DateHeader from './DateHeader';
import { Ionicons } from 'react-native-vector-icons';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';

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

  // Submit data for the day
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    submitEntry({ key, entry });
    this.props.dispatch(addEntry({
      [key]: entry
    }));

    // TODO: Redirect to Home, clear local notifications

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    });
  }

  // Reset data for the day
  reset = () => {
    const key = timeToString();

    removeEntry(key);
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }));
    // TODO: Redirect to Home
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    // If data for this day have already been submitted, show a screen
    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name="ios-happy-outline" size={100} />
          <Text>You already logged your information for today</Text>
          <TouchableOpacity onPress={this.reset}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((metric) => {
          const { getIcon, type, ...rest } = metaInfo[metric];
          const value = this.state[metric];

          return (
            <View key={metric}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onValueChange={(value) => this.slide(metric, value)}
                    {...rest}
                  />
                : <UdaciStepper
                    value={value}
                    onIncrement={() => this.increment(metric)}
                    onDecrement={() => this.decrement(metric)}
                    {...rest}
                  />}
            </View>
          );
        })}
        <Button title="submit" onPress={this.submit} />
      </View>
    );
  }
}

// Grab data from Redux store as props
const mapStateToProps = (state) => {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  };
}

// Connect component to Redux store
export default connect(mapStateToProps)(AddEntry);
