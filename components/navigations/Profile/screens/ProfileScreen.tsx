import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { useAuth } from "../../../../app/context/AuthContext";
import { Avatar } from "react-native-elements";
import { ShelterUser } from "../../../../interface/IShelter";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get } from "../../../../functions/Fetch";

export const ProfileScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ProfileScreen'>> = ({ navigation }) => {
    const { authState, onLogout } = useAuth();
    const [data, setData] = useState<ShelterUser>();
    const [flag, setFlag] = useState(0);

    const fetchUserShelter = async () => {
        const res = await get(BackendApiUri.getUserShelter);
        setData(res.data);
    }

    useEffect(() => {
        fetchUserShelter();
        if (data) { setFlag(1) };
    }, [data])

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View className="my-10 mt-20">
                    <View className='flex items-center justify-center'>
                        <Avatar
                            size={130}
                            rounded
                            source={{
                                uri: 'https://randomuser.me/api/portraits/men/41.jpg',
                            }}
                        />
                        <Text className='text-2xl font-bold mt-2'>{authState?.username}</Text>
                    </View>
                </View>

                <View className="mx-5">
                    <Text style={styles.title}>Profile</Text>
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("ManageScreen")}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="account" color="white" size={25} />
                        </View>
                        <Text style={styles.text}>Manage Profile</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("ChangePasswordScreen")}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="lock" size={25} color="white" />
                        </View>
                        <Text style={styles.text}>Change Password</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("ShelterScreen")}>
                        <View style={styles.iconContainer}>
                            {flag == 1 ? <Octicons name="arrow-switch" size={25} color="white" /> : <MaterialIcons name="create" size={25} color="white" />}
                        </View>
                        <Text style={styles.text}>{flag == 1 ? "Switch to Shelter" : "Create Shelter"}</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="mx-5 my-5">
                    <Text style={styles.title}>Settings</Text>
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("NotificationScreen")}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="notifications" size={25} color="white" />
                        </View>
                        <Text style={styles.text}>Notifications</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("HistoryScreen")}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="receipt-outline" size={25} color="white" />
                        </View>
                        <Text style={styles.text}>History List</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("FavoriteScreen")}>
                        <View style={styles.iconContainer}>
                            <FontAwesome name={'heart'} size={24} color="white" />
                        </View>
                        <Text style={styles.text}>Favorite</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={onLogout}>
                    <Text className="text-center font-bold text-white">Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        bottom: 15
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    iconContainer: {
        backgroundColor: "#4689FD",
        padding: 5,
        borderRadius: 100,
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    nextIconContainer: {
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        padding: 5
    },
    text: {
        fontSize: 18,
        left: 20,
        marginRight: 'auto',
        fontWeight: '600'
    },
    signOutButton: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 20
    }
});
