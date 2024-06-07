import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC, useEffect, useState } from "react";
import { useAuth } from "../../../app/context/AuthContext";
import { IUser } from "../../../interface/IUser";
import { BackendApiUri } from "../../../functions/BackendApiUri";
import { get } from "../../../functions/Fetch";
import { AdminNavigationStackParams } from "../Admin/AdminNavigationStackParams";
import HomeAdmin from "../Admin/screens/HomeAdmin";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserBottomTabParams } from "../RootBottomTab/UserBottomTabParams";
import { GuestNavigationStackParams } from "../GuestNavigationStackParams";
import { LoginScreen } from "./screens/LoginScreen";
import { EmailScreen } from "./screens/EmailScreen";
import { VerifyOTPScreen } from "./screens/VerifyOTPScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ShelterListScreen } from "../RootBottomTab/screens/ShelterListScreen";
import { PetListScreen } from "../RootBottomTab/screens/PetListScreen";
import { ShelterDetailScreen } from "./screens/ShelterDetailScreen";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ProfileNavigationStackParams } from "../Profile/ProfileNavigationStackParams";
import { ProfileScreen } from "../Profile/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const AppNavigationStack: FC = () => {
    const { authState, onLogout } = useAuth();
    const [userData, setUserData] = useState<IUser>();

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

    const noHeader = { headerShown: false };

    const AdminStack = createNativeStackNavigator<AdminNavigationStackParams>();
    const AdminStackGroup = () => (
        <AdminStack.Navigator>
            <AdminStack.Screen name="HomeAdmin" component={HomeAdmin} options={noHeader} />
        </AdminStack.Navigator>
    );

    const getAvatarSize = () => {
        const { width } = Dimensions.get('window');
        return width * 0.18;
    };

    const Header = () => (
        <View className="flex-row items-center justify-between bg-white px-3 py-2">
            <View className="flex-row items-center ">
                <TouchableOpacity onPress={() => console.log("avatar")}>
                    <Avatar
                        rounded
                        source={
                            userData?.ImageBase64 ? { uri: `data:image/*;base64,${userData.ImageBase64}` } : require('../../../assets/Default_Acc.jpg')
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
    );

    const UserTab = createBottomTabNavigator<UserBottomTabParams>();
    const UserTabGroup = () => (
        <UserTab.Navigator>
            <UserTab.Screen
                name="Home"
                component={HomeStackGroup}
                options={homeTabOptions}
            />
            <UserTab.Screen
                name="Profile"
                component={ProfileStackGroup}
                options={profileTabOptions}
            />
        </UserTab.Navigator>
    );

    // Icon Botom Tab 
    const homeTabOptions : BottomTabNavigationOptions = {
        headerTitle: "",
        headerStyle: {
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
        },
        header : () => <Header />,
        tabBarIcon : ({ size, focused }) => (
            <MaterialCommunityIcons 
                name="home" 
                color={focused ? "#4689FD" : "#A9A9A9"}
                size={size} 
            />
        )
    }
    
    const profileTabOptions : BottomTabNavigationOptions = {
        headerShown : false,
        tabBarIcon : ({size, focused}) => (
            <MaterialCommunityIcons 
                name="account" 
                color={focused ? "#4689FD" : "#A9A9A9"} 
                size={size} 
            />
        )
    }

    const HomeUserStack = createNativeStackNavigator();
    const HomeStackGroup = () => (
        <HomeUserStack.Navigator>
            <HomeUserStack.Screen
                name="TopTabs"
                component={TopTabsGroup}
                options={noHeader}
            />
            <HomeUserStack.Screen name="ShelterDetail" component={ShelterDetailScreen} options={noHeader} />
        </HomeUserStack.Navigator>
    );

    const ProfileUserStack = createNativeStackNavigator<ProfileNavigationStackParams>();
    const ProfileStackGroup = () => (
        <ProfileUserStack.Navigator>
            <ProfileUserStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={noHeader}
            />
        </ProfileUserStack.Navigator>
    )

    const GuestStack = createNativeStackNavigator<GuestNavigationStackParams>();
    const GuestStackGroup = () => (
        <GuestStack.Navigator>
            <GuestStack.Screen name="Login" component={LoginScreen} options={noHeader} />
            <GuestStack.Screen name="Email" component={EmailScreen} options={noHeader} />
            <GuestStack.Screen name="VerifyOTP" component={VerifyOTPScreen} options={noHeader} />
            <GuestStack.Screen name="Register" component={RegisterScreen} options={noHeader} />
        </GuestStack.Navigator>
    );

    const TopTabs = createMaterialTopTabNavigator();
    const TopTabsGroup = () => (
        <TopTabs.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    textTransform: "capitalize",
                    fontWeight: "bold",
                }
            }}
        >
            <TopTabs.Screen name="Shelter" component={ShelterListScreen} />
            <TopTabs.Screen name="Pet" component={PetListScreen} />
        </TopTabs.Navigator>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator>
                        {authState?.authenticated ? (
                            userData?.Role === "admin" ? (
                                <Stack.Screen name="AdminStack" component={AdminStackGroup} options={noHeader} />
                            ) : (
                                <Stack.Screen name="UserStack" component={UserTabGroup} options={noHeader} />
                            )
                        ) : (
                            <Stack.Screen name="GuestStack" component={GuestStackGroup} options={noHeader} />
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    avatar: {
        marginRight: 10,
    },
});

export default AppNavigationStack;
