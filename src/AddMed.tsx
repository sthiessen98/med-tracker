import { Button, Text, TextInput, View } from "react-native";
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
        <View className='bg-slate-200 flex-col justify-between h-full w-full'>
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
                    <View className='flex-col justify-between h-5/6 bg-slate-200'>
                        <View className='justify-start'>
                            <View className='flex-col'>
                                <Text className='text-black text-sm pt-1 ml-1'>Drug Name:</Text>
                                <TextInput className='text-black bg-white h-[40px] pl-1 mx-1 border'
                                onChangeText={handleChange('name')}
                                value={values.name}
                                />
                            {errors.name && (
                                <Text className='text-sm text-red-700 pl-1 mx-1'>{errors.name}</Text>
                            )}
                            </View>
                            <View className='flex-col'>
                                <Text className='text-black text-sm pt-1 ml-1'>Dosage:</Text>
                                <TextInput className='text-black bg-white h-[40px] pl-1 mx-1 border'
                                onChangeText={handleChange('dosage')}
                                value={values.dosage}
                                />
                            {errors.dosage && (
                                <Text className='text-sm text-red-700 pl-1 mx-1'>{errors.dosage}</Text>
                            )}
                            </View>
                            <View className='flex-col'>
                                <Text className='text-black text-sm pt-1 ml-1'>Max Dosage(Optional):</Text>
                                <TextInput className='text-black bg-white h-[40px] pl-1 mx-1 border'
                                onChangeText={handleChange('maxDosage')}
                                value={values.maxDosage}
                                />
                            </View>
                            {errors.maxDosage && (
                                <Text className='text-sm text-red-700 pl-1 mx-1'>{errors.maxDosage}</Text>
                            )}
                            <View className='flex-col'>
                                <Text className='text-black text-sm pt-1 ml-1'>Time Between Doses(Hours)(Optional):</Text>
                                <TextInput className='text-black bg-white h-[40px] pl-1 mx-1 border'
                                onChangeText={handleChange('interval')}
                                value={values.interval}
                                />
                            {errors.interval && (
                                <Text className='text-sm text-red-700 pl-1 mx-1'>{errors.interval}</Text>
                            )}
                            </View>
                        </View>
                        <View className='bg-slate-300 justify-end mx-3 shadow}'>
                            <Button color={'#007560'} onPress={handleSubmit} title="Submit" />
                        </View>
                     </View>
     )}          
                </Formik>

            <View className='justify-end'>
                <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> onBackPress()}/>
            </View>
        </View>
    );
}

export default AddMed;