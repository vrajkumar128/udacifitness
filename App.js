import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import AddEntry from './components/AddEntry';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import History from './components/History';
import middleware from './middleware/index';
import { createBottomTabNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import { purple, white } from './utils/colors';
import { FontAwesome, Ionicons } from 'react-native-vector-icons';
import { Constants } from 'expo';
import EntryDetail from './components/EntryDetail';

const UdaciStatusBar = ({ backgroundColor, ...rest }) => (
  <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
    <StatusBar translucent backgroundColor={backgroundColor} {...rest} />
  </View>
);

const Tabs = (Platform.OS === 'ios' ? createBottomTabNavigator : createMaterialTopTabNavigator)({
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: 'History',
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({ tintColor }) => <FontAwesome name="plus-square" size={30} color={tintColor} />
    }
  }
}, {
  navigationOptions: {
    headers: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
});

const MainNavigator = createStackNavigator({
  Home: {
    screen: Tabs
  },
  EntryDetail: {
    screen: EntryDetail,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple
      }
    }
  }
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer, middleware)}>
        <View style={{ flex: 1 }}>
          <UdaciStatusBar backgroundColor={purple} />
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}
