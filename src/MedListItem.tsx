import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from "react-native";
import uuid from 'react-native-uuid';

interface MedListItemProps {
    name: string;
    dose: number;
}

function MedListItem({name, dose}: MedListItemProps){

    const addMedLog = async (newLog: medLogInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMedLog');
        const medLog: medLogInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMedLog = [...medLog, newLog];
        const updatedMedLogJson = JSON.stringify(updatedMedLog);
        await AsyncStorage.setItem('currentMedLog', updatedMedLogJson);
    }
    
    return(
        <View>
            <TouchableOpacity onPress={async ()=>{
                            console.log('touch');
                            const log: medLogInstance = {
                                id: uuid.v4().toString(),
                                name: name,
                                dose: dose,
                                time: new Date(),
                            };
                            await addMedLog(log);
                        }}> 
                <View style={Styles.viewStyle}>
                    <Text style={Styles.textStyle}>{name} - </Text>
                    <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}> Dose: {dose}mg</Text>
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
}

export default MedListItem;