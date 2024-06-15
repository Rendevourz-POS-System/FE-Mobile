import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { useAuth } from "../../../../app/context/AuthContext";
import { Avatar } from "react-native-elements";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get } from "../../../../functions/Fetch";
import { ShelterUser } from "../../../../interface/IShelter";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

interface IProfile {
    Username : string
    ImageBase64 : string
}

export const ProfileScreen: FC<ProfileNavigationStackScreenProps<'ProfileScreen'>> = ({navigation, route}) => {
    const { authState, onLogout } = useAuth();
    const [data, setData] = useState<IProfile | null>(null);
    const [dataShelter, setDataShelter] = useState<ShelterUser | null>(null);
    const [loadingShelter, setLoaddingShelter] = useState<boolean>();

    const fetchProfileShelter = async () => {
        try {
            const res = await get(BackendApiUri.getUserShelter);
            if (res.data.Error) {
                setDataShelter(null);
            }
            if(res.data.Data) setDataShelter(res.data);
        } catch (error) {
            console.log(error)
        } 
    };

    const fetchProfile = async () => {
        try {
            const res = await get(BackendApiUri.getUserData);
            if(res.data) {
                setData(res.data);
            }
        } catch (error) {
            console.log(error)
        } 
    };

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                setLoaddingShelter(true);
                await fetchProfileShelter();
                await fetchProfile();
                setLoaddingShelter(false);
            }
            fetch();
        }, [navigation, route])
    );
    
    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View className="my-10">
                    <View className='flex items-center justify-center'>
                    <Avatar
                        size={130}
                        rounded
                        source={data?.ImageBase64 ? { uri: `data:image/*;base64,${data.ImageBase64}` } : require('../../../../assets/Default_Acc.jpg')}
                    />
                        <Text className='text-2xl font-bold mt-2'>{data?.Username}</Text>
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
                    <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate("ShelterScreen")} disabled={loadingShelter}>
                        <View style={styles.iconContainer}>
                            {loadingShelter ? <ActivityIndicator size="small" color="white" /> :
                                dataShelter ? <Octicons name="arrow-switch" size={25} color="white" /> : 
                                <MaterialIcons name="create" size={25} color="white" 
                            /> }
                        </View>
                        <Text style={loadingShelter ? {color: 'gray', fontSize: 18, left: 20, marginRight: 'auto', fontWeight: '600'} : 
                            {fontSize: 18,left: 20,marginRight: 'auto',fontWeight: '600'}}
                        >
                            {dataShelter!= null ? "Switch to Shelter" : "Create Shelter"}</Text>
                            <View style={styles.nextIconContainer}>
                                <MaterialIcons name="navigate-next" size={25} color="black" />
                            </View>
                    </TouchableOpacity>
                </View>

                <View className="mx-5 my-5">
                    <Text style={styles.title}>Settings</Text>
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
        marginBottom: 20
    }
});
