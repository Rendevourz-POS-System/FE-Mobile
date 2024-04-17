import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RootBottomTabCompositeNavigationProp } from './CompositeNavigationProps';
import { BackendApiUri } from '../../functions/BackendApiUri';

interface ShelterData {
    Id: string;
    UserId: string;
    ShelterName: string;
    ShelterLocation: string;
    ShelterCapacity: number;
    ShelterContactNumber: string;
    ShelterDescription: string;
    TotalPet: number;
    BankAccountNumber: string;
    Pin: string;
    ShelterVerified: boolean;
    CreatedAt: string;
}

export const HomeUser = () => {
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const search = "";
            const page = 1;
            const pageSize = 10;
            const orderBy = "ascending";
            const sort = "";

            try {
                const response = await axios.get(`${BackendApiUri.getShelterList}/?search=${search}&page=${page}&page_size=${pageSize}&order_by=${orderBy}&sort=${sort}`);
                setShelterData(response.data);
            } catch (error) {
                console.error("Error fetching shelter data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <View className='mx-1 mt-4 '>
                <Text className='text-xl font-bold'>Find a Pet or Shelter</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Input
                        placeholder='Search'
                        leftIcon={{ type: 'font-awesome', name: 'search' }}
                        inputContainerStyle={{ marginTop: 10, borderWidth: 1, borderRadius: 22, borderColor: 'grey', width: '85%' }}
                        leftIconContainerStyle={{ marginLeft: 10 }}
                    />
                    <MaterialCommunityIcons name='tune-variant' size={24} color='black'
                        style={{ marginLeft: -68, marginTop: -15, borderWidth: 1, borderRadius: 22, padding: 14 }}
                    />
                </View>
            </View>

            {shelterData.map((shelter, index) => (
                <TouchableOpacity key={index} style={{ overflow: 'hidden' }} onPress={() => navigation.navigate("ShelterDetailScreen")}>
                    <Image source={require('../../assets/image.png')} style={{ width: '100%', height: 290, marginTop: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                    <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                        <View className='rounded-t-3xl mt-5' style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text className='text-xl font-bold'>{shelter.ShelterName}</Text>
                                <FontAwesome name='heart' size={24} color="#4689FD" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                <Text className='text-s font-light ml-2'>{shelter.ShelterLocation}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <FontAwesome6 name='cat' size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                    <FontAwesome6 name='dog' size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                    <MaterialCommunityIcons name='rabbit' size={29} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={{ overflow: 'hidden' }} onPress={() => navigation.navigate("ShelterDetailScreen")}>
                <Image source={require('../../assets/image.png')} style={{ width: '100%', height: 290, marginTop: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                    <View className='rounded-t-3xl mt-5' style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text className='text-xl font-bold'>Shelter Hewan Jakarta</Text>
                            <FontAwesome name='heart' size={24} color="#4689FD" />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                            <Text className='text-s font-light ml-2'>Jl. Kebon Jeruk Raya No. 1, Jakarta Barat</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                <FontAwesome6 name='cat' size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                <FontAwesome6 name='dog' size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                <MaterialCommunityIcons name='rabbit' size={29} color='#8A8A8A' style={{ marginEnd: 5 }} />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}