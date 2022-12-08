/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import  {type PropsWithChildren} from 'react';
import RNFS from 'react-native-fs';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateMUIStyled } from '@mui/material';
import ListMeds from './ListMeds';
import * as data from '../meds.json';
import AddMed from './AddMed';
import MedLog from './MedLog';


export interface medLogInstance {
  id: string;
  name: string;
  time: Date;
  dose: number;
}

export interface currMedInstance {
  id: string;
  name: string;
  dose: number;
}
enum screens {
  list = 'list',
  add = 'add',
  log = 'log',
};

function App(){
  const [currentScreen, setCurrentScreen] = useState<screens>(screens.list);
  const [medList, setMedList] = useState<currMedInstance[]>([]);
  const [medLog, setMedLog] = useState<medLogInstance[]>([]);

  useEffect(()=> {
    const medData: currMedInstance[] = data.currentMeds;
    const medLogData: medLogInstance[] = data.medLogs.map((i)=> {
      return {
        id: i.id,
        name: i.name,
        dose: i.dose,
        time: new Date(i.time),
      }
    });

    setMedLog(medLogData);
    setMedList(medData);
  },[]);

  if(!medList.length){
    return(
      <SafeAreaView>
        <Text>
        No meds :D
        </Text>
      </SafeAreaView>
    );
  }else if(currentScreen === screens.list){
    return(
      <SafeAreaView>
        <ListMeds 
        onAddPress={()=> {setCurrentScreen(screens.add)}}
        onLogPress={()=> {setCurrentScreen(screens.log)}}
      />
      </SafeAreaView>
    )
  }else if(currentScreen === screens.add){
    return(
      <SafeAreaView>
        <AddMed onBackPress={()=>{
          setCurrentScreen(screens.list);
        }}/>
      </SafeAreaView>
    );
  }else if(currentScreen === screens.log){
    return(
      <SafeAreaView>
        <MedLog onBackPress={()=>{
          setCurrentScreen(screens.list);
        }}/>
      </SafeAreaView>
    );

  }
  
}

export default App;
