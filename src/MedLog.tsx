import React, { useEffect, useState } from "react";
import { Appearance, Button, FlatList, SafeAreaView, Text, View } from "react-native";
import { medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedLogItem from "./MedLogItem";
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";


interface medProps {
    item: medLogInstance;
}
interface medLogProps {
    onBackPress(): void;
}


function ListMeds({ onBackPress }: medLogProps) {
    const [medLog, setMedLog] = useState<medLogInstance[]>([]);

    const renderItem = ({item}: medProps)=>(
        <MedLogItem name={item.name} dose={item.dose} time={item.time}/>
        );
    
    useEffect(()=> {
        async function fetchMedList(){
            let response = await AsyncStorage.getItem('currentMedLog');
            if(response !== null){
                const result: medLogInstance[] = JSON.parse(response);
                const datedResults: medLogInstance[] = result.map((i)=> {
                    return {
                        id: i.id,
                        name: i.name,
                        dose: i.dose,
                        time: new Date(i.time),
                    }
                });
                setMedLog(datedResults);
            }else{
                setMedLog([]);
            }
        }
        fetchMedList();
    },[]);

    return(
        <View style={{height: '100%', width: '100%', flexDirection: 'column', alignItems: 'stretch'}}>
            <ScreenHeader title={'Med Log'}/>
            <FlatList
            data={medLog.sort((a,b)=> a.time.getTime() < b.time.getTime() ? 1 : -1)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            />
            <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> onBackPress()}/>
        </View>

    );
};

export default ListMeds;