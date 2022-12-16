import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Appearance } from "react-native";
import { medLogInstance } from "./App";

interface MedLogItemProps {
    item: medLogInstance;
    onPress:(selected: medLogInstance)=> void;
}

function MedListItem({item, onPress}: MedLogItemProps){

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
    return(
    <View style={Styles.viewStyle}>
        <TouchableOpacity style={Styles.touchableStyle} onPress={()=> onPress(item)}>
        <Text style={Styles.textStyle}>{item.name} </Text>
            <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}>| {item.dose}mg |</Text>
            <Text style={{color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black', fontSize: 14}}> {item.time.getHours() < 10 ? 0 : ''}{item.time.getHours()}:{item.time.getMinutes() < 10 ? 0 : ''}{item.time.getMinutes()}   {monthNames[item.time.getMonth()]} {item.time.getDate()}</Text>
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
    touchableStyle: {
        flexDirection: 'row' as const,
        width: '100%',
        height: 55,
        justifyContent: "center" as const,
        alignItems: 'center' as const,
        padding: 10,
    }
}

export default MedListItem;