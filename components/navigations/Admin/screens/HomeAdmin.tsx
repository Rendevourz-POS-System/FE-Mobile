import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useEffect, useState, FC } from 'react';
import { TouchableOpacity, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text } from 'react-native-elements';
import TopNavigation from '../../../TopNavigation';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { IUser } from '../../../../interface/IUser';
import { deletes, get } from '../../../../functions/Fetch';
import { MaterialIcons } from '@expo/vector-icons';
import { IShelter } from '../../../../interface/IShelter';
import { PetData } from '../../../../interface/IPetList';
import { AdminNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';

export const HomeAdmin: FC<AdminNavigationStackScreenProps<'HomeAdmin'>> = ({ navigation }: any) => {
    const [userData, setUserData] = useState<IUser[]>();
    const [shelterData, setShelterData] = useState<IShelter[]>();
    const [petData, setPetData] = useState<PetData[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const data = [
        { id: 'user', name: 'User', icon: 'user' },
        { id: 'home', name: 'Shelter', icon: 'home' },
        { id: 'paw', name: 'Pets', icon: 'paw' },
    ];

    const [selectedTab, setSelectedTab] = useState<string>('User');

    const selectTab = (tabName: string) => {
        if (selectedTab !== tabName) {
            setSelectedTab(tabName);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchShelter();
        fetchPet();
    }, [])

    const fetchUser = async () => {
        try {
            const response = await get(`${BackendApiUri.getUser}`);
            if (response && response.status === 200) {
                // Filter items with Email === 'administrator@gmail.com'
                const filteredData = response.data.filter((item : any )=> item.Email !== 'administrator@gmail.com');

                setUserData(filteredData);
            } else {
                setUserData([]);
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShelter = async () => {
        try {
            const response = await get(`${BackendApiUri.getShelterList}`);
            if (response && response.status === 200) {
                setShelterData(response.data);
            } else {
                setShelterData([]);
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPet = async () => {
        try {
            const response = await get(`${BackendApiUri.getPetList}`);
            if (response && response.status === 200) {
                setPetData(response.data);
            } else {
                setPetData([]);
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteUser = async (id: string, name: string) => {
        Alert.alert(`Apakah Anda Yakin ingin menghapus ${name}`, '', [
            {
                text: 'Cancel',
                onPress: () => navigation.navigate("HomeAdmin"),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    setIsLoading(true)
                    try {
                        const response = await deletes(`${BackendApiUri.deleteAdminUser}/${id}`);
                        if (response && response.status === 200) {
                            Alert.alert(`Anda berhasil menghapus ${name}`)
                        }
                    } catch (e) {
                        Alert.alert(`Anda gagal menghapus ${name}`)
                    } finally {
                        setIsLoading(false);
                    }
                }
            },
        ]);
    }

    const handleDeleteShelter = async (id: string, name: string) => {
        Alert.alert(`Apakah Anda Yakin ingin menghapus ${name}`, '', [
            {
                text: 'Cancel',
                onPress: () => navigation.navigate("HomeAdmin"),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    setIsLoading(true)
                    try {
                        const response = await deletes(`${BackendApiUri.deleteAdminShelter}/${id}`);
                        if (response && response.status === 200) {
                            Alert.alert(`Anda berhasil menghapus ${name}`)
                        }
                    } catch (e) {
                        Alert.alert(`Anda gagal menghapus ${name}`)
                    } finally {
                        setIsLoading(false);
                    }
                }
            },
        ]);
    }

    const handleDeletePet = async (id: string, name: string) => {
        Alert.alert(`Apakah Anda Yakin ingin menghapus ${name}`, '', [
            {
                text: 'Cancel',
                onPress: () => navigation.navigate("HomeAdmin"),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    setIsLoading(true)
                    try {
                        const response = await deletes(`${BackendApiUri.deleteAdminPet}/${id}`);
                        if (response && response.status === 200) {
                            Alert.alert(`Anda berhasil menghapus ${name}`)
                        }
                    } catch (e) {
                        Alert.alert(`Anda gagal menghapus ${name}`)
                    } finally {
                        setIsLoading(false);
                    }
                }
            },
        ]);
    }

    const RenderUser = () => {
        return (
            <View>
                <View className='p-5 flex-row justify-around m-3 mt-2 mb-0 rounded-xl'>
                    <Text className='mr-5 font-bold'>No</Text>
                    <Text className='flex-1 font-bold'>Email</Text>
                    <Text className='flex-2 mr-3 font-bold'>Action</Text>
                </View>
                {userData && userData.map((item, index) => (
                    <View key={index} className='p-5 flex-row justify-around bg-white m-3 mt-0 rounded-xl'>
                        <Text className='ml-2 mr-5'>{index + 1}</Text>
                        <Text className='flex-1 ml-2'>{item.Email}</Text>
                        <Text className='flex-2'>
                            <TouchableOpacity className='pr-3' onPress={() => navigation.navigate("EditUserScreen", {userId: item.Id})}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteUser(item.Id, item.Email)}>
                                <MaterialIcons name="delete" size={24} color="#8A0B1E" />
                            </TouchableOpacity>
                        </Text>
                    </View>
                ))}
            </View>
        )
    }

    const RenderShelter = () => {
        return (
            <View>
                <View className='p-5 flex-row justify-around m-3 mt-2 mb-0 rounded-xl'>
                    <Text className='mr-5 font-bold'>No</Text>
                    <Text className='flex-1 font-bold'>Name</Text>
                    <Text className='flex-2 mr-3 font-bold'>Action</Text>
                </View>
                {shelterData && shelterData.map((item, index) => (
                    <View key={index} className='p-5 flex-row justify-around bg-white m-3 mt-0 rounded-xl'>
                        <Text className='ml-2 mr-5'>{index + 1}</Text>
                        <Text className='flex-1 ml-2'>{item.ShelterName}</Text>
                        <Text className='flex-2'>
                            <TouchableOpacity className='pr-3' onPress={() => navigation.navigate("EditShelterScreen", { shelterId: item.Id })}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteShelter(item.Id, item.ShelterName)}>
                                <MaterialIcons name="delete" size={24} color="#8A0B1E" />
                            </TouchableOpacity>
                        </Text>
                    </View>
                ))}
            </View>
        )
    }

    const RenderPet = () => {
        return (
            <View>
                <View className='p-5 flex-row justify-around m-3 mt-2 mb-0 rounded-xl'>
                    <Text className='mr-5 font-bold'>No</Text>
                    <Text className='flex-1 font-bold'>Name</Text>
                    <Text className='flex-2 mr-3 font-bold'>Action</Text>
                </View>
                {petData && petData.map((item, index) => (
                    <View key={index} className='p-5 flex-row justify-around bg-white m-3 mt-0 rounded-xl'>
                        <Text className='ml-2 mr-5'>{index + 1}</Text>
                        <Text className='flex-1 ml-2'>{item.PetName}</Text>
                        <Text className='flex-2'>
                            <TouchableOpacity className='pr-3' onPress={() => navigation.navigate("EditPetScreen", { petId: item.Id })}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeletePet(item.Id, item.PetName)}>
                                <MaterialIcons name="delete" size={24} color="#8A0B1E" />
                            </TouchableOpacity>
                        </Text>
                    </View>
                ))}
            </View>
        )
    }

    return (
        <View className='flex-1'>
            <TopNavigation />
            <BottomSheetModalProvider>
                <View className='flex-row justify-around items-center'>
                    {data.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => selectTab(item.name)}
                            className={`w-1/2 py-3 m-2 ${selectedTab === item.name ? 'border-b-2 border-blue-400' : 'border-transparent'}`}
                        >
                            <Text className={`text-center ${selectedTab === item.name ? 'text-blue-400' : 'text-gray-700'}`}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large" />
                    </View>
                ) : (
                    <ScrollView>
                        {selectedTab === 'User' ? (RenderUser()) : (
                            <>
                                {selectedTab === 'Shelter' ? (RenderShelter()) : (RenderPet())}
                            </>
                        )}
                    </ScrollView>
                )}
            </BottomSheetModalProvider>

        </View>
    )
};

export default HomeAdmin;
