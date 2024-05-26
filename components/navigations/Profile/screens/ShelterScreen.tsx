import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { Text, View, StyleSheet, Modal, Alert, TouchableOpacity, TextInput, ScrollView, Image, TouchableHighlight } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { CreateShelter } from "../../../CreateShelter";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { ShelterUser } from "../../../../interface/IShelter";
import { PetData } from "../../../../interface/IPetList";
import { FlashList } from "@shopify/flash-list";

export const ShelterScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ShelterScreen'>> = ({ navigation }) => {
    const [data, setData] = useState<ShelterUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [shelterId, setShelterId] = useState('');
    const [shelterName, setShelterName] = useState('');
    const [petData, setPetData] = useState<PetData[]>([]);

    const fetchProfile = async () => {
        try {
            const res = await get(BackendApiUri.getUserShelter);
            if (!res.data.Error) {
            }
            if (res.data.Data) {
                setData(res.data)
                setShelterId(res.data.Data.Id);
                setShelterName(res.data.Data.ShelterName)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const fetchPetData = async () => {
        try{
            const responsePet = await get(`${BackendApiUri.getPetList}/?shelter_name=${shelterName}&page=1&page_size=200`)
            if(responsePet && responsePet.status === 200) {
                setPetData(responsePet.data);
                console.log(petData)
            }
        } catch(e) {
            throw Error;
        } 
    };

    useEffect(() => {
        fetchProfile();
        fetchPetData();
    }, [shelterId, shelterName])

    const handleInputChange = (text: string) => {
        setInputValue(text);
    };
    
    const handleSubmitModal = () => {
        if (data) {
            if (inputValue == data?.Data.Pin) {
                setIsModalOpen(false);
                setInputValue("");
                navigation.navigate("ManageShelterScreen");
            } else {
                setErrorMessage("Pin Salah")
            }
        }
    }

    const handleCancelModal = () => {
        setIsModalOpen(false);
        setInputValue("");
        setErrorMessage("");
    }

    return (
        <SafeAreaProvider style={styles.container}>
            {!data ?
                <>
                    <View className="mt-14 flex-row items-center justify-center mb-3">
                        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                        <Text className="text-xl">Create Shelter</Text>
                    </View>
                    <CreateShelter />
                </>
                :
                <>
                    <View className="mt-14 flex-row items-center justify-center mb-3">
                        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                        <Text className="text-xl">Shelter Dashboard</Text>
                    </View>
                    <ScrollView className="mt-5">
                        <View className="mt-10 flex-row justify-around">
                            <TouchableOpacity style={styles.button} onPress={() => setIsModalOpen(true)}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="settings-outline" size={25} color="white" />
                                </View>
                                <Text style={styles.text}>Manage Shelter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("NotificationScreen")}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="notifications" size={25} color="white" />
                                </View>
                                <Text style={styles.text}>Notification</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <View style={styles.iconContainer}>
                                    <MaterialIcons name="tv" size={25} color="white" />
                                </View>
                                <Text style={styles.text}>Monitoring</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="mt-10 flex-row justify-around">
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreatePetScreen", {shelterId : shelterId})}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="plus" color="white" size={25} />
                                </View>
                                <Text style={styles.text}>Tambah Hewan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="history" color="white" size={25} />
                                </View>
                                <Text style={styles.text}>History List</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="receipt-outline" size={25} color="white" />
                                </View>
                                <Text style={styles.text}>Approval List</Text>
                            </TouchableOpacity>
                        </View>

                        {petData &&
                            <View style={{ flex: 1, padding: 10 }}>
                                <FlashList
                                    estimatedItemSize={25}
                                    data={petData || []}
                                    numColumns={1}
                                    keyExtractor={item => item.Id.toString()}
                                    renderItem={({ item: pet }) => (
                                        <View style={{ flex: 1, marginBottom: 35, marginTop: 20 }}>
                                            <TouchableOpacity className="mx-2 justify-center" activeOpacity={1}>
                                            <Image
                                                source={{ uri: `data:image/*;base64,${pet.ImageBase64}` }}
                                                className="w-full h-80 rounded-3xl"
                                                />
                                                <TouchableHighlight
                                                    style={{
                                                        position: 'absolute',
                                                        top: 7,
                                                        right: 7,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.65)',
                                                        padding: 8,
                                                        borderRadius: 999
                                                    }}
                                                    underlayColor="transparent"
                                                    onPress={() => {
                                                        // Add your onPress logic here
                                                    }}
                                                >
                                                    <View className="rounded-full">
                                                        <FontAwesome name='heart' size={20} color="#FF0000" />
                                                    </View>
                                                </TouchableHighlight>

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
                                                        <View className="flex-row">
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                                <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                                <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>Jakarta Barat</Text>
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
