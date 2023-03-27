import { Text, View } from "react-native";

interface MedLogGroupHeaderProps{
    dateString: string;
}

function MedLogGroupHeader({dateString}: MedLogGroupHeaderProps){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    const year = dateString.slice(0,4);
    const month = parseInt(dateString.slice(4,6));
    const day = parseInt(dateString.slice(6,8));
    return(
        <View className="bg-white">
            <Text className='text-black text-lg mx-1'>{monthNames[month]} {day}, {year}</Text>
        </View>
    );
}

export default MedLogGroupHeader;