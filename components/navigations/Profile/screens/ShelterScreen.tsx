
import React, { FC, useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image, TouchableHighlight, Alert, ActivityIndicator } from "react-native";
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

export const ShelterScreen: FC<ProfileNavigationStackScreenProps<'ShelterScreen'>> = ({ navigation, route }) => {
    const [data, setData] = useState<ShelterUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [petData, setPetData] = useState<PetData[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);


    const fetchProfile = async () => {
        try {
            const res = await get(`${BackendApiUri.getUserShelter}`);
            if (res.data) {
                setData(res.data)
            }
            if(res.data.Error) {
                setData(null);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const fetchPetData = async () => {
        try {
            if (data?.Data.Id == undefined) {
                setLoading(true)
            } else {
                const responsePet = await get(`${BackendApiUri.getPetList}/?shelter_id=${data?.Data.Id}`)
                if (responsePet && responsePet.status === 200) {
                    setPetData(responsePet.data);
                }
                setLoading(false)
            }
        } catch (e) {
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setFetchLoading(true);
                await fetchProfile();
                await fetchPetData();
                setFetchLoading(false);
            };
            fetchData();
        }, [navigation, route])
    );

    useEffect(() => {
        if (data) {
            fetchPetData();
        }
    }, [data]);

    const handleInputChange = (text: string) => {
        setInputValue(text);
    };

    const handleSubmitModal = () => {
        if (inputValue == data?.Data.Pin) {
            setIsModalOpen(false);
            setInputValue("");
            Alert.alert("Success", "Pin correct. Navigating to ManageShelterScreen.",
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
            <SafeAreaView className="flex-1 bg-gray-100">
                <GestureHandlerRootView className="flex-1">
                    <BottomSheetModalProvider>
                        {fetchLoading ? (
                            <>
                                <View className="flex-1 justify-center items-center">
                                    <ActivityIndicator size="large" color="#4689FD"/>
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
                                        <ScrollView className="my-5" contentContainerStyle={{width: "100%", height: "100%"}}>
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
                                                <TouchableOpacity style={styles.button}>
                                                    <View style={styles.iconContainer}>
                                                        <Ionicons name="receipt-outline" size={25} color="white" />
                                                    </View>
                                                    <Text style={styles.text}>Approval List</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {petData&&
                                                <View style={{ flex: 1, padding: 10 }}>
                                                    <FlashList
                                                        estimatedItemSize={25}
                                                        data={petData}
                                                        numColumns={1}
                                                        keyExtractor={item => item.Id.toString()}
                                                        renderItem={({ item: pet }) => (
                                                            <View style={{ flex: 1, marginBottom: 35, marginTop: 20 }}>
                                                                <TouchableOpacity className="mx-2 justify-center" activeOpacity={1}>
                                                                    <Image
                                                                        source={{ uri: `data:image/*;base64,${pet.ImageBase64}` }}
                                                                        className="w-full h-80 rounded-3xl"
                                                                    />

                                                                    <View style={{ position: 'absolute', top: 230, left: 0, right: 0, bottom: 0 }}>
                                                                        <View style={{ marginTop: 5, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 15 }}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pet.PetName}</Text>
                                                                                {pet.PetType === "Male" ? (
                                                                                    <FontAwesome6 name='venus' size={20} color='#FF6EC7' />
                                                                                ) : (
                                                                                    <FontAwesome6 name='mars' size={20} color='#4689FD' />
                                                                                )}
                                                                            </View>
                                                                            <View className="flex-row justify-between">
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                                                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                                                    <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{pet.ShelterLocation}</Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                                                    <FontAwesome6 name={pet.PetType.toLowerCase()} size={20} color='#8A8A8A' style={{ marginLeft: 20 }} />
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                    />
                                                </View>
                                            }
                                        </ScrollView>

                                        {isModalOpen &&
                                            <Modal visible={isModalOpen} transparent={true} animationType="fade">
                                                <View style={styles.modal}>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>Masukkan Pin</Text>
                                                        <View style={styles.inputBox}>
                                                            <TextInput
                                                                value={inputValue}
                                                                onChangeText={handleInputChange}
                                                                placeholder="Masukkan Pin"
                                                                keyboardType="numeric"
                                                            />
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
        flexDirection: 'row'
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
});
