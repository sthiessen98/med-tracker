import React, { useEffect, useState, useCallback } from "react";
import { FlatList, View } from "react-native";
import { currMedInstance, medLogInstance } from "./App";
import MedListItem from "./MedListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";
import ListSeperator from "./Components/ListSeperator";
import Toast from "react-native-toast-message";
import { medListProps } from "./Util/navigationTypes";
import { useFocusEffect } from "@react-navigation/native";


interface medProps {
    item: currMedInstance
}


function ListMeds({ navigation }: medListProps){
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
        <MedListItem 
            med={item} 
            logs={medLogs.filter((log)=> log.medId === item.id)} 
            editMode={editMode} 
            onEditPress={(item)=> navigation.navigate('addMed', {
                editableItem: item
            })} 
            refetch={()=> refetchData()} 
            showToast={(med: currMedInstance)=> showToast(med)}/>
        );

    const refetchData = async() => {
        let response = await AsyncStorage.getItem('currentMeds');
        response !== null ? setMedList(JSON.parse(response)) : setMedList([]);
        let responseLogs = await AsyncStorage.getItem('currentMedLog');
        responseLogs !== null ? setMedLogs(JSON.parse(responseLogs)) : setMedLogs([]);
    };

    useFocusEffect(
        React.useCallback(() => {
          refetchData();
        }, [])
      );

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
                <ScreenFooter leftButtonTitle="Logs" leftButtonPress={()=> navigation.navigate('medLog')} rightButtonTitle='Add' rightButtonPress={()=> navigation.navigate('addMed')}/>
            </View>              
        </View>
    );
};

export default ListMeds;