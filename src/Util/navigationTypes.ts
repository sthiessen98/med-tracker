import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { currMedInstance } from '../App';

export type RootStackParamList = {
    medList: undefined;
    addMed: {editableItem?: currMedInstance } | undefined;
    medLog: undefined;
}

export type medListProps = NativeStackScreenProps<RootStackParamList, 'medList'>;
export type addMedProps = NativeStackScreenProps<RootStackParamList, 'addMed'>;
export type medLogProps = NativeStackScreenProps<RootStackParamList, 'medLog'>;