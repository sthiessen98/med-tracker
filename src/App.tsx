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

  if(currentScreen === screens.list){
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
