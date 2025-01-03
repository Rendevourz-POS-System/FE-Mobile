import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Badge, Image, Text } from "react-native-elements";
import { useAuth } from "../app/context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootBottomTabCompositeNavigationProp } from "./navigations/CompositeNavigationProps";
import { FC, useCallback, useEffect, useState } from "react";
import { get } from "../functions/Fetch";
import { BackendApiUri } from "../functions/BackendApiUri";
interface IProfile {
    Username : string
    ImageBase64 : string
}
const TopNavigation : FC = () => {
    const {authState, onLogout} = useAuth();
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
    const [data, setData] = useState<IProfile | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await get(BackendApiUri.getUserData);
            if (res.data) {
                setData({
                    Username: res.data.Username,
                    ImageBase64: res.data.ImageBase64
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    return (
        <View className='mt-11 mx-3'>
            <View className='flex-row justify-between items-center '>
                <TouchableOpacity
                    onPress={() => navigation.navigate("HomeScreen", {screen: "Profile"})}
                >
                    <Avatar
                        rounded
                        source={data?.ImageBase64 ? { uri : `data:image/*;base64,${data.ImageBase64}` } : require('../assets/Default_Acc.jpg')}
                        size="medium"
                    />
                    <Badge
                        status="success"
                        containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    />
                </TouchableOpacity>
                <Text className='text-sm font-bold mr-auto ml-3'>Welcome back, {'\n'}{data?.Username}</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="logout" size={25} color="black" style={{marginEnd : 10}} onPress={onLogout}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default TopNavigation;