import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Badge, Image, Text } from "react-native-elements";
import { useAuth } from "../app/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootBottomTabCompositeNavigationProp } from "./navigations/CompositeNavigationProps";

const TopNavigation = () => {
    const {authState, onLogout} = useAuth();
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();

    return (
        <View className='mt-11 mx-3'>
            <View className='flex-row justify-between items-center '>
                <TouchableOpacity
                    onPress={() => navigation.navigate("HomeScreen", {screen: "Profile"})}
                >
                    <Avatar
                        rounded
                        source={{
                        uri: 'https://randomuser.me/api/portraits/men/41.jpg',
                        }}
                        size="large"
                    />
                    <Badge
                        status="success"
                        containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    />
                </TouchableOpacity>
                <Text className='text-sm font-bold mr-auto ml-3'>Welcome back, {'\n'}{authState?.username}</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="logout" size={25} color="black" style={{marginEnd : 10}} onPress={onLogout}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default TopNavigation;