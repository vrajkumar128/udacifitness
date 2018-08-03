import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateHeader from './DateHeader';
import { getMetricMetaInfo } from '../utils/helpers';
import { gray } from '../utils/colors';

const MetricCard = (metrics, date) => (
  <View>
    {date && <DateHeader date={date} />}
    {Object.keys(metrics).map((metric) => {
      const { displayName, unit, backgroundColor, getIcon } = getMetricMetaInfo(metric);

      return (
        <View key={metric} style={styles.metric}>
          {getIcon()}
          <View>
            <Text style={{ fontSize: 20 }}>
              {displayName}
            </Text>
            <Text style={{ fontSize: 16, color: gray }}>
              {metrics[metric]} {unit}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  metric: {
    flexDirection: 'row',
    marginTop: 12
  }
});

export default MetricCard;
