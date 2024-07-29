import React, { FC, useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image, TouchableHighlight, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CreateShelter } from "../../../CreateShelter";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri, baseUrl } from "../../../../functions/BackendApiUri";
import { ShelterUser } from "../../../../interface/IShelter";
import { PetData } from "../../../../interface/IPetList";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import axios from "axios";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getIconName } from "../../../../functions/GetPetIconName";
import { Request } from "../../../../interface/IRequest";

export const ShelterScreen: FC<ProfileNavigationStackScreenProps<'ShelterScreen'>> = ({ navigation, route }) => {
    const [data, setData] = useState<ShelterUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [petData, setPetData] = useState<PetData[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [requestData, setRequestData] = useState<Request[]>([]);
    const [mergedPetData, setMergedPetData] = useState<PetData[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [hidePass, setHidePass] = useState(true);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchRequest();
            await fetchPetData();
            setRefreshing(false);
            filterPetDataBasedOnRequests();
        } catch (e) {
            console.error(e);
        }
    }

    const fetchRequest = async () => {
        setLoading(true);
        try {
            const res = await get(`${BackendApiUri.findRequest}?shelter_id=${data?.Data.Id}`);
            if (res.data.Data) {
                setRequestData(res.data.Data.filter((request: Request) => request.Status.toLowerCase() === "rejected"));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const filterPetDataBasedOnRequests = () => {
        // if (petData.length > 0  requestData.length > 0) {
        //     const filteredPetData = petData.filter(pet => requestData.find(request => request.PetId !== pet.Id));
        //     setMergedPetData(filteredPetData);
        // }
        if(petData.length > 0 ) {
            if(requestData.length > 0) {
                const filteredPetData = petData.filter(pet => !requestData.find(request => request.PetId === pet.Id));
                setMergedPetData(filteredPetData);
            } else {
                setMergedPetData(petData);
            }
        }
        else {
            setMergedPetData([]);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await get(`${BackendApiUri.getUserShelter}`);
            if (res.data) {
                setData(res.data);
            }
            if (res.data.Error) {
                setData(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPetData = async () => {
        setLoading(true);
        try {
            if (data?.Data.Id == undefined) {
                setLoading(true);
            } else {
                const responsePet = await get(`${BackendApiUri.getPetList}/?shelter_id=${data?.Data.Id}`);
                if (responsePet.data && responsePet.status === 200) {
                    setPetData(responsePet.data);
                } else {
                    setPetData([]);
                }
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await fetchProfile();
                setFetchLoading(false);
            };
            fetchData();
        }, [navigation, route])
    );

    useEffect(() => {
        if (data) {
            fetchRequest();
            fetchPetData();
        }
    }, [data]);

    useEffect(() => {
        filterPetDataBasedOnRequests();
        setLoading(false);
    }, [petData,requestData]);

    const handleInputChange = (text: string) => {
        setInputValue(text);
    };

    const handleSubmitModal = () => {
        if (inputValue == data?.Data.Pin) {
            setIsModalOpen(false);
            setErrorMessage("");
            setInputValue("");
            Alert.alert("", "Pin Benar. Anda akan segera diakses menuju halaman Manage Shelter",
                [{ text: "OK", onPress: () => navigation.navigate("ManageShelterScreen") }]);
        } else {
            setErrorMessage("Pin Salah");
            setInputValue("");
        }
    };
    const handleCancelModal = () => {
        setIsModalOpen(false);
        setInputValue("");
        setErrorMessage("");
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView className="flex-1 bg-white">
                <GestureHandlerRootView className="flex-1">
                    <BottomSheetModalProvider>
                        {fetchLoading ? (
                            <>
                                <View className="flex-1 justify-center items-center">
                                    <ActivityIndicator size="large" color="#4689FD" />
                                </View>
                            </>
                        ) : (
                            <>
                                {!data ?
                                    <>
                                        <View className="mt-5 flex-row items-center justify-center mb-3">
                                            <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                                            <Text className="text-xl">Create Shelter</Text>
                                        </View>
                                        <CreateShelter />
                                    </>
                                    :
                                    <>
                                        <View className="mt-5 flex-row items-center justify-center mb-3">
                                            <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                                            <Text className="text-xl">Shelter Dashboard</Text>
                                        </View>
                                        <ScrollView className="my-5" contentContainerStyle={{ width: "100%", height: "100%" }}>
                                            <View className="mt-5 flex-row justify-around">
                                                <TouchableOpacity style={[styles.button]} onPress={() => setIsModalOpen(true)}>
                                                    <View style={styles.iconContainer}>
                                                        <Ionicons name="settings-outline" size={25} color="white" />
                                                    </View>
                                                    <Text style={styles.text}>Manage Shelter</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreatePetScreen", { shelterId: data.Data.Id })}>
                                                    <View style={styles.iconContainer}>
                                                        <MaterialCommunityIcons name="plus" color="white" size={25} />
                                                    </View>
                                                    <Text style={styles.text}>Tambah Hewan</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ApprovalScreen")}>
                                                    <View style={styles.iconContainer}>
                                                        <Ionicons name="receipt-outline" size={25} color="white" />
                                                    </View>
                                                    <Text style={styles.text}>Approval List</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {loading ? (
                                                <View className='flex flex-1 justify-center items-center mt-20'>
                                                    <ActivityIndicator size="large" color="#4689FD" />
                                                </View>
                                            ) : (
                                                <>
                                                    {mergedPetData.length > 0 ? (
                                                        <View style={{ flex: 1, padding: 10 }}>
                                                            <FlashList
                                                                refreshControl={
                                                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                                                }
                                                                estimatedItemSize={25}
                                                                data={mergedPetData}
                                                                numColumns={1}
                                                                keyExtractor={item => item.Id.toString()}
                                                                renderItem={({ item: pet }) => (
                                                                    <View style={{ flex: 1, marginBottom: 35, marginTop: 20 }}>
                                                                        <TouchableOpacity className="mx-2 justify-center" activeOpacity={1} onPress={() => navigation.navigate("ManagePetScreen", { petId: pet.Id })} style={styles.petListStyle}>
                                                                            <Image
                                                                                source={pet.ImageBase64 ? { uri: `data:image/*;base64,${pet.ImageBase64}` } : require('../../../../assets/default_paw2.jpg')}
                                                                                className="w-full h-80 rounded-3xl"
                                                                            />
                                                                            <TouchableHighlight
                                                                                style={{ position: 'absolute', top: 15, right: 20, backgroundColor: 'rgba(255, 255, 255, 0.65)', padding: 8, borderRadius: 10 }}
                                                                                underlayColor="transparent"
                                                                            >
                                                                                <Text className={`${pet.IsAdopted == true ? 'text-green-500' : 'text-red-500'}`} >{pet.IsAdopted == true ? "Adopted" : "Not Adopted"}</Text>
                                                                            </TouchableHighlight>

                                                                            <View style={{ position: 'absolute', top: 230, left: 0, right: 0, bottom: 0 }}>
                                                                                <View style={{ marginTop: 5, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 15 }}>
                                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pet.PetName}</Text>
                                                                                        {pet.PetGender === "Male" ? (
                                                                                            <FontAwesome6 name='mars' size={20} color='#4689FD' />
                                                                                        ) : (
                                                                                            <FontAwesome6 name='venus' size={20} color='#FF6EC7' />
                                                                                        )}
                                                                                    </View>
                                                                                    <View className="flex-row justify-between">
                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                                                            <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                                                            <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{pet.ShelterLocation}</Text>
                                                                                        </View>
                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                                                            { getIconName(pet.PetType) == 'rabbit' ? (
                                                                                                <MaterialCommunityIcons name="rabbit" size={29} color='#8A8A8A' style={{ marginLeft: 20 }} />
                                                                                            ) : (
                                                                                                <FontAwesome6 name={getIconName(pet.PetType)} size={24} color='#8A8A8A' style={{ marginLeft: 20 }} />
                                                                                            )}
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                )}
                                                            />
                                                        </View>
                                                    ) : (
                                                        <View className=''>
                                                            <ScrollView
                                                                refreshControl={
                                                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                                                }
                                                                showsVerticalScrollIndicator={false}
                                                                className="w-full h-full"
                                                                contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                                            >
                                                                <Text className=''>Sorry, data not found</Text>
                                                            </ScrollView>
                                                        </View>
                                                    )}
                                                </>
                                            )}
                                        </ScrollView>

                                        {isModalOpen &&
                                            <Modal visible={isModalOpen} transparent={true} animationType="fade">
                                                <View style={styles.modal}>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>Masukkan Pin</Text>
                                                        <View style={styles.inputBox}>
                                                            <TextInput
                                                                value={inputValue}
                                                                secureTextEntry={hidePass ? true : false}
                                                                onChangeText={handleInputChange}
                                                                placeholder="Masukkan Pin"
                                                                keyboardType="numeric"
                                                                inputMode="numeric"
                                                            />
                                                            <FontAwesome6 name={hidePass ? "eye-slash" : "eye"} size={16} color="grey" onPress={() => setHidePass(!hidePass)} />
                                                        </View>
                                                        {errorMessage != "" && <Text className="text-[#FF0000]">{errorMessage}</Text>}
                                                        <View className="mt-4 mb-3 flex-row justify-between" >
                                                            <TouchableOpacity onPress={handleCancelModal} style={styles.buttonCancel}>
                                                                <Text className="text-white">Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={handleSubmitModal} style={styles.buttonOke}>
                                                                <Text className="text-white">Oke</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Modal>
                                        }
                                    </>
                                }
                            </>
                        )}
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    nextIconContainer: {
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        padding: 5
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        backgroundColor: "#4689FD",
        padding: 5,
        borderRadius: 15,
        width: 80,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        marginTop: 5,
        textAlign: 'center'
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(50, 50, 50, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputBox: {
        marginTop: 10,
        marginBottom: 3,
        padding: 10,
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    body: {
        backgroundColor: 'white',
        width: 300,
        height: 200,
        justifyContent: 'center',
        borderRadius: 10,
        padding: 30
    },
    buttonCancel: {
        backgroundColor: '#F2B61D',
        padding: 5,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonOke: {
        backgroundColor: '#4689FD',
        padding: 5,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    petListStyle: {
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.55,
        shadowRadius: 5,
        // Properti bayangan untuk Android
        elevation: 10,
    },
});
