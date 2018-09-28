import React from 'react';
import { View, StyleSheet, Platform, AsyncStorage } from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { white, red, orange, blue, lightPurp, pink } from './colors';
import { Notifications, Permissions } from 'expo';

// AsyncStorage key for local notifications
const NOTIFICATION_KEY = 'UdaciFitness:notifications';

// Determine whether num is between x and y
export const isBetween = (num, x, y) => num >= x && num <= y;

// Given a heading, return a cardinal direction
export const calculateDirection = (heading) => {
  const headingIndex = ((heading + 22.5) / 45);

  const headingSwitch = {
    1: 'North',
    2: 'Northeast',
    3: 'East',
    4: 'Southeast',
    5: 'South',
    6: 'Southwest',
    7: 'West',
    8: 'Northwest',
    9: 'North',
    default: 'Calculating'
  };

  return headingIndex
    ? headingSwitch[headingIndex]
    : headingSwitch['default'];
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
export const getDailyReminderValue = () => {
  today: "Don't forget to log your data today!"
};

// Clear notifications
export const clearLocalNotifications = async () => {
  await AsyncStorage.removeItem(NOTIFICATION_KEY);
  Notifications.cancelAllScheduledNotificationsAsync();
};

// Define the notification to be sent
const createNotification = () => ({
  title: 'Log your stats!',
  body: `Don't forget to log your stats for today!`,
  ios: {
    sound: true
  },
  android: {
    sound: true,
    priority: 'high',
    sticky: false,
    vibrate: true
  }
});

// Set notification in AsyncStorage
export const setLocalNotification = async () => {
  // Check if notification has already been set
  const rawData = await AsyncStorage.getItem(NOTIFICATION_KEY);
  const jsonData = JSON.parse(rawData);

  if (jsonData === null) {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status === 'granted') {
      Notifications.cancelAllScheduledNotificationsAsync(); // Prevent duplicate notifications
      let tomorrow = new Date();

      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20);
      tomorrow.setMinutes(0);
      // Set time and frequency of notification
      Notifications.scheduleLocalNotificationAsync(
        createNotification(),
        {
          time: tomorrow,
          repeat: 'day'
        }
      );
      
      AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
    }
  }
};