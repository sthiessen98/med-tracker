import { Appearance, Text, View } from "react-native";

interface IScreenHeaderProps{
    title: string;
}

function ScreenHeader({title}: IScreenHeaderProps){
    return(
    <View className='flex-row justify-center bg-emerald-500 h-[40px] w-full mb-2'>
        <Text className='align-center text-xl text-black p-2'>{title}</Text>
    </View>
    );
}

export default ScreenHeader;