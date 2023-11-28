import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import QuestionaireHome from '../Screens/Questionaire/QuestionaireHome';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddQuestionaire from '../Screens/Questionaire/AddQuestionaire';

export default function QuestionaireStack() {
  const QuestionaireStack = createNativeStackNavigator();
  return (
    <QuestionaireStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <QuestionaireStack.Screen
        name="QuestionaireHome"
        component={QuestionaireHome}
      />
      <QuestionaireStack.Screen
        name="AddQuestionaire"
        component={AddQuestionaire}
      />
    </QuestionaireStack.Navigator>
  );
}

const styles = StyleSheet.create({});
