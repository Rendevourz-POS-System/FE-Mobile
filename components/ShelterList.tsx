import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, TouchableOpacity, View, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
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
import { get, post } from '../functions/Fetch';
import { BackendApiUri } from '../functions/BackendApiUri';
import { Searchbar } from 'react-native-paper';
import { ShelterFav } from '../interface/IShelterFav';
import { PetType } from '../interface/IPetType';
import { getIconName } from '../functions/GetPetIconName';
import { SelectList } from 'react-native-dropdown-select-list';
import { dataProvinsi } from '../constans/data';
import { Dropdown } from 'react-native-element-dropdown';

interface Item {
    label: string;
    value: string;
  }

export const ShelterList = () => {
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
    const [shelterFav, setShelterFav] = useState<ShelterData[]>([]);
    const [filterLocation, setFilterLocation] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const orderBy = "ascending";
    const sort = "";
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        try{
            setRefreshing(true);
            fetchData();
        } catch(e){
            console.log(e);
        }
    };

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

    const fetchShelter = async () => {
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

    const fetchShelterFav = async () => {
        try{
            const response = await get(`${BackendApiUri.getShelterFav}`);
            if(response && response.status === 200)
            {
                setShelterFav(response.data);
            }
        } catch(e) {
            console.log(e)
        }
    }

    function mergeShelters() {
        if (!shelterFav || shelterFav.length === 0) {
            // If shelterFav is null or empty, return shelterData without marking any as favorites
            return shelterData.map(data => ({ ...data, isFav: false }));
        } else {
            // Otherwise, merge shelterData and shelterFav and mark favorites accordingly
            return shelterData.map(data => {
                const isFav = shelterFav.some(favShelter => favShelter.Id === data.Id);
                return { ...data, isFav };
            });
        }
    };

    const [mergedData, setMergedData] = useState<ShelterFav[]>([]);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const fetchPetType = async () => {
        try {
            const res = await get(BackendApiUri.getPetTypes);
            setPetTypes(res.data)
        } catch(e) {
            
        }
    }

    const fetchData =  () => {
        const data = mergeShelters();
        setMergedData(data);
    };

    useEffect(() => {
        fetchData();
        setRefreshing(false);
    }, [shelterFav, shelterData]);

    const onPressFav = async (shelterId: string) => {
        try {
            const body = { "ShelterId": shelterId }; // Body as an array containing an object
            const res = await post(BackendApiUri.postShelterFav, body);
            if(res.status === 200) {
                setMergedData(prevData => {
                    return prevData.map(shelter => {
                        if (shelter.Id === shelterId) {
                            return { ...shelter, isFav: !shelter.isFav }; // Toggle isFav property
                        }
                        return shelter;
                    });
                });
            }
        } catch (error) {
            console.error('Error:', error); // Handle error
        }
    }

    useEffect(() => {
        fetchShelter();
        fetchShelterFav();
        fetchPetType();
    }, [debounceValue, refreshing]);

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
        },
        dropdown: {
            margin: 16,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: {
            width: 0,
            height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
    
            elevation: 2,
        },
        icon: {
            marginRight: 5,
        },
        item: {
            padding: 17,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        textItem: {
            flex: 1,
            fontSize: 16,
        },
        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
        },
    });
    
    const renderItem = (item : Item) => {
        return (
            <View className="p-4 flex-row justify-between items-center">
                <Text className="flex-1 text-base">{item.value}</Text>
            </View>
        );
    };

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
                        backdropComponent={BottomSheetBackdrop}
                        style={styles.bottomSheetModal}
                        >
                        <BottomSheetView>
                            <View className='mx-5'>
                                <Text className='text-xl font-bold'>Filter</Text>

                                <Text className='text-xl font-bold mt-8 mb-2'>Location</Text>
                                <Dropdown
                                    style={{borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10}}
                                    containerStyle={{borderWidth: 10}}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={dataProvinsi.data.map(item => ({ label: item.key, value: item.value }))}
                                    search
                                    maxHeight={300}
                                    labelField="value"
                                    valueField="value"
                                    placeholder="Select item"
                                    searchPlaceholder="Search..."
                                    value={filterLocation}
                                    onChange={item => {
                                        setFilterLocation(item.value);
                                    }}
                                    renderItem={renderItem}
                                />

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
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                estimatedItemSize={50}
                                data={mergedData || []}
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
                                                        <TouchableOpacity onPress={() => onPressFav(shelter.Id)}>
                                                            {
                                                                shelter.isFav ? (
                                                                    <FontAwesome
                                                                        name='heart'
                                                                        size={24}
                                                                        style={{color: '#FF0000'}}
                                                                    />
                                                                ) : (
                                                                    <FontAwesome
                                                                        name='heart-o'
                                                                        size={24}
                                                                        style={{color: '#4689FD'}}
                                                                    />
                                                                )
                                                            }
                                                        </TouchableOpacity>

                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                        <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{shelter.ShelterLocation}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                                            {shelter.PetTypeAccepted.map((itemId) => {
                                                                const matchingPet = petTypes.find((pet) => pet.Id === itemId.toString());
                                                                if (matchingPet) {
                                                                    const iconName = getIconName(matchingPet.Type);
                                                                    if (iconName === 'rabbit') {
                                                                        return <MaterialCommunityIcons key={matchingPet.Id} name={iconName} size={29} color='#8A8A8A' style={{ marginEnd: 5 }} />;
                                                                    }
                                                                    return <FontAwesome6 key={matchingPet.Id} name={iconName} size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />;
                                                                }
                                                                return null;
                                                            })}
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
