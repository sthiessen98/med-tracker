import { Appearance, Text, View } from "react-native";

interface IScreenHeaderProps{
    title: string;
}

function ScreenHeader({title}: IScreenHeaderProps){
    return(
    <View className='flex-row justify-center bg-black h-[40px] w-full mb-2 border'>
        <Text className='align-center text-xl text-white p-2'>{title}</Text>
    </View>
    );
}

export default ScreenHeader;