import { RECEIVE_ENTRIES, ADD_ENTRY } from '../actions';

// Entries reducer
export default (state = {}, action) => {
  const reducer = {
    RECEIVE_ENTRIES: action.entries,
    ADD_ENTRY: {
      ...state,
      ...action.entry
    },
    default: state
  };

  return reducer[action.type] || reducer['default'];
};
