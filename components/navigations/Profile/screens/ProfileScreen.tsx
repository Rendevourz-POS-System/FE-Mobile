import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";

export const ProfileScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ProfileScreen'>> = ({ navigation }) => {
    const [userType, setUserType] = useState("user");

    const handleSwitchUserType = () => {
        setUserType(prevUserType => prevUserType === 'user' ? 'shelter' : 'user');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View className="my-10">
                    <View style={styles.rowContainer} className="justify-around">
                        <View className="w-50 h-50 bg-slate-500 p-10 rounded-full"><Text>Test</Text></View>
                        <Text className="text-3xl">David Robinson</Text>
                    </View>
                </View>

                <View className="mx-5">
                    <Text style={styles.title}>Profile</Text>
                    <TouchableOpacity style={styles.rowContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="account" color="white" size={30} />
                        </View>
                        <Text style={styles.text}>Manage User</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={30} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer} onPress={handleSwitchUserType}>
                        <View style={styles.iconContainer}>
                            <Octicons name="arrow-switch" size={30} color="white" />
                        </View>
                        {userType == 'user' && (<Text style={styles.text}>Switch to Shelter</Text>)}
                        {userType == 'shelter' && (<Text style={styles.text}>Switch to User</Text>)}
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={30} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="mx-5 my-5">
                    <Text style={styles.title}>Settings</Text>
                    <TouchableOpacity style={styles.rowContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="notifications" size={30} color="white" />
                        </View>
                        <Text style={styles.text}>Notifications</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={30} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="receipt-outline" size={28} color="white" />
                        </View>
                        <Text style={styles.text}>History List</Text>
                        <View style={styles.nextIconContainer}>
                            <MaterialIcons name="navigate-next" size={30} color="black" />
                        </View>
                    </TouchableOpacity>
                    {userType == 'shelter' && (<>
                        <TouchableOpacity style={styles.rowContainer}>
                            <View style={styles.iconContainer}>
                                <Octicons name="checklist" size={28} color="white" />
                            </View>
                            <Text style={styles.text}>Approval List</Text>
                            <View style={styles.nextIconContainer}>
                                <MaterialIcons name="navigate-next" size={30} color="black" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="bone" size={30} color="white" />
                            </View>
                            <Text style={styles.text}>Pet List</Text>
                            <View style={styles.nextIconContainer}>
                                <MaterialIcons name="navigate-next" size={30} color="black" />
                            </View>
                        </TouchableOpacity>
                    </>)}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', right: 40 }}>
                    <TouchableOpacity style={styles.signOutButton}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
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
        width: 50,
        height: 50,
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
        fontSize: 20,
        left: 20,
        marginRight: 'auto',
        fontWeight: '600'
    },
    signOutText: {
        fontSize: 20,
        left: 20,
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
