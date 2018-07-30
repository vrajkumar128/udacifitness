// Map strings to constants (better typo detection)
export const RECEIVE_ENTRIES = "RECEIVE_ENTRIES";
export const ADD_ENTRY = "ADD_ENTRY";

// Create a RECEIVE_ENTRIES action
export const receiveEntries = (entries) => ({
  type: RECEIVE_ENTRIES,
  entries
});

// Create an ADD_ENTRY action
export const addEntry = (entry) => ({
  type: ADD_ENTRY,
  entry
});
