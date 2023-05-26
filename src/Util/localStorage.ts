import AsyncStorage from "@react-native-async-storage/async-storage";
import { currMedInstance } from "../App";


export async function addMed(newMed: currMedInstance): Promise<currMedInstance[]>{
    const jsonValue = await AsyncStorage.getItem('currentMeds');
    const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
    const isExistingMed = meds.find((m)=> m.id === newMed.id);
    const updatedMeds = isExistingMed ? 
        [...meds.filter((m)=> m.id !== isExistingMed.id), newMed] :
        [...meds, newMed];
    const updatedMedsJson = JSON.stringify(updatedMeds);
    await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    return updatedMeds;
}

export async function deleteMed(med: currMedInstance): Promise<currMedInstance[]>{
    const jsonValue = await AsyncStorage.getItem('currentMeds');
    const meds: currMedInstance[] = jsonValue !== null ? JSON.parse(jsonValue) : [];
    const updatedMeds = meds.filter((i)=> i.id !== med.id);
    const updatedMedsJson = JSON.stringify(updatedMeds);
    await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    return updatedMeds;
}

export async function reorderMeds(newMedList: currMedInstance[]) : Promise<currMedInstance[]>{
    const updatedMedsJson = JSON.stringify(newMedList);
    await AsyncStorage.setItem('currentMeds', updatedMedsJson);
    return newMedList;
}