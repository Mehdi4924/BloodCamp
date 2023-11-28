import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SyncCamp from '../Screens/Auth/SyncCamp';
import Login from '../Screens/Auth/Login';

export default function AuthStack() {
  const AuthStack = createNativeStackNavigator();
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="SyncCamp" component={SyncCamp} />
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}
