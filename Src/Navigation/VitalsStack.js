import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import VitalsHome from '../Screens/Vitals/VitalsHome';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VitalDetails from '../Screens/Vitals/VitalDetails';

export default function VitalsStack() {
  const VitalsStack = createNativeStackNavigator();
  return (
    <VitalsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <VitalsStack.Screen name="VitalsHome" component={VitalsHome} />
      <VitalsStack.Screen name="VitalDetails" component={VitalDetails} />
    </VitalsStack.Navigator>
  );
}

const styles = StyleSheet.create({});
