import React, { useState } from "react";
import { Appearance, Button, SafeAreaView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { currMedInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface addMedProps {
  //  meds: currMedInstance[];
    onBackPress(): void;
}

function AddMed({onBackPress}: addMedProps){

    const [name, setName] = useState<string>('');
    const [dosage, setDosage] = useState<number>(0);

    const updateMedList = async (newMed: currMedInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMeds');
        const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMeds = [...meds, newMed];
        const updatedMedsJson = JSON.stringify(updatedMeds);
        await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    }


    return(
        <SafeAreaView style={{flexDirection: 'column', alignItems: 'stretch'}}>
             <View style={{ alignItems: 'stretch',  flexDirection: 'row', justifyContent: 'space-between', height: 40, marginBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 2, borderStyle: 'solid' }}>
                <View></View>
                <View>
                    <Text style={Styles.textStyle}>Add New Med</Text>
                </View>
                <View>
                    <Button title="Back" onPress={()=>{
                        onBackPress();
                    }} />
                </View>
            </View>
            <TextInput style={Styles.textInput} placeholder={'Name'} onChangeText={(value)=> setName(value)}/>
            <TextInput style={Styles.textInput} placeholder={'Dosage (mg)'} onChangeText={(value)=> setDosage(parseInt(value))}/>
            <Button title={'Submit'} onPress={async ()=>{
                if(name !== null && dosage > 0){
                    const newMed: currMedInstance = {
                        id: uuid.v4().toString(),
                        name: name,
                        dose: dosage,
                    }
                    await updateMedList(newMed);
                    onBackPress();
                }
            }}/>
        </SafeAreaView>
    );
}

const Styles = {
    textStyle: {
        color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', 
        fontSize: 22,
        alignItems: 'center' as const,
        
    },
    viewStyle: {
        flexDirection: 'row' as const,
        height: 55,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
        borderColor: Appearance.getColorScheme() === 'dark' ? 'white' : 'black',
        borderWidth: 1,
         borderStyle: "solid" as const,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
    },
    textInput: {
        height: 55,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
    }
}

export default AddMed;