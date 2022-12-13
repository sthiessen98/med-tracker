import React from "react";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { medLogInstance } from "./App";
import DateTimePicker from '@react-native-community/datetimepicker';

interface IProps{
    item: medLogInstance;
    onSubmit:(timestamp: number) => void;
    onClose(): void;
}

function MedLogEditItem({item, onSubmit, onClose}: IProps){

    return(
        <View>
            <DateTimePicker mode='time' is24Hour={true} value={item.time} onChange={(value)=> {
            if(value.nativeEvent.timestamp && value.type === 'set'){
                onSubmit(value.nativeEvent.timestamp);
                onClose();
            }else{
                onClose();
            }
            }}/>
        </View>
    );
}

export default MedLogEditItem;