import { optionGroupUnstyledClasses } from "@mui/base";
import { TouchableOpacity, View } from "react-native";

interface selectableColorProps{
    color: string;
    selectedColor?: string;
    onPress:(c: string) => void;
}

function SelectableColor({color, selectedColor, onPress}: selectableColorProps){

    const colorStyling = `${color === selectedColor ? 'border-black' : 'border-white'} border-2 active:border-4 rounded-full h-[35px] w-[35px]`;
    return(
        <View className='p-2'>
            <TouchableOpacity className={colorStyling} style={{backgroundColor: color}} onPress={()=> onPress(color)}>
                
            </TouchableOpacity>
        </View>
    );
}

export default SelectableColor;