import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Image, Text } from "react-native-elements";
import { useAuth } from "../app/context/AuthContext";
import { useContext } from "react";

const TopNavigation = () => {
    const {authState, onLogout} = useAuth();
    return (
        <View className='mt-9 mx-3'>
            <View className='flex-row justify-between items-center '>
                <Image source={require('../assets/image.png')} className='w-16 h-16 rounded-full'/>
                <Text className='text-sm font-bold mr-auto ml-3'>Welcome back, {'\n'}{authState?.username}</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="logout" size={25} color="black" style={{marginEnd : 10}} onPress={onLogout}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default TopNavigation;