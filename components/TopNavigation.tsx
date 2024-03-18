import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Image, Text } from "react-native-elements";

const TopNavigation = () => {
    return (
        <View className='flex-1'>
            <View className='flex-row justify-between items-center mb-5'>
                <Image source={require('../assets/image.png')} className='w-16 h-16 rounded-full'/>
                <Text className='text-sm font-bold mr-auto ml-3'>Welcome, {'\n'} User</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="logout" size={25} color="black" style={{marginEnd : 10}}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default TopNavigation;