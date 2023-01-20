import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const doseTakenRecently: number = logs.filter((log) => new Date(log.time).toISOString() > cutOffTime.toISOString()).reduce((partialSum, a)=> partialSum + a.dose, 0);
    const takenRecently = Boolean(doseTakenRecently >= (med?.maxDosage ?? 0) && med?.maxDosage && med?.doseInterval);

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

    //Dynamic Tailwind Styling
    const medListStyle = `flex-row justify-center align-center 
        ${takenRecently ? 'bg-red-600' : 'bg-emerald-600'} 
        h-[50px] p-2.5 mx-1 mt-2 border rounded-md`;
    
    return(
        <View className='flex-row'>
            <TouchableOpacity className='basis-3/5' onPress={async ()=>{
                            const log: medLogInstance = {
                                id: uuid.v4().toString(),
                                medId: med.id,
                                name: med.name,
                                dose: med.dose,
                                time: new Date(),
                            };
                            await addMedLog(log);
                        }}> 
                <View className={medListStyle}>
                    <Text className="text-white text-lg text-center">{med.name} - </Text>
                    <Text className="text-white text-sm text-center pt-1"> {med.dose}mg</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity className='basis-1/5' onPress={()=> {
                onEditPress(med);
            }}>
                <View className="justify-center bg-orange-600 h-[50px] p-2.5 mx-1 mt-2 border rounded-md">
                    <Text className="text-white text-sm text-center">Edit </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity className='basis-1/5' onPress={()=> {
                showDeleteConfirmation(med);
            }}>
                <View className="justify-center bg-red-600 h-[50px] p-2.5 mx-1 mt-2 border rounded-md">
                    <Text className="text-white text-sm text-center">Delete </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

}

export default MedListItem;