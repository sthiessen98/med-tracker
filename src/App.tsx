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
import ListMeds from './ListMeds';
import AddMed from './AddMed';
import MedLog from './MedLog';
import Toast from 'react-native-toast-message';



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
enum screens {
  list = 'list',
  add = 'add',
  log = 'log',
};

function App(){
  const [currentScreen, setCurrentScreen] = useState<screens>(screens.list);
  const [editableItem, setEditableItem] = useState<currMedInstance | undefined>(undefined);

  if(currentScreen === screens.list){
    return(
      <SafeAreaView>
        <ListMeds 
        onAddPress={()=> {setCurrentScreen(screens.add)}}
        onEditPress={(item)=> {
          setCurrentScreen(screens.add);
          setEditableItem(item);
        }}
        onLogPress={()=> {setCurrentScreen(screens.log)}}
      />
      <Toast/>
      </SafeAreaView>
    )
  }else if(currentScreen === screens.add){
    return(
      <SafeAreaView>
        <AddMed 
        editableItem={editableItem}
        onBackPress={()=>{
          setCurrentScreen(screens.list);
          setEditableItem(undefined);
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
