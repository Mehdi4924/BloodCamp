import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PrickHome from '../Screens/Prick/PrickHome';
import AddPricking from '../Screens/Prick/AddPricking';

export default function PrickStack() {
  const PrickStack = createNativeStackNavigator();
  return (
    <PrickStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <PrickStack.Screen name="PrickHome" component={PrickHome} />
      <PrickStack.Screen name="AddPricking" component={AddPricking} />
    </PrickStack.Navigator>
  );
}

const styles = StyleSheet.create({});
