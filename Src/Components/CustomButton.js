import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../Constants/Responsive';
import Colors from '../Constants/Colors';

export default function CustomButton(props) {
  return (
    <TouchableOpacity
      style={[styles.btnContainer, props.btnContainer]}
      onPress={props.onPress}
      disabled={props.isLoading}>
      {props.isLoading ? (
        <ActivityIndicator size={'small'} color={Colors.white} />
      ) : (
        <Text style={[styles.btnText, props.btnText]}>
          {props.title || 'Press Me'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: Colors.primary,
    width: wp(80),
    height: hp(6),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: hp(0.5),
    marginTop: hp(2),
  },
  btnText: {
    color: Colors.white,
    fontSize: hp(2),
  },
});
