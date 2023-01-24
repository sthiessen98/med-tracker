import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Appearance } from "react-native";
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

    return(
    <View style={{flexDirection: 'row'}}>
         <View className='bg-emerald-600 flex-row justify-center align-center basis-4/5 border rounded p-2 mx-1 mt-2 h-[55px]'>
            <TouchableOpacity className='flex-row h-[50px] justify-center align-center p-2' onPress={()=> onPress(item)}>
            <Text className='text-white text-xl'>{item.name} </Text>
                <Text className='text-white text-sm pt-1'>| {item.dose}mg |</Text>
                <Text className='text-white text-sm pt-1'> {item.time.getHours() < 10 ? 0 : ''}{item.time.getHours()}:{item.time.getMinutes() < 10 ? 0 : ''}{item.time.getMinutes()}   {monthNames[item.time.getMonth()]} {item.time.getDate()}</Text>
            </TouchableOpacity>
        </View>
        <View className='bg-red-700 flex-row justify-center align-center h-[50px] px-3 border rounded-full mx-1 mt-2'>
            <TouchableOpacity className='flex-row h-[55px] justify-center align-center p-2' onPress={()=> showDeleteConfirmation(item)}>
                <Text className='text-white text-lg'>X</Text>
            </TouchableOpacity>
        </View>
    </View>
    );

}

const Styles = {
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
        flex: 8,
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
        borderRadius: 7,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
        flex: 1,
    },
    touchableStyle: {
        flexDirection: 'row' as const,
        width: '100%',
        height: 55,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
    },
    buttonStyle: {
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
        flex: 2,
    }
}

export default MedListItem;