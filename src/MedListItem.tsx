import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const lastTaken: medLogInstance | undefined = logs.length ? logs?.sort((a,b)=> a.time > b.time ? 1 : -1)?.[0] : undefined;
    let lastTakenDisplay: string;
    if(lastTaken?.time !== undefined){
        const lastTakenDate= new Date(lastTaken.time);
        lastTakenDisplay = `Taken: ${lastTakenDate.getHours() < 10 ? 0 : ''}${lastTakenDate.getHours()}:${lastTakenDate.getMinutes() < 10 ? 0 : ''}${lastTakenDate.getMinutes()} ${monthNames[lastTakenDate.getMonth()]} ${lastTakenDate.getDate()}`;
    }else{
        lastTakenDisplay = '  ';
    }
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
        ${takenRecently ? 'bg-red-600' : 'bg-primary'} 
        h-[50px] p-2.5 mx-1 mt-2 border rounded-md`;
    
    return(
        <View className='flex-row'>
            <TouchableOpacity className='flex-row w-full h-[60px]' onPress={async ()=>{
                            const log: medLogInstance = {
                                id: uuid.v4().toString(),
                                medId: med.id,
                                name: med.name,
                                dose: med.dose,
                                time: new Date(),
                            };
                            await addMedLog(log);
                        }}> 
            <View className='border-white border-2 rounded-full h-[45px] w-[45px] mt-1 ml-1 mb-2' style={{backgroundColor: med.color}}/>
            <View className='basis-2/5 w-full h-full mx-1'>
                <View className='flex-col h-full items-start'>
                    <Text className='basis-1/2 text-black text-lg'>{med.name}</Text>
                    <Text className='basis-1/2 text-black'>{med.dose}mg</Text>
                </View>

            </View>
            <View className='flex basis-2/5 w-full mx-1'>
                <View className='flex-col items-end w-full h-full mr-1'>
                    {!!lastTaken?.time && (
                        <Text className='basis-1/2 text-black italic'>{lastTakenDisplay}</Text>
                    )}
                     <Text className='basis-1/2 text-red-500 text-x italic font-bold'>Do not take for 13:32</Text>

                </View>
            </View>
            </TouchableOpacity>

        </View>
    );

}


export default MedListItem;