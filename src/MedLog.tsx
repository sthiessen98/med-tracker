import React, { useEffect, useState } from "react";
import { Appearance, Button, FlatList, SafeAreaView, Text, View } from "react-native";
import { medLogInstance } from "./App";
import MedListItem from "./MedListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedLogItem from "./MedLogItem";


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
        <SafeAreaView style={{flexDirection: 'column', alignItems: 'stretch'}}>
            <View style={{ alignItems: 'stretch',  flexDirection: 'row', justifyContent: 'space-between', height: 40, marginBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 2, borderStyle: 'solid' }}>
                <View></View>
                <View>
                    <Text style={{fontSize:20, padding: 4, color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}}>Med Log</Text>
                </View>
                <View>
                    <Button title="Back" onPress={()=>{
                        onBackPress();
                    }} />
                </View>
            </View>

            <FlatList
            data={medLog.sort((a,b)=> a.time.getTime() < b.time.getTime() ? 1 : -1)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            />
        </SafeAreaView>

    );
};

export default ListMeds;