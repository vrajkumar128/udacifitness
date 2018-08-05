import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import { addEntry } from '../actions';
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';

class EntryDetail extends React.Component {
  // Return formatted date as screen header
  static navigationOptions = ({ navigation }) => {
    const { entryId } = navigation.state.params;

    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    return {
      title: `${month}/${day}/${year}`
    };
  }

  // Re-render only if metrics exist
  shouldComponentUpdate(nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today;
  }

  // Reset an entry
  reset = () => {
    const { remove, goBack, entryId } = this.props;

    remove();
    goBack();
  }

  render() {
    const { metrics } = this.props;
    console.log(metrics);

    return (
      <View style={styles.container}>
        {MetricCard(metrics)}
        <TouchableOpacity onPress={this.reset} style={{ margin: 20 }}>
          <Text style={{ textAlign: 'center' }}>RESET</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
})

// Grab data from Redux store as props
const mapStateToProps = (state, { navigation }) => {
  const { entryId } = navigation.state.params;

  return {
    entryId,
    metrics: state[entryId]
  };
};

// Pass dispatch-dependent methods as props
const mapDispatchToProps = (dispatch, { navigation }) => {
  const { entryId } = navigation.state.params;

  return {
    remove: () => dispatch(addEntry({
      [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack()
  };
};

// Connect component to Redux store
export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
