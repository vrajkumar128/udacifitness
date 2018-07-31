import { AsyncStorage } from 'react-native';
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './_calendar';

// Retrieve calendar data
export const fetchCalendarResults = async () => {
  try {
    const results = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
    return formatCalendarResults(results);
  } catch (err) {
    console.error("Error:", err);
    alert('There was an error fetching the calendar entries.');
  }
};

// Add a new entry to the calendar
export const submitEntry = async ({ entry, key }) => {
  try {
    await AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
      [key]: entry
    }));
  } catch (err) {
    console.error("Error:", err);
    alert('There was an error with your submission. Please try again.');
  }
};

// Reset today's calendar entry
export const removeEntry = async (key) => {
  try {
    await AsyncStorage.removeItem(CALENDAR_STORAGE_KEY);
  } catch (err) {
    console.error("Error:", err);
    alert('There was an error resetting the data. Please try again.');
  }
};
