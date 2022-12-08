import React, { useEffect, useState } from "react";
import { Button, FlatList, SafeAreaView, Text, View } from "react-native";
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
        <MedListItem name={item.name} dose={item.dose}/>
        );
    
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
                <Text style={{fontSize:20, padding: 4, color: 'black'}}>Current Meds</Text>
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