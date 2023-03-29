import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { currMedInstance } from "../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from "../Components/ScreenHeader";
import ScreenFooter from "../Components/ScreenFooter";
import { Formik } from "formik";
import * as yup from "yup";
import ColorSelector from "../Components/ColorSelector";
import { addMedProps } from "../Util/navigationTypes";


function AddMed({navigation, route}: addMedProps){

    const editableItem = route.params?.editableItem;

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
            .min(3, ({min})=> `The medication name must be at least ${min} characters long`)
            .required('Please enter the medication name'),
        dosage: yup
            .number()
            .moreThan(0, 'Please enter a number greater than 0')
            .required('Please enter the medication dosage'),
        maxDosage: yup
            .number()
            .nullable()
            .min(yup.ref('dosage')),
        doseInterval: yup
            .number()
            .typeError('Please enter a whole number')
            .nullable()
            .integer('Please enter a whole number')
            .moreThan(0, 'Please enter a number greater than 0'),
        color: yup
            .string()
            .required('Please select a color'),
        allowNotifications: yup
            .boolean()
    });

    return(
        <View className='bg-background flex-col justify-between h-full w-full' style={{elevation: 4}}>
            <ScreenHeader title={editableItem ? 'Edit Med' : 'Add Med'}/>
                <Formik
                initialValues={{
                    name: editableItem?.name ?? '', 
                    dosage: editableItem?.dose?.toString() ?? '0', 
                    maxDosage: editableItem?.maxDosage?.toString() ?? '', 
                    interval: editableItem?.doseInterval?.toString() ?? '',
                    color: editableItem?.color ?? '',
                    allowNotifications: editableItem?.allowNotifications ?? false,

                }}
                validationSchema={medValidationSchema}
                onSubmit={async (values)=> {
                    if(values.name !== null && parseFloat(values.dosage) > 0){
                        const newMed: currMedInstance = {
                                id: editableItem ? editableItem.id : uuid.v4().toString(),
                                name: values.name,
                                dose: parseFloat(values.dosage),
                                maxDosage: parseInt(values.maxDosage) > 0 ? parseInt(values.maxDosage) : undefined,
                                doseInterval: parseInt(values.interval) > 0 ? parseInt(values.interval) : undefined,
                                color:values.color ?? undefined,
                            }
                            await updateMedList(newMed);
                            navigation.navigate('medList');
                        }
                }}>
                    {({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
                    <View className='flex-col justify-between h-3/4 bg-background'>
                        <View className='justify-start'>
                            <View className='flex-col'>
                                <Text className='text-black text-sm pt-1 ml-1'>Medication Name:</Text>
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
                            <View className='flex-col p-1'>
                                <Text className='text-black text-sm pt-1 ml-1'>Display Color:</Text>
                                <ColorSelector preselectedColor={editableItem?.color} onPress={(color)=> setFieldValue('color', color)}/>
                                {errors.color && (
                                <Text className='text-sm text-red-700 pl-1 mx-1'>{errors.color}</Text>
                            )}
                            </View>
                        </View>
                        <View className='bg-background justify-end mx-9' style={styles.box}>
                            <Button color={'#10b981'} onPress={handleSubmit} title="Submit" />
                        </View>
                     </View>
     )}          
                </Formik>

            <View className='justify-end'>
                <ScreenFooter leftButtonTitle="Back" leftButtonPress={()=> navigation.navigate('medList')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        // ...
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 9,
      },
  });
  
export default AddMed;