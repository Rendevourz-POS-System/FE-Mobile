import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC, useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import { useAuth } from "../app/context/AuthContext";
import { IUser } from "../interface/IUser";
import { BackendApiUri } from "../functions/BackendApiUri";
import { get } from "../functions/Fetch";
import { useNavigation } from "@react-navigation/native";
import { UserBottomTabCompositeNavigationProps, UserNavigationStackScreenProps } from "./StackParams/StackScreenProps";

export const Header = () => {
    const { authState, onLogout } = useAuth();
    const [userData, setUserData] = useState<IUser>();
    const navigation = useNavigation<UserBottomTabCompositeNavigationProps<'Profile'>>();

    useEffect(() => {
        if (authState?.authenticated) {
            const fetchData = async () => {
                try {
                    const response = await get(`${BackendApiUri.getUserData}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchData();
        }
    }, [authState]);

    const getAvatarSize = () => {
        const { width } = Dimensions.get('window');
        return width * 0.18;
    };

    

    return (
    <View className="flex-row items-center justify-between bg-white px-3 py-2">
        <View className="flex-row items-center ">
            <TouchableOpacity onPress={() => navigation.navigate('Profile', {screen : 'ProfileScreen'})}>
                <Avatar
                    rounded
                    source={
                        userData?.ImageBase64 ? { uri: `data:image/*;base64,${userData.ImageBase64}` } : require('../assets/Default_Acc.jpg')
                    }
                    size={getAvatarSize()}
                />
            </TouchableOpacity>
            <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '600' }}>
                Welcome back, {'\n'}{userData?.Username}
            </Text>
        </View>
        <TouchableOpacity onPress={onLogout} className="mr-2">
            <MaterialCommunityIcons name="logout" size={25} color="black" />
        </TouchableOpacity>
    </View>
    )
};