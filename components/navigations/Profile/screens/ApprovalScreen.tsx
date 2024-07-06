import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import { useAuth } from "../../../../app/context/AuthContext";
import { Location } from "../../../../interface/ILocation";
import { useDebounce } from "use-debounce";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { PetData } from "../../../../interface/IPetList";
import { RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { Request } from "../../../../interface/IRequest";
import { TouchableHighlight } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface ShelterInfo {
    ShelterId: string;
    ShelterName: string;
    UserId: string;
}

export const ApprovalScreen: FC<ProfileNavigationStackScreenProps<"ApprovalScreen">> = ({ navigation, route }) => {
    const { authState } = useAuth();
    const [shelterRequest, setShelterRequest] = useState<Request[]>([]);
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
    const [mergedData, setMergedData] = useState<any[]>([]);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchData()
        } catch (e) {
            console.error(e);
        }
    }

    const fetchPetByShelter = async (shelterId: string) => {
        try {
            const response = await get(`${BackendApiUri.getPet}`);
            if (response.status == 200 && response.data) {
                setPetData(response.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchShelterUser = async () => {
        try {
            const response = await get(`${BackendApiUri.getUserShelter}`);
            if (response.status == 200 && response.data.Data != null) {
                setUserShelter({
                    ShelterId: response.data.Data.Id,
                    UserId: response.data.Data.UserId,
                    ShelterName: response.data.Data.ShelterName
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchRequest = async (shelterId: string) => {
        try {
            const response = await get(`${BackendApiUri.findRequest}?shelter_id=${shelterId}&status=${'Ongoing'}`);
            if (response.status && response.data.Data != null) {
                setShelterRequest(response.data.Data);
            }
            if(response.data.Data == null) {
                setShelterRequest([])
            }
            console.log(shelterRequest)
        } catch (e) {
            console.error(e);
        } 
        // finally {
        //     setIsLoading(false);
        // }
    };
    
    // useEffect(() => {
    //     const filteredRequests = shelterRequest.filter(request => request.ShelterId === userShelter.ShelterId);
    
    //     const merge = filteredRequests.map(request => {
    //         const pet = petData.find(pet => pet.Id === request.PetId);
    //         return { ...request, pet }; 
    //     });
        
    //     const mergedData = merge.filter(request => request.Status === 'Ongoing');
    //     setMergedData(mergedData);
    //     setRefreshing(false);
    // }, [shelterRequest, petData]);

    function merge() {
        const filteredRequests = shelterRequest.filter(request => request.ShelterId === userShelter.ShelterId);
    
        const merge = filteredRequests.map(request => {
            const pet = petData.find(pet => pet.Id == request.PetId);
            return { ...request, pet }; 
        });
        
        return merge;
    }

    const fetchData = () => {
        const data = merge();
        setMergedData(data);  
        setIsLoading(false);
    }

    // useEffect(() => {
    //     fetchShelterUser();
    // }, [refreshing]);

    useEffect(() => {
        fetchData();
        setRefreshing(false);
    }, [shelterRequest, petData]);

    useEffect(() => {
        fetchShelterUser();
        fetchRequest(userShelter.ShelterId);
        fetchPetByShelter(userShelter.ShelterId);
    }, [refreshing]);

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                console.log("hello");
                setIsLoading(true)
                await fetchShelterUser();
                await fetchRequest(userShelter.ShelterId);
                await fetchPetByShelter(userShelter.ShelterId);
            }
            fetch();
        }, [navigation, route])
    );

    const renderPetItem = ({ item }: any) => {
        if(!item.pet) return null;
        const petImage = item.pet?.ImageBase64 ? { uri: `data:image/*;base64,${item.pet.ImageBase64}` } : require("../../../../assets/default_paw2.jpg");
        return (
            <TouchableOpacity
                className='mx-3 mb-7'
                style={styles.petItem}
                activeOpacity={1}
                onPress={() => navigation.navigate('ApprovalPetScreen', { petId: item.pet.Id, userId: item.UserId, requestId: item.Id})}
            >
                <Image
                    source={petImage}
                    style={styles.petImage}
                    resizeMode="cover"
                />
                <TouchableHighlight
                    style={{ position: 'absolute', top: 15, right: 20, paddingHorizontal: 25, paddingVertical: 8, borderRadius: 20 }}
                    underlayColor="transparent"
                    className={`bg-[#4689FD] opacity-90`}
                >
                    <Text className="text-white font-bold text-md">{item.Type == "Rescue" ? "Rescue" : "Surrender"}</Text>
                </TouchableHighlight>
                <View style={styles.petInfoContainer}>
                    <View style={styles.petInfo}>
                        <Text style={styles.petName}>{item.pet.PetName}</Text>
                        <FontAwesome6 name={item.pet.PetGender === "Male" ? 'mars' : 'venus'} size={22} color={item.pet.PetGender === "Male" ? '#4689FD' : '#FF6EC7'} />
                    </View>
                    <View style={styles.petLocation}>
                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                        <Text style={styles.petLocationText}>{item.Type == "Rescue" ? "Rescue" : "Surrender"}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View className="mt-5 flex-row items-center justify-center">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                    <Text className="text-xl">Approval</Text>
                </View>

                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large" />
                    </View>
                ) : (
                    <>
                        {mergedData.length > 0 ? (
                            <View style={{ flex: 1, marginTop: 15 }}>
                                <FlashList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                    data={mergedData}
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
                                    contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
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
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        height: 330,
        borderRadius: 25
        
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
        fontSize: 16,
        marginLeft: 12,
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
