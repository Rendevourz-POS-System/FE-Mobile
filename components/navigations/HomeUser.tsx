import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RootBottomTabCompositeNavigationProp } from './CompositeNavigationProps';
import { BackendApiUri } from '../../functions/BackendApiUri';
import { useDebounce } from 'use-debounce';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

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

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    // callbacks
    const handleFilterPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const [shelterData, setShelterData] = useState<ShelterData[]>([]);

    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);

    const data = [
        { id: 'home', name: 'Shelter', icon: 'home' },
        { id: 'paw', name: 'Pets', icon: 'paw' },
    ];

    const filterPet = [
        {id: 'cat', name: 'Cat'},
        {id: 'dog', name: 'Dog'},
        {id: 'rabbit', name: 'Rabbit'},
        {id: 'hamster', name: 'Hamster'}
    ]

    const filterShelter = [
        {id: 'jakartaBarat', name: 'Jakarta Barat'},
        {id: 'jakartaTimur', name: 'Jakarta Timur'},
        {id: 'jakartaSelatan', name: 'Jakarta Selatan'},
        {id: 'jakartaUtara', name: 'Jakarta Utara'}
    ]

    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const orderBy = "ascending";
    const sort = "";
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BackendApiUri.getShelterList}/?search=${search}&page=${page}&page_size=${pageSize}&order_by=${orderBy}&sort=${sort}`);
            setShelterData(response.data);
        } catch (error) {
            console.error("Error fetching shelter data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [debounceValue]);

    const [selectedShelters, setSelectedShelters] = useState<string[]>([]);

    const toggleShelterSelection = (shelterId: string) => {
        setSelectedShelters((prevSelectedShelters) => {
            if (prevSelectedShelters.includes(shelterId)) {
                return prevSelectedShelters.filter((id) => id !== shelterId);
            } else {
                return [...prevSelectedShelters, shelterId];
            }
        });
    };

    const isShelterSelected = (shelterId: string) => {
        return selectedShelters.includes(shelterId);
    };

    const [selectedPets, setSelectedPets] = useState<string[]>([]);

    const togglePetSelection = (petId: string) => {
        setSelectedPets((prevSelectedPets) => {
            if (prevSelectedPets.includes(petId)) {
                return prevSelectedPets.filter((id) => id !== petId);
            } else {
                return [...prevSelectedPets, petId];
            }
        });
    };

    const isPetSelected = (petId: string) => {
        return selectedPets.includes(petId);
    };


    const styles = StyleSheet.create({
        bottomSheetModal: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
        }
    });

    return (
        <>
        <BottomSheetModalProvider>
            <View className='mt-4'>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Input
                        value={search}
                        onChangeText={setSearch}
                        placeholder='Search'
                        leftIcon={{ type: 'font-awesome', name: 'search' }}
                        inputContainerStyle={{ marginTop: 10, borderWidth: 1, borderRadius: 22, borderColor: 'grey', width: '85%' }}
                        leftIconContainerStyle={{ marginLeft: 10 }}
                    />
                    <MaterialCommunityIcons name='tune-variant' size={24} color='black'
                        style={{ marginLeft: -68, marginTop: -15, borderWidth: 1, borderRadius: 22, padding: 14 }}
                        onPress={handleFilterPress}
                    />
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={1}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                        backdropComponent={BottomSheetBackdrop}
                        style={styles.bottomSheetModal}
                        >
                        <BottomSheetView>
                            <View className='mx-5'>
                                <Text className='text-xl font-bold'>Filter</Text>
                                <Text className='text-xl font-bold mt-8'>Pet</Text>
                                <View className='flex flex-row flex-wrap'>
                                    {filterPet.map((pet) => (
                                        <TouchableOpacity
                                            key={pet.id}
                                            onPress={() => togglePetSelection(pet.id)}
                                            className={`rounded-full px-4 py-2 m-2 ${isPetSelected(pet.id) ? 'bg-blue-500' : 'bg-gray-200'}`}
                                        >
                                            <Text className={`text-gray-700 ${isPetSelected(pet.id) ? 'text-white' : ''}`}>
                                                {pet.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>


                                <Text className='text-xl font-bold mt-8'>Shelter</Text>
                                <View className='flex flex-row flex-wrap'>
                                    {filterShelter.map((shelter) => (
                                        <TouchableOpacity
                                            key={shelter.id}
                                            onPress={() => toggleShelterSelection(shelter.id)}
                                            className={`rounded-full px-4 py-2 m-2 ${isShelterSelected(shelter.id) ? 'bg-blue-500' : 'bg-gray-200'}`}
                                        >
                                            <Text className={`text-gray-700 ${isShelterSelected(shelter.id) ? 'text-white' : ''}`}>
                                                {shelter.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </BottomSheetView>
                    </BottomSheetModal>
                </View>
            </View>

            <View style={{ flexDirection: 'row' }}
            className='mx-3'>
                {data.map((item, index) => (
                    <View className='items-center mr-3' key={item.id}>
                        <View 
                            key={index} 
                            className='bg-blue-500 rounded-full p-5'
                        >
                            <FontAwesome5 name={item.icon} size={30} color='white' />
                        </View>
                        <Text className='text-black mt-2 font-bold'>{item.name}</Text>
                    </View>
                ))}
            </View>

            <FlatList
                data={shelterData}
                maxToRenderPerBatch={15}
                className='mt-3 mx-3'
                renderItem={({ item: shelter }) => (
                    <TouchableOpacity 
                        style={{ overflow: 'hidden' }} 
                        onPress={() => navigation.navigate("ShelterDetailScreen", { shelterId: shelter.Id })}
                        activeOpacity={1}>
                            <Image source={require('../../assets/image.png')} style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                            <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0}}>
                                <View style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{shelter.ShelterName}</Text>
                                        <FontAwesome name='heart' size={24} color="#4689FD" />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                        <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{shelter.ShelterLocation}</Text>
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
                )}
                keyExtractor={(item) => item.Id}
            />
        </BottomSheetModalProvider>
        </>
        
    )
};

export default HomeUser;
