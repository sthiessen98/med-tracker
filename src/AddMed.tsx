import React, { useState } from "react";
import { Appearance, Button, SafeAreaView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { currMedInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";
import { Formik } from "formik";

interface addMedProps {
    editableItem?: currMedInstance;
    onBackPress(): void;
}

function AddMed({onBackPress, editableItem}: addMedProps){

    const [name, setName] = useState<string>(editableItem?.name ?? '');
    const [dosage, setDosage] = useState<number>(editableItem?.dose ?? 0);
    const [maxDosage, setMaxDosage] = useState<number>(editableItem?.maxDosage ?? 0);
    const [interval, setInterval] = useState<number>(editableItem?.doseInterval ?? 0);

    const updateMedList = async (newMed: currMedInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMeds');
        const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMeds = editableItem ? 
            [...meds.filter((m)=> m.id !== editableItem.id), newMed] :
            [...meds, newMed];
        const updatedMedsJson = JSON.stringify(updatedMeds);
        await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    }


    return(
        <View style={{backgroundColor: '#ecf4f4',height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
            <ScreenHeader title={editableItem ? 'Edit Med' : 'Add Med'}/>
                <Formik 
                initialValues={{name: name, dosage: dosage.toString(), maxDosage: maxDosage.toString(), interval: interval.toString()}}
                onSubmit={async (values)=> {
                    if(values.name !== null && parseInt(values.dosage) > 0){
                        const newMed: currMedInstance = {
                                id: editableItem ? editableItem.id : uuid.v4().toString(),
                                name: values.name,
                                dose: parseInt(values.dosage),
                                maxDosage: parseInt(values.maxDosage) > 0 ? parseInt(values.maxDosage) : undefined,
                                doseInterval: parseInt(values.interval) > 0 ? parseInt(values.interval) : undefined,
                            }
                            await updateMedList(newMed);
                            onBackPress();
                        }
                }}>
                    {({ handleChange, handleSubmit, values }) => (
                    <View style={{flexDirection:'column', justifyContent: 'space-between'}}>
                        <View style={{justifyContent: 'flex-start'}}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={Styles.textStyle}>Name:</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('name')}
                                value={values.name}
                                />
                            </View>
                            <View style={Styles.viewStyle}>
                                <Text style={Styles.textStyle}>Dosage:</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('dosage')}
                                value={values.dosage}
                                />
                            </View>
                            <View style={Styles.viewStyle}>
                                <Text style={Styles.textStyle}>Max Dosage:</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('maxDosage')}
                                value={values.maxDosage}
                                />
                            </View>
                            <View style={Styles.viewStyle}>
                                <Text style={Styles.textStyle}>Time Between Doses(Hours):</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('interval')}
                                value={values.interval}
                                />
                            </View>
                        </View>
                        <View style={{justifyContent: 'flex-end'}}>
                            <Button color={'#007560'} onPress={handleSubmit} title="Submit" />
                        </View>
                     </View>
     )}          
                </Formik>

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> onBackPress()}/>
            </View>
        </View>
    );
}

const Styles = {
    textStyle: {
        color: 'black',
         fontSize: 12
        },
    viewStyle: {
        flexDirection: 'column' as const,
    },
    textInput: {
        color: 'black',
        backgroundColor: 'grey',
        paddingLeft: 5, 
        marginLeft: 5, 
        marginRight: 5
    }
}

export default AddMed;