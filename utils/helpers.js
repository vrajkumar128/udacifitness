import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { white, red, orange, blue, lightPurp, pink, gray } from './colors';

// Determine whether num is between x and y
export const isBetween = (num, x, y) => num >= x && num <= y;

// Given a heading, return a cardinal direction
export const calculateDirection = (heading) => {
  let direction = '';

  if (isBetween(heading, 0, 22.5)) {
    direction = 'North';
  } else if (isBetween(heading, 22.5, 67.5)) {
    direction = 'North East';
  } else if (isBetween(heading, 67.5, 112.5)) {
    direction = 'East';
  } else if (isBetween(heading, 112.5, 157.5)) {
    direction = 'South East';
  } else if (isBetween(heading, 157.5, 202.5)) {
    direction = 'South';
  } else if (isBetween(heading, 202.5, 247.5)) {
    direction = 'South West';
  } else if (isBetween(heading, 247.5, 292.5)) {
    direction = 'West';
  } else if (isBetween(heading, 292.5, 337.5)) {
    direction = 'North West';
  } else if (isBetween(heading, 337.5, 360)) {
    direction = 'North';
  } else {
    direction = 'Calculating';
  }

  return direction;
};

// Convert the current time to a string
export const timeToString = (time = Date.now()) => {
  const date = new Date(time);
  const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return todayUTC.toISOString().split('T')[0];
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 5,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20
  },
});

// Retrieve metadata for a given metric
export const getMetricMetaInfo = (metric) => {
  const info = {
    run: {
      displayName: 'Run',
      max: 50,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon: () => (
        <View style={[styles.iconContainer, { backgroundColor: red }]}>
          <MaterialIcons
            name="directions-run"
            color={white}
            size={35}
          />
        </View>
      )
    },
    bike: {
      displayName: 'Bike',
      max: 100,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon: () => (
        <View style={[styles.iconContainer, { backgroundColor: orange }]}>
          <MaterialCommunityIcons
            name="bike"
            color={white}
            size={35}
          />
        </View>
      )
    },
    swim: {
      displayName: 'Swim',
      max: 9900,
      unit: 'meters',
      step: 100,
      type: 'steppers',
      getIcon: () => (
        <View style={[styles.iconContainer, { backgroundColor: blue }]}>
          <MaterialCommunityIcons
            name="swim"
            color={white}
            size={35}
          />
        </View>
      )
    },
    sleep: {
      displayName: 'Sleep',
      max: 24,
      unit: 'hours',
      step: 1,
      type: 'slider',
      getIcon: () => (
        <View style={[styles.iconContainer, { backgroundColor: lightPurp }]}>
          <FontAwesome
            name="bed"
            color={white}
            size={35}
          />
        </View>
      )
    },
    eat: {
      displayName: 'Eat',
      max: 10,
      unit: 'rating',
      step: 1,
      type: 'slider',
      getIcon: () => (
        <View style={[styles.iconContainer, { backgroundColor: pink }]}>
          <MaterialCommunityIcons
            name="food"
            color={white}
            size={35}
          />
        </View>
      )
    }
  };

  return typeof metric === 'undefined' ? info : info[metric];
};

// If no data has been logged today, return a reminder
export const getDailyReminderValue = () => ({
  today: ":wave: Don't forget to log your data today!"
});
