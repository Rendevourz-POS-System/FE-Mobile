import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { FontAwesome,FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDebounce } from 'use-debounce';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { RootBottomTabCompositeNavigationProp } from './navigations/CompositeNavigationProps';
import { ShelterData } from '../interface/IShelterList';
import { get } from '../functions/Fetch';
import { BackendApiUri } from '../functions/BackendApiUri';
import { Searchbar } from 'react-native-paper';

export const ShelterList = () => {
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const orderBy = "ascending";
    const sort = "";

    const handleFilterPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

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

    const fetchData = async () => {
        try{
            const response = await get(`${BackendApiUri.getShelterList}/?search=${search}&page=${page}&page_size=${pageSize}&order_by=${orderBy}&sort=${sort}`);
            if(response && response.status === 200) {
                setShelterData(response.data);
            }
        } catch(e) {
            throw Error;
        } finally {
            setIsLoading(false);
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
            <View className=''>
                <View className='flex-row items-center justify-around'>
                    <Searchbar
                        placeholder='Text Here...'
                        value={search}
                        onChangeText={setSearch}
                        style={{backgroundColor: 'transparent', width:'87%'}}
                        loading={isLoading}
                    />
                    <MaterialCommunityIcons name='tune-variant' size={24} color='black'
                        style={{marginRight: 10}}
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

            <>
                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large"/>
                    </View>
                ) : (
                    <>
                        {shelterData && shelterData.length > 0 ? (
                            <FlashList
                                estimatedItemSize={50}
                                data={shelterData || []}
                                renderItem={({item: shelter}) => (
                                    <TouchableOpacity 
                                        style={{ overflow: 'hidden' }} 
                                        onPress={() => navigation.navigate("ShelterDetailScreen", { shelterId: shelter.Id })}
                                        activeOpacity={1}>
                                            <Image source={require('../assets/image.png')} style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
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
                            />
                        ) : (
                            <View className='flex flex-1 justify-center items-center'>
                                <Text className='text-center'>Sorry, data not found</Text>
                            </View>
                        )}
                    </>
                )}
            </>
        </>
    )
};

export default ShelterList;