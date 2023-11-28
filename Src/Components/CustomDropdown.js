import {Icon} from '@rneui/themed';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../Constants/Colors';
import {hp, wp} from '../Constants/Responsive';
const CustomDropdown = props => {
  const [value, setValue] = useState(null);
  return (
    <View style={[styles.container, props.container]}>
      <Dropdown
        style={[styles.dropdown, props.dropdown]}
        placeholderStyle={[styles.placeholderStyle, props.placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, props.selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, props.inputSearchStyle]}
        iconStyle={[styles.iconStyle, props.iconStyle]}
        itemTextStyle={[styles.itemTextStyle, props.itemTextStyle]}
        data={props.data}
        search
        maxHeight={300}
        labelField={props.labelField}
        valueField={props.valueField}
        placeholder={props.placeholder}
        searchPlaceholder="Search..."
        value={props.value}
        onChange={props.onChange}
        renderLeftIcon={() => (
          <Icon
            name={props.iconName}
            type={props.iconType}
            color={Colors.primary}
            size={hp(3.5)}
            style={[{marginRight: wp(1.5)}, props.iconStyles]}
          />
        )}
      />
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    width: wp(42),
  },
  dropdown: {
    paddingHorizontal: wp(3.5),
    height: hp(6.5),
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
    color: Colors.black,
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: hp(1.7),
    color: Colors.grey,
    marginLeft: hp(1),
  },
  selectedTextStyle: {
    fontSize: hp(1.7),
    color: Colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: hp(5),
    color: Colors.grey,
    fontSize: 16,
  },
  itemTextStyle: {
    fontSize: hp(1.7),
    color: Colors.black,
  },
});
