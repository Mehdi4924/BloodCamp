import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DonorRegistration from '../Screens/Registration/DonorRegistration';
import RegistrationHome from '../Screens/Registration/RegistrationHome';

export default function RegistrationStack() {
  const RegistrationStack = createNativeStackNavigator();
  return (
    <RegistrationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <RegistrationStack.Screen
        name="RegistrationHome"
        component={RegistrationHome}
      />
      <RegistrationStack.Screen
        name="DonorRegistration"
        component={DonorRegistration}
      />
    </RegistrationStack.Navigator>
  );
}
