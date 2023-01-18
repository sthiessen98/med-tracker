import React, { useState } from "react";
import { Appearance, Button, SafeAreaView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { currMedInstance } from "./App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "./Components/ScreenHeader";
import ScreenFooter from "./Components/ScreenFooter";
import { Formik } from "formik";
import * as yup from "yup";

interface addMedProps {
    editableItem?: currMedInstance;
    onBackPress(): void;
}

function AddMed({onBackPress, editableItem}: addMedProps){

    const updateMedList = async (newMed: currMedInstance)=> {
        const jsonValue = await AsyncStorage.getItem('currentMeds');
        const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
        const updatedMeds = editableItem ? 
            [...meds.filter((m)=> m.id !== editableItem.id), newMed] :
            [...meds, newMed];
        const updatedMedsJson = JSON.stringify(updatedMeds);
        await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    }

    const medValidationSchema = yup.object().shape({
        name: yup
            .string()
            .min(3, ({min})=> `The drug name must be at least ${min} characters long`)
            .required('Please enter the drug name'),
        dosage: yup
            .number()
            .typeError('Please enter a whole number')
            .integer('Please enter a whole number')
            .moreThan(0, 'Please enter a number greater than 0')
            .required('Please enter the drug dosage'),
        maxDosage: yup
            .number()
            .typeError('Please enter a whole number')
            .nullable()
            .integer('Please enter a whole number')
            .min(yup.ref('dosage')),
        doseInterval: yup
            .number()
            .typeError('Please enter a whole number')
            .nullable()
            .integer('Please enter a whole number')
            .moreThan(0, 'Please enter a number greater than 0'),
    });

    return(
        <View style={{backgroundColor: '#ecf4f4',height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
            <ScreenHeader title={editableItem ? 'Edit Med' : 'Add Med'}/>
                <Formik
                initialValues={{
                    name: editableItem?.name ?? '', 
                    dosage: editableItem?.dose?.toString() ?? '0', 
                    maxDosage: editableItem?.maxDosage?.toString() ?? '', 
                    interval: editableItem?.doseInterval?.toString() ?? ''
                }}
                validationSchema={medValidationSchema}
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
                    {({ handleChange, handleSubmit, values, errors }) => (
                    <View style={{flexDirection:'column', justifyContent: 'space-between', height: '80%'}}>
                        <View style={{justifyContent: 'flex-start'}}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={Styles.textStyle}>Drug Name:</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('name')}
                                value={values.name}
                                />
                            {errors.name && (
                                <Text style={Styles.errorText}>{errors.name}</Text>
                            )}
                            </View>
                            <View style={Styles.viewStyle}>
                                <Text style={Styles.textStyle}>Dosage:</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('dosage')}
                                value={values.dosage}
                                />
                            {errors.dosage && (
                                <Text style={Styles.errorText}>{errors.dosage}</Text>
                            )}
                            </View>
                            <View style={Styles.viewStyle}>
                                <Text style={Styles.textStyle}>Max Dosage(Optional):</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('maxDosage')}
                                value={values.maxDosage}
                                />
                            </View>
                            {errors.maxDosage && (
                                <Text style={Styles.errorText}>{errors.maxDosage}</Text>
                            )}
                            <View style={Styles.viewStyle}>
                                <Text style={Styles.textStyle}>Time Between Doses(Hours)(Optional):</Text>
                                <TextInput style={Styles.textInput}
                                onChangeText={handleChange('interval')}
                                value={values.interval}
                                />
                            {errors.interval && (
                                <Text style={Styles.errorText}>{errors.interval}</Text>
                            )}
                            </View>
                        </View>
                        <View style={{justifyContent: 'flex-end', backgroundColor: 'red', marginLeft: 20, marginRight: 20, elevation: 15}}>
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
        marginLeft: 5,
        color: 'black',
         fontSize: 12,
         paddingTop: 5
        },
    viewStyle: {
        flexDirection: 'column' as const,
    },
    textInput: {
        color: 'black',
        backgroundColor: 'grey',
        paddingLeft: 5, 
        marginLeft: 5, 
        marginRight: 5,
        border: 'black',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        paddingLeft: 5,
        marginLeft: 5,
        marginRight: 5,
    }
}

export default AddMed;