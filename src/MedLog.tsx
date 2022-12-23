import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedLogItem from "./MedLogItem";
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";
import MedLogEditItem from "./MedLogEditItem";


interface medProps {
    item: medLogInstance;
}
interface medLogProps {
    onBackPress(): void;
}


function ListMeds({ onBackPress }: medLogProps) {
    const [medLog, setMedLog] = useState<medLogInstance[]>([]);
    const [currEditLog, setCurrEditLog] = useState<medLogInstance | null>(null);

    const updateMedLogList = async (updatedItem: medLogInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMedLog');
        const medLogs: medLogInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMedLogs = [...medLogs.filter((l)=> l.id !== updatedItem.id), updatedItem];
        const updatedMedLogJson = JSON.stringify(updatedMedLogs);
        await AsyncStorage.setItem('currentMedLog', updatedMedLogJson);
        refetchData();
    }

    const refetchData = async() => {
        const response = await AsyncStorage.getItem('currentMedLog');
        if(response !== null){
            const result: medLogInstance[] = JSON.parse(response);
            const datedResults: medLogInstance[] = result.map((i)=> {
                return {
                    id: i.id,
                    medId: i?.medId ?? undefined, 
                    name: i.name,
                    dose: i.dose,
                    time: new Date(i.time),
                }
            });
            setMedLog(datedResults);
        }else{
            setMedLog([]);
        }
    };

    const renderItem = ({item}: medProps)=>(
        <View>
            <MedLogItem item={item} onPress={setCurrEditLog} refetch={()=> refetchData()}/>
            {item === currEditLog && (
                <MedLogEditItem item={item} onClose={()=> setCurrEditLog(null)} 
                onSubmit={async (timestamp: number)=> {
                    const originalLog = medLog.find((i)=> i.id === currEditLog.id);
                    if(originalLog){
                        const updatedLog: medLogInstance = {
                            id: originalLog.id,
                            medId: originalLog?.medId ?? undefined,
                            name: originalLog.name,
                            dose: originalLog.dose,
                            time: new Date(timestamp),
                        }
                        await updateMedLogList(updatedLog);
                    }
                }}
                />
            )}
        </View>       
        );
    
    useEffect(()=> {
        refetchData();
    },[]);
    
    return(
        <View style={{backgroundColor: '#ecf4f4', height: '100%', width: '100%', flexDirection: 'column', alignItems: 'stretch'}}>
            <ScreenHeader title={'Med Log'}/>
            <FlatList
            data={medLog.sort((a,b)=> a?.time?.getTime() < b?.time?.getTime() ? 1 : -1)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            />
            <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> onBackPress()}/>
        </View>

    );
};

export default ListMeds;