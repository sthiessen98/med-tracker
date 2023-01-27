import { useState } from "react";
import { ScrollView, View} from "react-native";
import SelectableColor from "./SelectableColor";

interface ColorSelectorProps{
    preselectedColor?: string;
    onPress: (color: string)=> void;
}
function ColorSelector({preselectedColor, onPress}: ColorSelectorProps){

    const [selectedColor, setSelectedColor] = useState<string>(preselectedColor ?? '');
    const colors: string[] = ['#7C3AED', '#DC2626','#65A30D','#3B82F6', '#FCD34D','#F99B16','#F9A8D4','#86EFAC','#A16207'];
    return(
        <View className='bg-slate-300 border rounded'>
            <ScrollView horizontal={true} className='flex-row mx-0.5'>
                {colors.map((c)=> {
                    return (
                        <SelectableColor color={c} selectedColor={selectedColor} onPress={(pressedColor)=> {
                            setSelectedColor(pressedColor);
                            onPress(pressedColor);
                        }}/>
                    )
                })}
            </ScrollView>
        </View>
    );
}

export default ColorSelector;