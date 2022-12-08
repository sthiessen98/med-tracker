import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from "react-native";
import uuid from 'react-native-uuid';

interface MedListItemProps {
    med: currMedInstance;
    onDelete(): void;
}

function MedListItem({med, onDelete}: MedListItemProps){

    const addMedLog = async (newLog: medLogInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMedLog');
        const medLog: medLogInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMedLog = [...medLog, newLog];
        const updatedMedLogJson = JSON.stringify(updatedMedLog);
        await AsyncStorage.setItem('currentMedLog', updatedMedLogJson);
    }

    const showDeleteConfirmation = (med: currMedInstance) => {
        Alert.alert(
            `Delete ${med.name}`,
            `Are you sure you would like to delete ${med.name}? Your logs for this med will not be deleted.`,
            [
                {
                    text: "Confirm",
                    onPress: () => deleteMed(med),
                    style: "default"
                },
                {
                    text: "Cancel",
                    style: "cancel"
                },
            ],
            {
                cancelable: true,
            }
        )
    }

    const deleteMed = async(med: currMedInstance) => {
        const jsonValue = await AsyncStorage.getItem('currentMeds');
        const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMeds = meds.filter((i)=> i.id !== med.id);
        const updatedMedsJson = JSON.stringify(updatedMeds);
        await AsyncStorage.setItem('currentMeds', updatedMedsJson);
        onDelete();
    }
    
    return(
        <View style={{  flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 8}} onPress={async ()=>{
                            const log: medLogInstance = {
                                id: uuid.v4().toString(),
                                name: med.name,
                                dose: med.dose,
                                time: new Date(),
                            };
                            await addMedLog(log);
                        }}> 
                <View style={Styles.viewStyle}>
                    <Text style={Styles.textStyle}>{med.name} - </Text>
                    <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}> Dose: {med.dose}mg</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 2}} onPress={()=> {
                showDeleteConfirmation(med);
            }}>
                <View style={Styles.deleteViewStyle}>
                    <Text style={Styles.minorTextStyle}>Delete </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

}

const Styles = {
    textStyle: {
        color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', 
        fontSize: 22,        
    },
    minorTextStyle: {
        color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', 
        fontSize: 14, 
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
    deleteViewStyle: {
        backgroundColor: 'red',
        flexDirection: 'row' as const,
        height: 55,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
        borderColor: 'red',
        borderWidth: 1,
        borderStyle: "solid" as const,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
    }
}

export default MedListItem;