import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import RegistrationStack from './RegistrationStack';
import QuestionaireStack from './QuestionaireStack';
import VitalsStack from './VitalsStack';
import PrickStack from './PrickStack';

export default function Routes() {
  const MainStack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <MainStack.Screen name="AuthStack" component={AuthStack} />
        <MainStack.Screen
          name="RegistrationStack"
          component={RegistrationStack}
        />
        <MainStack.Screen
          name="QuestionaireStack"
          component={QuestionaireStack}
        />
        <MainStack.Screen name="VitalsStack" component={VitalsStack} />
        <MainStack.Screen name="PrickStack" component={PrickStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
