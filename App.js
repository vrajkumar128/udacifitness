import React from 'react';
import { StyleSheet, View } from 'react-native';
import AddEntry from './components/AddEntry';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import History from './components/History';
import middleware from './middleware/index';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer, middleware)}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 20 }} />
          <AddEntry />
        </View>
      </Provider>
    );
  }
}
