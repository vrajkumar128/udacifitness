// Entries reducer
export default (state = {}, action) => {
  const entriesReducer = {
    RECEIVE_ENTRIES: action.entries,
    ADD_ENTRY: {
      ...state,
      ...action.entry
    },
    default: state
  };

  return entriesReducer[action.type] || entriesReducer['default'];
};
