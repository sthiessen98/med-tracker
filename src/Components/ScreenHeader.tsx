import { StyleSheet, Text, View } from "react-native";

interface IScreenHeaderProps{
    title: string;
}

function ScreenHeader({title}: IScreenHeaderProps){
    return(
    <View className='flex-row justify-center bg-primary h-[60px] w-full mb-2' style={styles.box}>
        <Text className='align-center text-2xl font-bold text-white p-2 mt-1'>{title}</Text>
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
        elevation: 20,
      },
  });

export default ScreenHeader;