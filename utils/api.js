import { AsyncStorage } from 'react-native';
import { CALENDAR_STORAGE_KEY } from './_calendar';

export const submitEntry = async ({ entry, key }) => {
  try {
    const localStorageEntry = await AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
      [key]: entry
    }));
    return localStorageEntry;
  } catch (err) {
    console.error("Error:", err);
    alert('There was an error with your submission. Please try again.');
  }
};

export const removeEntry = async (key) => {
  try {
    const results = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
    const data = JSON.parse(results);
    data[key] = undefined;
    delete data[key];
    AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("Error:", err);
    alert('There was an error resetting the data. Please try again.');
  }
};
