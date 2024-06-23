import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NoHeaderNavigationStackScreenProps, ProfileNavigationStackScreenProps, UserBottomTabCompositeNavigationProps } from "../../../StackParams/StackScreenProps";
import { useAuth } from "../../../../app/context/AuthContext";
import { ShelterData } from "../../../../interface/IShelterList";
import { Location } from "../../../../interface/ILocation";
import { useDebounce } from "use-debounce";
import { myProvince } from "../../../../functions/getLocation";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { PetData } from "../../../../interface/IPetList";
import { RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface ShelterInfo {
    ShelterId: string;
    ShelterName : string;
    UserId: string;
}

export const ApprovalScreen: FC<ProfileNavigationStackScreenProps<"ApprovalScreen">> = ({ navigation }) => {
    const {authState} = useAuth();
    const [shelterRequest, setShelterRequest] = useState<[]>([]);
    const [userShelter, setUserShelter] = useState<ShelterInfo>({
        ShelterId: "",
        UserId: "",
        ShelterName: ""
    });
    const [filterLocation, setFilterLocation] = useState<Location>({
        label: "",
        value: ""
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const [refreshing, setRefreshing] = useState(false);
    const [petData, setPetData] = useState<PetData[]>([]);
    const navigateToPetDetail = useNavigation<NoHeaderNavigationStackScreenProps<'PetDetailScreen'>>();
    
    const onRefresh = () => {
        try { 
            setRefreshing(true);
            fetchRequest();
            fetchPetByShelter()
        } catch(e) {
            console.log(e);
        } finally {
            setRefreshing(false);
        }
    };
    const fetchPetByShelter = async () => {
        try{
            const response = await get(`${BackendApiUri.getPet}?shelter_id=${userShelter.ShelterId}`);
            if(response.status == 200 && response.data) {
                setPetData(response.data);
            }
        } catch(e) {
            throw Error;
        }
    }

    const fetchShelterUser = async () => {
        try{
            const response = await get(`${BackendApiUri.getUserShelter}`);
            if(response.status == 200 && response.data.Data) {
                setUserShelter({
                    ShelterId: response.data.Data.Id,
                    UserId: response.data.Data.UserId,
                    ShelterName: response.data.Data.ShelterName
                });
            }
        } catch(e) {
            throw Error;
        }
    }

    useEffect(() => {
        fetchShelterUser();
        fetchPetByShelter()
    }, [])

    const fetchRequest = async () => {
        try{
            const response = await get(`${BackendApiUri.findRequest}/?search=${debounceValue}&shelter_id=${userShelter.ShelterId}&status=Ongoing`);
            if(response.status && response.data.Data) {
                setShelterRequest(response.data.Data);
            }
        } catch(e) {
            throw Error;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchRequest();
        fetchPetByShelter()
        fetchPetByShelter();
    }, [debounceValue, refreshing]);

    const renderPetItem = ({ item }: { item: PetData }) => (
        <TouchableOpacity
            className='mx-3 mb-7'
            style={styles.petItem}
            activeOpacity={1}
            onPress={() => navigateToPetDetail.navigation.navigate('PetDetailScreen', { petId: item.Id })}
        >
            <Image
                source={item.ImageBase64 && item.ImageBase64.length > 0 ? { uri: `data:image/*;base64,${item.ImageBase64}` } : require("../../../../assets/default_paw2.jpg")}
                style={styles.petImage}
                resizeMode="cover"
            />
            <View style={styles.petInfoContainer}>
                <View style={styles.petInfo}>
                    <Text style={styles.petName}>{item.PetName}</Text>
                    <FontAwesome6 name={item.PetGender === "Male" ? 'mars' : 'venus'} size={22} color={item.PetGender === "Male" ? '#4689FD' : '#FF6EC7'} />
                </View>
                <View style={styles.petLocation}>
                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                    <Text style={styles.petLocationText}>{item.ShelterLocation}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View className="mt-5 flex-row items-center justify-center">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                    <Text className="text-xl">Approval</Text>
                </View>

                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large"/>
                    </View>
                ) : (
                    <>
                        {shelterRequest.length > 0 ? (
                            <View style={{flex: 1, marginTop: 15}}>
                                <FlashList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                    data={petData}
                                    estimatedItemSize={200}
                                    renderItem={renderPetItem}
                                />
                            </View>
                        ) : (
                            <View className=''>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                    className="w-full h-full"
                                    contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <Text className=''>Anda tidak mempunyai request baru</Text>
                                </ScrollView>
                            </View>
                        )}
                    </>
                )}

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        bottom: 15
    },
    petItem: {
        marginBottom: 20,
    },
    petImage: {
        width: '100%',
        height: 320,
        borderRadius: 20,
    },
    petHeartIcon: {
        position: 'absolute',
        top: 7,
        right: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        padding: 8,
        borderRadius: 999,
    },
    petInfoContainer: {
        marginTop: 250, // Adjust this margin top based on your design
        backgroundColor: "#FFFDFF",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        position: 'absolute',
        width: '100%',
    },
    heading: {
        top: 20,
        left: 30,
        marginBottom: 25
    },
    petInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    petLocationText: {
        fontSize: 14,
        marginLeft: 5,
    },
    petLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    historyText: {
        fontSize: 13,
        fontWeight: '600',
        flexWrap: 'wrap'
    },
    historyContainer: {
        backgroundColor: '#378CE74D',
        padding: 20,
        marginHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    transactionContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        elevation: 5,
        marginBottom: 20
    },
});
