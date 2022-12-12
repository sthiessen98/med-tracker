import { Button, View } from "react-native";

interface IScreenFooterProps{
    leftButtonTitle?: string;
    leftButtonPress?: ()=> void;
    rightButtonTitle?: string;
    rightButtonPress?:()=> any;
}

function ScreenFooter({leftButtonTitle, leftButtonPress, rightButtonTitle, rightButtonPress}: IScreenFooterProps){
    return (
    <View style={{ alignItems: 'stretch',  flexDirection: 'row', justifyContent: 'space-between', height: 45, borderTopColor: 'grey', borderTopWidth: 2, borderStyle: 'solid' }}>
        {!!leftButtonTitle && !!leftButtonPress && (
            <Button title={leftButtonTitle} onPress={()=> {
            leftButtonPress();
        }}/>
        )}
        {!!rightButtonTitle && !!rightButtonPress && (
            <Button title={rightButtonTitle} onPress={()=>{
            rightButtonPress();
        }} />
        )}
    </View>
    );
}

export default ScreenFooter;