import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useEffect, useState, FC } from 'react';
import { TouchableHighlight, TouchableOpacity, View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import TopNavigation from '../../../TopNavigation';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { IUser } from '../../../../interface/IUser';
import { get } from '../../../../functions/Fetch';
import { MaterialIcons } from '@expo/vector-icons';
import { IShelter } from '../../../../interface/IShelter';
import { PetData } from '../../../../interface/IPetList';
import { AdminNavigationStackScreenProps } from '../../StackScreenProps';

export const HomeAdmin: FC<AdminNavigationStackScreenProps<'HomeAdmin'>> = ({ navigation }: any) => {
    const [userData, setUserData] = useState<IUser[]>();
    const [shelterData, setShelterData] = useState<IShelter[]>();
    const [petData, setPetData] = useState<PetData[]>();
    const [selectedUser, setSelectedUser] = useState(null);

    const toggleDetail = (index: any) => {
        setSelectedUser(selectedUser === index ? null : index);
    };
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
                setUserData(response.data);
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
                            <TouchableOpacity className='pr-3' onPress={() => navigation.navigate("EditUserScreen", { userId: item.Id })}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity>
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
                            <TouchableOpacity className='pr-3'>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity>
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
                            <TouchableOpacity className='pr-3'>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity>
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
                <ScrollView>
                    {selectedTab === 'User' ? (RenderUser()) : (
                        <>
                            {selectedTab === 'Shelter' ? (RenderShelter()) : (RenderPet())}
                        </>
                    )}
                </ScrollView>
            </BottomSheetModalProvider>

        </View>
    )
};

export default HomeAdmin;
