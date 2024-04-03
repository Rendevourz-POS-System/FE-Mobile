import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Image, Text } from "react-native-elements";
import { useAuth } from "../app/context/AuthContext";
import { useContext } from "react";

const TopNavigation = () => {
    const {authState, onLogout} = useAuth();
    const username = authState?.username || "User";
    console.log(username);
    return (
        <View className='flex-1 mt-10'>
            <View className='flex-row justify-between items-center mb-5'>
                <Image source={require('../assets/image.png')} className='w-16 h-16 rounded-full'/>
                <Text className='text-sm font-bold mr-auto ml-3'>Welcome back, {'\n'}{username}</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="logout" size={25} color="black" style={{marginEnd : 10}} onPress={onLogout}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default TopNavigation;