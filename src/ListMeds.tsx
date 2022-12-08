import React, { useEffect, useState } from "react";
import { Appearance, Button, FlatList, SafeAreaView, Text, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import MedListItem from "./MedListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';


interface medProps {
    item: currMedInstance
}
interface medListProps {
    onAddPress(): void;
    onLogPress(): void;
}


function ListMeds({ onAddPress, onLogPress }: medListProps) {
    const [medList, setMedList] = useState<currMedInstance[]>([]);

    const renderItem = ({item}: medProps)=>(
        <MedListItem med={item} onDelete={()=> refetchMedList()}/>
        );

    const refetchMedList = async() => {
        let response = await AsyncStorage.getItem('currentMeds');
        response !== null ? setMedList(JSON.parse(response)) : setMedList([]);
    };

    useEffect(()=> {
        async function fetchMedList(){
            let response = await AsyncStorage.getItem('currentMeds');
            response !== null ? setMedList(JSON.parse(response)) : setMedList([]);
        }
        fetchMedList();
    },[]);

    return(
        <SafeAreaView style={{flexDirection: 'column', alignItems: 'stretch'}}>
            <View style={{ alignItems: 'stretch',  flexDirection: 'row', justifyContent: 'space-between', height: 40, marginBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 2, borderStyle: 'solid' }}>
                <Button title="Logs" onPress={()=> {
                    onLogPress();
                }}/>
                <Text style={{fontSize:20, padding: 4, color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}}>Current Meds</Text>
                <Button title="Add" onPress={()=>{
                    onAddPress();
                 }} />
            </View>

            <FlatList
            data={medList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            />
        </SafeAreaView>

    );
};

export default ListMeds;