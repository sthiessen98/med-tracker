import React from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import uuid from 'react-native-uuid';

interface MedListItemProps {
    med: currMedInstance;
    logs: medLogInstance[];
    refetch(): void;
    showToast:(med: currMedInstance)=> void;
    editMode: Boolean;
    onEditPress:(item: currMedInstance) => void;
}

function MedListItem({med, logs, refetch, showToast, editMode, onEditPress}: MedListItemProps){

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    //Calculate if we've reached max dosage in allotted time frame
    const currentTime = new Date();
    const cutOffTime = new Date(currentTime.setHours(currentTime.getHours()- (med?.doseInterval ?? 0)));
    const doseTakenRecently: number = logs.filter((log) => new Date(log.time).toISOString() > cutOffTime.toISOString()).reduce((partialSum, a)=> partialSum + a.dose, 0);
    const takenRecently = Boolean(doseTakenRecently >= (med?.maxDosage ?? 0) && med?.maxDosage && med?.doseInterval);

    //Calculate time to when we can take next dose
    let minutesToNextDose: number;
    const maxDoses = (med?.maxDosage ?? 0) / med.dose;
    const filteredSortedLogs = logs.filter((log) => new Date(log.time).toISOString() > cutOffTime.toISOString()).sort((a,b)=> a.time > b.time ? 1 : -1);
    const oldestDose =  filteredSortedLogs.slice(filteredSortedLogs?.length - maxDoses, filteredSortedLogs?.length)?.[0] ?? undefined;

    if(oldestDose !== undefined){
        const oldestDoseDateDiff = new Date(oldestDose.time).getTime()- cutOffTime.getTime();
        minutesToNextDose = Math.floor(((oldestDoseDateDiff/1000)/60)); //miliseconds -> Minutes
    }else{
        minutesToNextDose = 0;
    }

    //Do we display Last Taken info
    const lastTaken: medLogInstance | undefined = logs.length ? logs?.sort((a,b)=> a.time > b.time ? -1 : 1)?.[0] : undefined;
    let lastTakenDisplay: string;
    if(lastTaken?.time !== undefined){
        const lastTakenDate= new Date(lastTaken.time);
        lastTakenDisplay = `Taken: ${monthNames[lastTakenDate.getMonth()]} ${lastTakenDate.getDate()} ${lastTakenDate.getHours() < 10 ? 0 : ''}${lastTakenDate.getHours()}:${lastTakenDate.getMinutes() < 10 ? 0 : ''}${lastTakenDate.getMinutes()}`;
    }else{
        lastTakenDisplay = '  ';
    }

    const addMedLog = async (newLog: medLogInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMedLog');
        const medLog: medLogInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMedLog = [...medLog, newLog];
        const updatedMedLogJson = JSON.stringify(updatedMedLog);
        await AsyncStorage.setItem('currentMedLog', updatedMedLogJson);
        showToast(med);
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
                                color: med?.color,
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
                {editMode && (
                    <View className='flex-row justify-end space-x-2'>
                        <TouchableOpacity className='items-center flex-col w-[55px] bg-orange-300 border-2 rounded-lg p-1' style={{elevation: 6}} onPress={()=> onEditPress(med)}>
                            <EntypoIcon name='edit' size={20} color="black"/> 
                            <Text className='text-black text-sm'>Edit</Text>    
                        </TouchableOpacity>
                        <TouchableOpacity className='items-center flex-col w-[55px] bg-red-500 border-2 rounded-lg p-1' style={{elevation: 6}} onPress={()=> showDeleteConfirmation(med)}>
                            <EntypoIcon name='trash' size={20} color="black"/> 
                            <Text className='text-black text-sm'>Delete</Text>    
                        </TouchableOpacity>
                    </View>
                )}
                {!editMode && (
                    <View className='flex-col items-end w-full h-full mr-1'>
                    {!!lastTaken?.time && (
                        <Text className='basis-1/2 text-black italic'>{lastTakenDisplay}</Text>
                     )}
                     {minutesToNextDose !== 0 && takenRecently && (
                        <Text className='basis-1/2 text-red-500 text-x italic font-bold'>Do not take for {Math.floor(minutesToNextDose/60)}:{minutesToNextDose%60 < 10 ? '0':''}{minutesToNextDose%60}</Text>
                     )}
 
                 </View>
                )}
            </View>
            </TouchableOpacity>

        </View>
    );

}


export default MedListItem;