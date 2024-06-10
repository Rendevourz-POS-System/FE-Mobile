import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC, useEffect, useState } from "react";
import { useAuth } from "../../../app/context/AuthContext";
import { IUser } from "../../../interface/IUser";
import { BackendApiUri } from "../../../functions/BackendApiUri";
import { get } from "../../../functions/Fetch";
import { AdminNavigationStackParams } from "../Admin/AdminNavigationStackParams";
import HomeAdmin from "../../navigations/Admin/screens/HomeAdmin";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserBottomTabParams } from "../../BottomTabs/UserBottomTabParams";
import { GuestNavigationStackParams } from "../Guest/GuestNavigationStackParams";
import { LoginScreen } from "../../navigations/Root/screens/LoginScreen";
import { EmailScreen } from "../../navigations/Root/screens/EmailScreen";
import { VerifyOTPScreen } from "../../navigations/Root/screens/VerifyOTPScreen";
import { RegisterScreen } from "../../navigations/Root/screens/RegisterScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ShelterListScreen } from "../../navigations/RootBottomTab/screens/ShelterListScreen";
import { PetListScreen } from "../../navigations/RootBottomTab/screens/PetListScreen";
import { ShelterDetailScreen } from "../../navigations/Root/screens/ShelterDetailScreen";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProfileScreen } from "../../navigations/Profile/screens/ProfileScreen";
import { HomeUserNavigationStackParams } from "../User/HomeUserNavigationStackParams";
import { Header } from "../../Header";
import { ProfileNavigationStackParams } from "../Profile/ProfileNavigationStackParams";
import { NoHeaderStackParams } from "../NoHeader/NoHeaderStackParams";
import { ManageScreen } from "../../navigations/Profile/screens/ManageScreen";
import { ChangePasswordScreen } from "../../navigations/Profile/screens/ChangePasswordScreen";
import { ManageShelterScreen } from "../../navigations/Profile/screens/ManageShelterScreen";
import { NotificationScreen } from "../../navigations/Profile/screens/NotificationScreen";
import { HistoryScreen } from "../../navigations/Profile/screens/HistoryScreen";
import { FavoriteScreen } from "../../navigations/Profile/screens/FavoriteScreen";
import { PetDetailScreen } from "../../navigations/Root/screens/PetDetailScreen";
import { AdoptionFormScreen } from "../../navigations/Root/screens/AdoptionFormScreen";
import { ShelterScreen } from "../../navigations/Profile/screens/ShelterScreen";
import { CreatePetScreen } from "../../navigations/Profile/screens/CreatePetScreen";
import { AdminNavigationStack } from "../Admin/AdminNavigationStack";
import { HewanAdopsiScreen } from "../../navigations/Root/screens/HewanAdopsiScreen";
import { DonateScreen } from "../../navigations/Root/screens/DonateScreen";
import { RescueFormScreen } from "../../navigations/Root/screens/RescueFormScreen";

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
    const homeTabOptions: BottomTabNavigationOptions = {
        headerTitle: "",
        headerStyle: {
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
        },
        headerShown: false,
        // header : () => <Header />,
        tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
                name="home"
                color={focused ? "#4689FD" : "#A9A9A9"}
                size={size}
            />
        )
    }

    const profileTabOptions: BottomTabNavigationOptions = {
        headerShown: false,
        tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
                name="account"
                color={focused ? "#4689FD" : "#A9A9A9"}
                size={size}
            />
        )
    }

    // Display Screen that doesnt have a Header
    // This only for Home User because only ShelterListScreen and PetListScreen have a Header
    const HomeUserStack = createNativeStackNavigator<NoHeaderStackParams>();
    const HomeStackGroup = () => (
        <HomeUserStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeUserStack.Screen
                name="TopTabs"
                component={TopTabsWithHeader}
                options={noHeader}
            />
            <HomeUserStack.Screen name="ShelterDetailScreen" component={ShelterDetailScreen} options={{ presentation: "modal" }} />
            <HomeUserStack.Screen name="HewanAdopsiScreen" component={HewanAdopsiScreen} options={{ presentation: "modal" }} />
            <HomeUserStack.Screen name="PetDetailScreen" component={PetDetailScreen} options={{ presentation: "modal" }} />
            <HomeUserStack.Screen name="AdoptionFormScreen" component={AdoptionFormScreen} options={{ presentation: "modal" }} />
            <HomeUserStack.Screen name="DonateScreen" component={DonateScreen} options={{ presentation: "modal" }} />
            <HomeUserStack.Screen name="RescueFormScreen" component={RescueFormScreen} options={{ presentation: "modal" }} />
        </HomeUserStack.Navigator>
    );

    const ProfileUserStack = createNativeStackNavigator<ProfileNavigationStackParams>();
    const ProfileStackGroup = () => (
        <ProfileUserStack.Navigator>
            <ProfileUserStack.Screen name="ProfileScreen" component={ProfileScreen} options={noHeader} />
            <ProfileUserStack.Screen name="ManageScreen" component={ManageScreen} options={noHeader} />
            <ProfileUserStack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={noHeader} />
            <ProfileUserStack.Screen name="NotificationScreen" component={NotificationScreen} options={noHeader} />
            <ProfileUserStack.Screen name="HistoryScreen" component={HistoryScreen} options={noHeader} />
            <ProfileUserStack.Screen name="FavoriteScreen" component={FavoriteScreen} options={noHeader} />

            <ProfileUserStack.Screen name="ShelterScreen" component={ShelterScreen} options={noHeader} />
            <ProfileUserStack.Screen name="ManageShelterScreen" component={ManageShelterScreen} options={noHeader} />
            <ProfileUserStack.Screen name="CreatePetScreen" component={CreatePetScreen} options={noHeader} />
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

    // Top Tabs
    const TopTabs = createMaterialTopTabNavigator<HomeUserNavigationStackParams>();
    const TopTabsWithHeader = () => (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Header />
                    <TopTabsGroup />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
    const TopTabsGroup = () => (
        <TopTabs.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    textTransform: "capitalize",
                    fontWeight: "bold",
                }
            }}
        >
            <TopTabs.Screen name="ShelterListScreen" component={ShelterListScreen} options={{ title: "Shelters" }} />
            <TopTabs.Screen name="PetListScreen" component={PetListScreen} options={{ title: "Pets" }} />
        </TopTabs.Navigator>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator>
                        {authState?.authenticated ? (
                            userData?.Role === "admin" ? (
                                <Stack.Screen name="AdminStack" component={AdminNavigationStack} options={noHeader} />
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
