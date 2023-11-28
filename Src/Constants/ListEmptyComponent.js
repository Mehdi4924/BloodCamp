import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {hp, wp} from './Responsive';
import Colors from './Colors';

export default function ListEmptyComponent(props) {
  return (
    <View style={[styles.container, props.containerStyles]}>
      <Text style={styles.textStyles}>No Data Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(90),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyles: {
    fontSize: hp(2),
    color: Colors.black,
  },
});
