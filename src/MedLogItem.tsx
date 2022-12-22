import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { Appearance } from "react-native";
import { medLogInstance } from "./App";

interface MedLogItemProps {
    item: medLogInstance;
    onPress:(selected: medLogInstance)=> void;
    refetch(): void;
}

function MedListItem({item, onPress, refetch}: MedLogItemProps){

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
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
         <View style={Styles.viewStyle}>
            <TouchableOpacity style={Styles.touchableStyle} onPress={()=> onPress(item)}>
            <Text style={Styles.textStyle}>{item.name} </Text>
                <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}>| {item.dose}mg |</Text>
                <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}> {item.time.getHours() < 10 ? 0 : ''}{item.time.getHours()}:{item.time.getMinutes() < 10 ? 0 : ''}{item.time.getMinutes()}   {monthNames[item.time.getMonth()]} {item.time.getDate()}</Text>
            </TouchableOpacity>
        </View>
        <View style={Styles.deleteViewStyle}>
            <TouchableOpacity style={Styles.touchableStyle} onPress={()=> showDeleteConfirmation(item)}>
                <Text style={{color: 'white', fontSize: 20}}>X</Text>
            </TouchableOpacity>
        </View>
    </View>
    );

}

const Styles = {
    textStyle: {
        color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', 
        fontSize: 22,        
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