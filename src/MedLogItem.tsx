import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Appearance } from "react-native";
import { medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

interface MedLogItemProps {
    name: string;
    dose: number;
    time: Date;
}

function MedListItem({name, dose, time}: MedLogItemProps){
 
    return(
    <View style={Styles.viewStyle}>
        <Text style={Styles.textStyle}>{name} </Text>
        <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}>| {dose}mg |</Text>
        <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}> {time.getHours()}:{time.getMinutes()} {time.toDateString()}</Text>
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