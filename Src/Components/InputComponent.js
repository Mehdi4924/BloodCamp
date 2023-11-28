import React from 'react';
import {StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import {hp, wp} from '../Constants/Responsive';
import Colors from '../Constants/Colors';
import {Icon} from '@rneui/themed';

export default function InputComponent(props) {
  return (
    <View style={[styles.container, props.container]}>
      <Icon
        name={props.leftIcon}
        type={props.leftIconType}
        color={Colors.primary}
        style={{paddingHorizontal: wp(2)}}
        size={hp(3.5)}
      />
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={Colors.grey}
        value={props.value}
        onChangeText={props.onChangeText}
        style={styles.textStyles}
        secureTextEntry={props.secureTextEntry}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        keyboardType={props?.keyboardType || 'default'}
      />
      {props.rightIcon ? (
        <Pressable onPress={props.onRightPress}>
          <Icon
            name={props.rightIcon}
            type={props.rightType}
            color={Colors.grey}
            style={{paddingHorizontal: wp(2)}}
            size={hp(2)}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(6),
    width: wp(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderBottomColor: Colors.grey,
    borderRadius: 5,
    borderBottomWidth: 1,
    paddingHorizontal: wp(1),
    marginVertical: hp(0.5),
  },
  textStyles: {flex: 1, color: Colors.black, fontSize: hp(1.7)},
});
