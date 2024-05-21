import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { Text, View, StyleSheet, Modal, Alert, TouchableOpacity, TextInput, ScrollView, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { CreateShelter } from "../../../CreateShelter";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { ShelterUser } from "../../../../interface/IShelter";
import { Searchbar } from "react-native-paper";

export const ShelterScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ShelterScreen'>> = ({ navigation }) => {
    const [data, setData] = useState<ShelterUser>();
    const [flag, setFlag] = useState(0);
    const [search, setSearch] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchUserShelter = async () => {
        const res = await get(BackendApiUri.getUserShelter);
        setData(res.data);
    }

    useEffect(() => {
        fetchUserShelter();
        if (data?.Data) {
            setFlag(1);
        }
    }, [])

    const handleInputChange = (text: string) => {
        setInputValue(text);
    };

    const handleSubmitModal = () => {
        if (inputValue == data?.Data.Pin) {
            console.log(inputValue, data)
            setIsModalOpen(false);
            setInputValue("");
            navigation.navigate("FavoriteScreen");
        } else {
            setErrorMessage("Pin Salah")
        }
    }

    const handleCancelModal = () => {
        setIsModalOpen(false);
        setInputValue("");
        setErrorMessage("");
    }

    return (
        <SafeAreaProvider style={styles.container}>
            {flag == 0 ?
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
                        <View className='flex-row items-center justify-around'>
                            <Searchbar
                                placeholder='Text Here...'
                                value={search}
                                onChangeText={setSearch}
                                style={{ backgroundColor: 'white', width: '87%' }}
                            />
                            <MaterialCommunityIcons name='tune-variant' size={24} color='black'
                                style={{ marginRight: 10 }}
                            />
                        </View>

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
                            <TouchableOpacity style={styles.button}>
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
    buttonCancel:{
        backgroundColor: '#F2B61D',
        padding: 5,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonOke:{
        backgroundColor: '#4689FD',
        padding: 5,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
});
