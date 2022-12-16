import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from "react-native";
import uuid from 'react-native-uuid';

interface MedListItemProps {
    med: currMedInstance;
    logs: medLogInstance[];
    refetch(): void;
    onEditPress:(item: currMedInstance) => void;
}

function MedListItem({med, logs, refetch, onEditPress}: MedListItemProps){
    const currentTime = new Date();
    const cutOffTime = new Date(currentTime.setHours(currentTime.getHours()- (med?.doseInterval ?? 0)));
    const takenRecently: boolean = Boolean(logs.filter((log) => new Date(log.time).toISOString() > cutOffTime.toISOString()).length && med?.doseInterval);


    const addMedLog = async (newLog: medLogInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMedLog');
        const medLog: medLogInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMedLog = [...medLog, newLog];
        const updatedMedLogJson = JSON.stringify(updatedMedLog);
        await AsyncStorage.setItem('currentMedLog', updatedMedLogJson);
        refetch();
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
        refetch();
    }
    
    return(
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 6}} onPress={async ()=>{
                            const log: medLogInstance = {
                                id: uuid.v4().toString(),
                                medId: med.id,
                                name: med.name,
                                dose: med.dose,
                                time: new Date(),
                            };
                            await addMedLog(log);
                        }}> 
                <View style={takenRecently ? Styles.warningViewStyle : Styles.viewStyle}>
                    <Text style={Styles.textStyle}>{med.name} - </Text>
                    <Text style={Styles.minorTextStyle}> {med.dose}mg</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 2}} onPress={()=> {
                onEditPress(med);
            }}>
                <View style={Styles.editViewStyle}>
                    <Text style={Styles.minorTextStyle}>Edit </Text>
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
        color: 'white', 
        fontSize: 22,        
    },
    minorTextStyle: {
        color: 'white', 
        fontSize: 14, 
    },
    viewStyle: {
        backgroundColor: '#64a460',
        flexDirection: 'row' as const,
        height: 50,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: "solid" as const,
        borderRadius: 7,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
    },
    warningViewStyle: {
        backgroundColor: '#b30900',
        flexDirection: 'row' as const,
        height: 50,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: "solid" as const,
        borderRadius: 7,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
    },
    deleteViewStyle: {
        backgroundColor: '#BC5A41',
        flexDirection: 'row' as const,
        height: 50,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: "solid" as const,
        borderRadius: 3,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
    },
    editViewStyle: {
        backgroundColor: 'orange',
        flexDirection: 'row' as const,
        height: 50,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: "solid" as const,
        borderRadius: 3,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
    }
}

export default MedListItem;