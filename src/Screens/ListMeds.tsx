import React, { useRef, useState } from "react";
import { FlatList, Text, View, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { currMedInstance, medLogInstance } from "../App";
import MedListItem from "../Components/MedListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "../Components/ScreenHeader";
import ScreenFooter from "../Components/ScreenFooter";
import ListSeperator from "../Components/ListSeperator";
import Toast from "react-native-toast-message";
import { medListProps } from "../Util/navigationTypes";
import { useFocusEffect } from "@react-navigation/native";
import Svg from 'react-native-svg';
import Stethescope from '../stethescope.svg';
import { reorderMeds } from "../Util/localStorage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function ListMeds({ navigation }: medListProps){
    const [medList, setMedList] = useState<currMedInstance[]>([]);
    const [medLogs, setMedLogs] = useState<medLogInstance[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);

    const showToast = (med: currMedInstance) => {
        Toast.show({
          type: 'success',
          text1: 'Log Added',
          text2: `Successfully logged ${med.name} usage`
        });
      };

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


    const renderItem = ({ item, drag, isActive }: RenderItemParams<currMedInstance>) => {
        const itemLogs = medLogs.filter((log)=> log.medId === item.id); 
    return (
      <ScaleDecorator>
          <View style={{
            height: 70,
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            }}>
            <MedListItem 
                med={item} 
                logs={itemLogs}
                refetch={refetchData} 
                showToast={showToast} 
                editMode={editMode} 
                onEditPress={(item)=> navigation.navigate('addMed', {
                    editableItem: item
                })}
                drag={drag}
                isActive={isActive}
                />
          </View>
      </ScaleDecorator>
    );
  };


    return(
        <View className='bg-background h-full w-screen flex-col justify-start align-stretch'>
            <View>
                <ScreenHeader title={'Current Meds'} mode={editMode ? 'edit' : 'home'} onPress={()=> setEditMode(!editMode)}/>
            </View>
            <View className="basis-4/5 flex-grow">
                {medList.length !== 0 && (
                        <DraggableFlatList
                        data={medList}
                         onDragEnd={async ({ data }) => {
                            setMedList(data);
                            await reorderMeds(data);
                            }}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}/>
                )}
                {medList.length === 0 && (
                    <View className='flex-col h-full align-center bg-background'>
                        <View className='basis-3/5'>
                            <Svg style={styles.svg} height="88%" width="88%" viewBox={`0 0 ${screenWidth} ${screenHeight}`}>
                                <Stethescope width={screenWidth} height={screenHeight}/>
                            </Svg>
                        </View>
                        <Text className='basis-2/5 text-black text-lg text-center font-bold'>You don't have any medications saved yet. Press the add button to begin adding your first med!</Text>
                    </View>
                )}
            </View>
            <View className="basis-1/10 flex-end">
                <ScreenFooter leftButtonTitle="Logs" leftButtonPress={()=> navigation.navigate('medLog')} rightButtonTitle='Add' rightButtonPress={()=> navigation.navigate('addMed')}/>
            </View>              
        </View>
    );
};

const styles= StyleSheet.create({
    svg: {
        position: 'absolute',
        left: '30%',
        top: '30%',
        transform: [
           {translateX: - screenWidth * 0.24},
           {translateY: - screenWidth * 0.24}
        ]
    }
});

export default ListMeds;