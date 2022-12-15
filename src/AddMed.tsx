import React, { useState } from "react";
import { Appearance, Button, SafeAreaView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { currMedInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";

interface addMedProps {
    onBackPress(): void;
}

function AddMed({onBackPress}: addMedProps){

    const [name, setName] = useState<string>('');
    const [dosage, setDosage] = useState<number>(0);
    const [maxDosage, setMaxDosage] = useState<number>(0);
    const [interval, setInterval] = useState<number>(0);

    const updateMedList = async (newMed: currMedInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMeds');
        const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMeds = [...meds, newMed];
        const updatedMedsJson = JSON.stringify(updatedMeds);
        await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    }


    return(
        <View style={{height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
            <ScreenHeader title={'Add Med'}/>

            <View>
                <TextInput style={Styles.textInput} placeholder={'Name'} onChangeText={(value)=> setName(value)}/>
                <TextInput style={Styles.textInput} placeholder={'Dosage (mg)'} onChangeText={(value)=> setDosage(parseInt(value))}/>
                <TextInput style={Styles.textInput} placeholder={'Max Dosage (mg) (optional)'} onChangeText={(value)=> setMaxDosage(parseInt(value))}/>
                <TextInput style={Styles.textInput} placeholder={'Time between doses (hours)'} onChangeText={(value)=> setInterval(parseInt(value))}/>
                <Button title={'Submit'} onPress={async ()=>{
                if(name !== null && dosage > 0){
                    const newMed: currMedInstance = {
                        id: uuid.v4().toString(),
                        name: name,
                        dose: dosage,
                        maxDosage: maxDosage > 0 ? maxDosage : undefined,
                        doseInterval: interval > 0 ? interval : undefined,
                    }
                    await updateMedList(newMed);
                    onBackPress();
                }
            }}/>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> onBackPress()}/>
            </View>
        </View>
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