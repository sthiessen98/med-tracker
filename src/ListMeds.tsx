import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import MedListItem from "./MedListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";
import ListSeperator from "./Components/ListSeperator";
import Toast from "react-native-toast-message";


interface medProps {
    item: currMedInstance
}
interface medListProps {
    onAddPress(): void;
    onEditPress: (item: currMedInstance) => void;
    onLogPress(): void;
}


function ListMeds({ onAddPress, onLogPress, onEditPress}: medListProps) {
    const [medList, setMedList] = useState<currMedInstance[]>([]);
    const [medLogs, setMedLogs] = useState<medLogInstance[]>([]);
    const [editMode, setEditMode] = useState<Boolean>(false);

    const showToast = (med: currMedInstance) => {
        Toast.show({
          type: 'success',
          text1: 'Log Added',
          text2: `Successfully logged ${med.name} usage`
        });
      }
      
    const renderItem = ({item}: medProps)=>(
        <MedListItem med={item} logs={medLogs.filter((log)=> log.medId === item.id)} editMode={editMode} onEditPress={onEditPress} refetch={()=> refetchData()} showToast={(med: currMedInstance)=> showToast(med)}/>
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
        <View className='bg-background h-full w-screen flex-col justify-start align-stretch'>
            <View>
                <ScreenHeader title={'Current Meds'} mode={editMode ? 'edit' : 'home'} onPress={()=> setEditMode(!editMode)}/>
            </View>
            <View className="basis-4/5 flex-grow">
                <FlatList
                data={medList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ListSeperator}
                />
            </View>
            <View className="basis-1/10 flex-end">
                <ScreenFooter leftButtonTitle="Logs" leftButtonPress={()=> onLogPress()} rightButtonTitle='Add' rightButtonPress={()=> onAddPress()}/>
            </View>              
        </View>
    );
};

export default ListMeds;