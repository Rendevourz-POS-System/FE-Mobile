import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC, useCallback, useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import { useAuth } from "../app/context/AuthContext";
import { IUser } from "../interface/IUser";
import { BackendApiUri } from "../functions/BackendApiUri";
import { get } from "../functions/Fetch";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserBottomTabCompositeNavigationProps, UserNavigationStackScreenProps } from "./StackParams/StackScreenProps";

export const Header = () => {
    const { authState, onLogout } = useAuth();
    const navigation = useNavigation<UserBottomTabCompositeNavigationProps<'Profile'>>();
    const [user, setUser] = useState<IUser | null>(null);

    const fetchData = async () => {
        try {
            const response = await get(`${BackendApiUri.getUserData}`);
            if (response && response.status === 200) {
                setUser(response.data);
            }
        } catch (e) {
            console.error('Error fetching user data:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                await fetchData();
            };
            fetch();
        }, [])
    );


    const getAvatarSize = () => {
        const { width } = Dimensions.get('window');
        return width * 0.16;
    };

    return (
    <View className="flex-row items-center justify-between bg-white px-3 py-2">
        <View className="flex-row items-center ">
            <TouchableOpacity onPress={() => navigation.navigate('Profile', {screen : 'ProfileScreen'})}>
                <Avatar
                    rounded
                    source={
                        user?.ImageBase64 ? { uri: `data:image/*;base64,${user.ImageBase64}` } : require('../assets/Default_Acc.jpg')
                    }
                    size={getAvatarSize()}
                />
            </TouchableOpacity>
            <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600' }}>
                Welcome back, {'\n'}{user?.Username}
            </Text>
        </View>
        <TouchableOpacity onPress={onLogout} className="mr-2">
            <MaterialCommunityIcons name="logout" size={25} color="black" />
        </TouchableOpacity>
    </View>
    )
};