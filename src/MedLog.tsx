import React, { useEffect, useMemo, useReducer, useState } from "react";
import { SectionList, Text, View } from "react-native";
import { medLogInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedLogItem from "./MedLogItem";
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";
import MedLogEditItem from "./MedLogEditItem";
import ListSeperator from "./Components/ListSeperator";
import MedLogGroupHeader from "./MedLogGroupHeader";


interface medProps {
    item: medLogInstance;
}
interface medLogProps {
    onBackPress(): void;
}

interface groupedLogs{
    title: string;
    data: medLogInstance[];
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
                    color: i?.color ?? undefined,
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
                            color: originalLog?.color ?? undefined,
                        }
                        await updateMedLogList(updatedLog);
                    }
                }}
                />
            )}
        </View>       
        );

    const groupedLogData = useMemo(()=> {
        let cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth()-1);
        cutoffDate.setDate(1);
        const filteredMedLogData = medLog.filter((log)=> log.time.getTime() > cutoffDate.getTime());
        if(!!filteredMedLogData.length){
            const data= filteredMedLogData.reduce<Record<string, medLogInstance[]>>((acc, item)=> {
                const key: string =
                item.time.getFullYear().toString() + 
                (item.time.getUTCMonth() < 10 ? '0' : '') +
                item.time.getUTCMonth().toString() + 
                (item.time.getUTCDate() < 10 ? '0' : '') +
                item.time.getDate().toString();

                if(!acc[key]){
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
            let sectionData: groupedLogs[] = [];
            Object.keys(data).forEach((key)=> {
                const d: groupedLogs = {title: key, data: data[key].sort((a,b)=>b.time.getTime() - a.time.getTime())};
                sectionData.push(d);
            });
            return sectionData.reverse();
        }
        return [];
    },[medLog]);
    
    useEffect(()=> {
        refetchData();
    },[]);

    
    return(
        <View className='bg-white flex-col align-stretch h-full w-full'>
            <ScreenHeader title={'Med Log'}/>
            <SectionList
            className='mx-2 bg-slate-100'
            sections={groupedLogData}
            renderItem={renderItem}
            renderSectionHeader={({section: {title}}) => (
                <MedLogGroupHeader dateString={title}/>
              )}
            keyExtractor={(item) => item.id}
            />
            <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> onBackPress()}/>
        </View>

    );
};

export default ListMeds;