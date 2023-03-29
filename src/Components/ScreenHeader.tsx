import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';


interface IScreenHeaderProps{
    title: string;
    mode?: string; //home, edit
    onPress?: ()=> void;
}

function ScreenHeader({title, mode, onPress}: IScreenHeaderProps){
    return(
    <View className='flex-row bg-primary h-[60px] w-full mb-2' style={styles.box}>
        <View className='basis-1/5 justify-center items-center w-full h-full'>
            {mode === 'home' && !!onPress && (
                <TouchableOpacity className='justify-center items-center h-[35px] w-[35px] rounded-full border-2 bg-white' onPress={()=> onPress()}>
                    <EntypoIcon name='edit' size={25} color="black"/> 
                </TouchableOpacity>
            )}
            {mode === 'edit' && !!onPress && (
                <TouchableOpacity className='justify-center items-center h-[35px] w-[35px] rounded-full border-2 bg-white' onPress={()=> onPress()}>
                    <MaterialIcons name='keyboard-return' size={25} color="black"/> 
                </TouchableOpacity>
            )}
        </View>
        <View className='basis-3/5 w-full h-full'>
            <Text className='text-center text-2xl font-bold text-white p-2 mt-1'>{title}</Text>
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
        elevation: 8,
      },
  });

export default ScreenHeader;