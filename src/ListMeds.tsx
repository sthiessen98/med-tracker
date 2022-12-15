import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import MedListItem from "./MedListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";


interface medProps {
    item: currMedInstance
}
interface medListProps {
    onAddPress(): void;
    onLogPress(): void;
}


function ListMeds({ onAddPress, onLogPress }: medListProps) {
    const [medList, setMedList] = useState<currMedInstance[]>([]);
    const [medLogs, setMedLogs] = useState<medLogInstance[]>([]);

    const renderItem = ({item}: medProps)=>(
        <MedListItem med={item} logs={medLogs.filter((log)=> log.medId === item.id)} refetch={()=> refetchData()}/>
        );

    const refetchData = async() => {
        let response = await AsyncStorage.getItem('currentMeds');
        response !== null ? setMedList(JSON.parse(response)) : setMedList([]);
        let responseLogs = await AsyncStorage.getItem('currentMedLog');
        responseLogs !== null ? setMedLogs(JSON.parse(responseLogs)) : setMedLogs([]);
    };

    useEffect(()=> {
        refetchData();
    },[]);

    return(
        <View style={{height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
            <View>
                <ScreenHeader title={'Current Meds'}/>
            </View>
            <View style={{flex: 1}}>
                <FlatList
                data={medList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                />
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <ScreenFooter leftButtonTitle="Logs" leftButtonPress={()=> onLogPress()} rightButtonTitle='Add' rightButtonPress={()=> onAddPress()}/>
            </View>              
        </View>
    );
};

export default ListMeds;