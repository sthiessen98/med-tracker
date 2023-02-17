import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { medLogInstance } from "./App";

interface MedLogItemProps {
    item: medLogInstance;
    onPress:(selected: medLogInstance)=> void;
    refetch(): void;
}

function MedListItem({item, onPress, refetch}: MedLogItemProps){

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
 
    const showDeleteConfirmation = (log: medLogInstance) => {
        Alert.alert(
            `Delete Log`,
            `Are you sure you would like to delete this log for ${log.name}?`,
            [
                {
                    text: "Confirm",
                    onPress: () => deleteLog(log),
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

    const deleteLog = async(med: medLogInstance) => {
        const jsonValue = await AsyncStorage.getItem('currentMedLog');
        const logs: medLogInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedLogs = logs.filter((i)=> i.id !== med.id);
        const updatedLogsJson = JSON.stringify(updatedLogs);
        await AsyncStorage.setItem('currentMedLog', updatedLogsJson);
        refetch();
    }
    console.log(item?.color);
    return(
    <View className='flex-row'>
        <View className='border-white border-2 rounded-full h-[45px] w-[45px] mt-1 ml-1 mb-2' style={{backgroundColor: item?.color ?? '#FHGRGF'}}/>
        <View className='basis-2/5 w-full h-[60px] mx-1'>
            <View className='flex-col h-full items-start'>
                <Text className='basis-1/2 text-black text-lg'>{item.name.slice(0,10)}</Text>
                <Text className='basis-1/2 text-black text-xs'>{item.time.getHours() < 10 ? 0 : ''}{item.time.getHours()}:{item.time.getMinutes() < 10 ? 0 : ''}{item.time.getMinutes()} - {item.dose}mg</Text>
            </View>
        </View>

        <View className='flex basis-2/5 w-full mx-1'>
            <View className='flex-row justify-end space-x-2'>
                <TouchableOpacity className='items-center flex-col w-[55px] bg-orange-300 border-2 rounded-lg p-1' style={{elevation: 6}} onPress={()=> onPress(item)}>
                    <EntypoIcon name='edit' size={20} color="black"/> 
                    <Text className='text-black text-sm'>Edit</Text>    
                </TouchableOpacity>
                <TouchableOpacity className='items-center flex-col w-[55px] bg-red-500 border-2 rounded-lg p-1' style={{elevation: 6}} onPress={()=> showDeleteConfirmation(item)}>
                    <EntypoIcon name='trash' size={20} color="black"/> 
                    <Text className='text-black text-sm'>Delete</Text>    
                </TouchableOpacity>
            </View>
        </View>
    </View>
    );

}

export default MedListItem;