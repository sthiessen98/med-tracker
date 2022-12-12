import { Appearance, Text, View } from "react-native";

interface IScreenHeaderProps{
    title: string;
}

function ScreenHeader({title}: IScreenHeaderProps){
    return(
    <View style={{ alignItems: 'stretch', backgroundColor: Appearance.getColorScheme() === 'dark'? 'black' : 'white', flexDirection: 'row', alignContent: 'center', height: 40, marginBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 2, borderStyle: 'solid' }}>
        <Text style={{textAlign: 'center', width: '100%', fontSize:20, padding: 4, color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}}>{title}</Text>
    </View>
    );
}

export default ScreenHeader;