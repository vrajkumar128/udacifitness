import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciStepper';

export default class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((currentState) => {
      const count = currentState[metric] + step;

      return {
        [metric]: count > max ? max : count
      };
    });
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((currentState) => {
      const count = currentState[metric] - step;

      return {
        [metric]: count < 0 ? 0 : count
      };
    });
  }

  slide = (metric, value) => {
    this.setState({
      [metric]: value
    });
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    return (
      <View>
        {Object.keys(metaInfo).map((metric) => {
          const { getIcon, type, ...rest } = metaInfo[metric];
          const value = this.state[metric];

          return (
            <View key={metric}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(slide) => this.slide(metric, value)}
                    {...rest}
                  />
                : <UdaciStepper
                    value={value}
                    increment={() => this.increment(metric)}
                    decrement={() => this.decrement(metric)}
                    {...rest}
                  />}
            </View>
          );
        })}
      </View>
    );
  }
}
