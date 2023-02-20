import { Button, View } from "react-native";

interface IScreenFooterProps{
    leftButtonTitle?: string;
    leftButtonPress?: ()=> void;
    rightButtonTitle?: string;
    rightButtonPress?:()=> any;
}

function ScreenFooter({leftButtonTitle, leftButtonPress, rightButtonTitle, rightButtonPress}: IScreenFooterProps){
    return (
    <View style={{ backgroundColor: 'black', alignItems: 'stretch',  flexDirection: 'row', justifyContent: 'space-between', height: 45}}>
        {!!leftButtonTitle && !!leftButtonPress && (
            <Button color={'#007560'} title={leftButtonTitle} onPress={()=> {
            leftButtonPress();
        }}/>
        )}
        {!!rightButtonTitle && !!rightButtonPress && (
            <Button color={'#007560'} title={rightButtonTitle} onPress={()=>{
            rightButtonPress();
        }} />
        )}
    </View>
    );
}

export default ScreenFooter;