import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Platform,
  TouchableNativeFeedback, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Foundation } from 'react-native-vector-icons';
import { purple, white } from '../utils/colors';
import { Location, Permissions } from 'expo';
import { calculateDirection } from '../utils/helpers';

export default class Live extends Component {
  state = {
    coords: {},
    status: null,
    direction: '',
    bounceValue: new Animated.Value(1)
  }

  // Retrieve Location permissions status
  async componentDidMount() {
    try {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);

      status === 'granted' 
        ? this.setLocation()
        : this.setState({ status });
    } catch (err) {
      console.error(err);
      this.setState({
        status: 'undetermined'
      });
      alert('Error retrieving Location permissions level');
    }
  }
  
  // Ask to enable Location permissions
  askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      status === 'granted' 
        ? this.setLocation()
        : this.setState({ status });
    } catch (err) {
      console.error(err);
      alert('Error asking for Location permissions');
    }
  }

  // Set a new location
  setLocation = () => {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 1,
      distanceInterval: 1
    }, ({ coords }) => {
      const newDirection = calculateDirection(coords.heading);
      const { direction, bounceValue } = this.state;

      if (newDirection !== direction) {
        Animated.sequence([
          Animated.timing(bounceValue, { duration: 200, toValue: 1.04 }),
          Animated.spring(bounceValue, { toValue: 1, friction: 4 })
        ]).start();
      }

      this.setState({
        coords,
        status: 'granted',
        direction: newDirection
      });
    });
  }

  // Render different UIs based on the value of `status`
  renderUI = (coords, status, direction) => {
    const statusSwitch = {
      'denied': (
        <View style={styles.center}>
          <Text style={{ textAlign: 'center'}}>
            {`Location services are disabled for this app. You can change this in your device's settings.`}
          </Text>
        </View>
      ),

      'undetermined': (
        <View style={styles.center}>
          <Foundation name="alert" size={50} />
          <Text style={{ textAlign: 'center' }}>
            You must enable location services to use this feature
          </Text>
          {Platform.OS === 'ios'
            ? (
              <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                <Text style={styles.buttonText}>Enable</Text>
              </TouchableOpacity>
            )
            : (
              <TouchableNativeFeedback onPress={this.askPermission}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Enable</Text>
                </View>
              </TouchableNativeFeedback>
            )
          }
        </View>
      ),

      'granted': (
        <View style={styles.container}>
          <View style={styles.directionContainer}>
            <Text style={styles.header}>
              {`You're heading`}
            </Text>
            <Animated.Text style={[styles.direction, [{ scale: bounceValue }]]}>
              {direction}
            </Animated.Text>
          </View>
          <View style={styles.metricContainer}>
            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Altitude
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {Math.round(coords.altitude * 3.2808)} feet
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Speed
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {(coords.speed * 2.2369).toFixed(1)} MPH
              </Text>
            </View>
          </View>
        </View>
      ),

      'default': <ActivityIndicator style={{ marginTop: 30 }} />
    };

    return statusSwitch[status] || statusSwitch['default'];
  }
    
  render() {
    const { coords, status, direction } = this.state;

    return this.renderUI(coords, status, direction);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    margin: 20
  },
  buttonText :{
    color: white,
    fontSize: 20
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    fontSize: 35,
    textAlign: 'center'
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center'
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5
  }
});