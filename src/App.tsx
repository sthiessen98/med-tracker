/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import ListMeds from './Screens/ListMeds';
import AddMed from './Screens/AddMed';
import MedLog from './Screens/MedLog';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './Util/navigationTypes';



export interface medLogInstance {
  id: string;
  medId?: string;
  name: string;
  time: Date;
  dose: number;
  color?: string;
}

export interface currMedInstance {
  id: string;
  name: string;
  dose: number;
  maxDosage?: number;
  doseInterval?: number;
  color?: string;
  allowNotifications?: boolean;
}

function App(){
  const Stack = createNativeStackNavigator<RootStackParamList>();
  
  return(
    <>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}>
        <Stack.Screen name='medList' component={ListMeds} />
        <Stack.Screen name='addMed' component={AddMed} />
        <Stack.Screen name='medLog' component={MedLog} />
      </Stack.Navigator>
    </NavigationContainer><Toast />
    </>
  );
}

export default App;