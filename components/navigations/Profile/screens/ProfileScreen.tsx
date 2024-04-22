import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { useAuth } from "../../../../app/context/AuthContext";

export const ProfileScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ProfileScreen'>> = ({ navigation }) => {
    const { authState, onLogout } = useAuth();
    const username = authState?.username || "User";
    const [userType, setUserType] = useState("user");

    const handleSwitchUserType = () => {
        setUserType(prevUserType => prevUserType === 'user' ? 'shelter' : 'user');
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View className="my-10 mt-20">
                    <View style={{ alignItems: 'center', marginBottom: 25 }}>
                        <Ionicons name="person-circle-outline" size={120} color="black" />
                        <Text className="text-3xl">{username}</Text>
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
                    <TouchableOpacity style={styles.rowContainer} onPress={handleSwitchUserType}>
                        <View style={styles.iconContainer}>
                            <Octicons name="arrow-switch" size={25} color="white" />
                        </View>
                        {userType == 'user' && (<Text style={styles.text}>Switch to Shelter</Text>)}
                        {userType == 'shelter' && (<Text style={styles.text}>Switch to User</Text>)}
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
                    {userType == 'shelter' && (<>
                        <TouchableOpacity style={styles.rowContainer}>
                            <View style={styles.iconContainer}>
                                <Octicons name="checklist" size={22} color="white" />
                            </View>
                            <Text style={styles.text}>Approval List</Text>
                            <View style={styles.nextIconContainer}>
                                <MaterialIcons name="navigate-next" size={25} color="black" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="bone" size={25} color="white" />
                            </View>
                            <Text style={styles.text}>Pet List</Text>
                            <View style={styles.nextIconContainer}>
                                <MaterialIcons name="navigate-next" size={25} color="black" />
                            </View>
                        </TouchableOpacity>
                    </>)}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', right: 40 }}>
                    <TouchableOpacity style={styles.signOutButton} onPress={onLogout}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
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
    signOutText: {
        fontSize: 18,
        left: 35,
        marginRight: 'auto',
        fontWeight: '600',
        color: '#4689FD'
    },
    signOutButton: {
        color: '#EDECEC',
        padding: 10,
        width: 100,
    }
});
