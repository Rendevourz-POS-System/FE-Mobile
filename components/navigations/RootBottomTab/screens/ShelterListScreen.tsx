import { ActivityIndicator, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { HomeUserNavigationStackScreenProps, NoHeaderNavigationStackScreenProps, UserBottomTabCompositeNavigationProps, UserNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ShelterData } from "../../../../interface/IShelterList";
import { useDebounce } from "use-debounce";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import { myProvince } from "../../../../functions/getLocation";
import { get, post } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { ShelterFav } from "../../../../interface/IShelterFav";
import { PetType } from "../../../../interface/IPetType";
import { Location } from "../../../../interface/ILocation";
import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from '@shopify/flash-list';
import { Searchbar } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from "react-native-elements";
import { getIconName } from "../../../../functions/GetPetIconName";
import { NoHeaderProps } from "../../../../interface/TNoHeaderProps";

export const ShelterListScreen : FC<NoHeaderProps> = ({navigation, route} : any) => {
    const favAttempt = route.params;
    const [provinceData, setProvinceData] = useState<Location[]>([]);
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
    const [shelterFav, setShelterFav] = useState<ShelterData[]>([]);
    const [filterLocation, setFilterLocation] = useState<string>("");
    const [applyPressed, setApplyPressed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [refreshing, setRefreshing] = useState(false);
    // const [isModalVisible, setModalVisible] = useState(false);

    // console.log(navigateNoHeader)
    const onRefresh = async () => {
        try{
            setRefreshing(true);
            await fetchData();
        } catch(e){
            console.log(e);
        }
    };

    const getMyProvince = async () => {
        try {
            const res = await myProvince();
            if (res?.data && res.status === 200) {
                // Transform data to match Location interface
                const transformedData: Location[] = res.data.map((item: { Id: string; LocationName: string }) => ({
                    label: item.LocationName,
                    value: item.Id
                }));                
                // Set provinceData state with transformed data
                setProvinceData(transformedData);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleFilterPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const fetchShelter = async () => {
        try{
            const response = await get(`${BackendApiUri.getShelterList}/?search=${search}&location_name=${filterLocation}`);
            if(response && response.status === 200) {
                setShelterData(response.data);
            } else {
                setShelterData([]);
            }
        } catch(e) {
            console.error(e)
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
            console.error(e)
        }
    }

    function mergeShelters() {
        if (!shelterData || shelterData.length === 0) {
            // If shelterData is null or empty, return an empty array
            return [];
        } else if (!shelterFav || shelterFav.length === 0) {
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
            console.error(e)
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

    useEffect(() => {
        getMyProvince();
    },[]);

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
        setApplyPressed(false)
    }, [debounceValue, refreshing, favAttempt, applyPressed]);

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
    
    const renderItem = (item : Location) => {
        return (
            <View className="p-4 flex-row justify-between items-center">
                <Text className="flex-1 text-base">{item.label}</Text>
            </View>
        );
    };

    const handleApplyPress = () => {
        setApplyPressed(true);
        bottomSheetModalRef.current?.dismiss();
    };
    

    return (
        <>
            <BottomSheetModalProvider>
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
                            index={0}
                            snapPoints={['65%']}
                            backdropComponent={(props) => (
                                <BottomSheetBackdrop
                                    {...props}
                                    disappearsOnIndex={-1}
                                    appearsOnIndex={1}
                                    pressBehavior="close"
                                />
                            )}
                            style={styles.bottomSheetModal}
                            >
                            <BottomSheetView style={{ flex: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <View className='mx-5'>
                                        <Text className='text-xl font-bold'>Filter</Text>
                                        <View className='flex flex-row items-center justify-between'>
                                            <Text className='text-xl font-bold mt-2 mb-2'>Location</Text>
                                            <TouchableOpacity className='mt-2 mb-2 px-10 py-3 rounded-2xl' onPress={() => setFilterLocation("")}>
                                                <Text className='text-[#4689FD] text-lg font-bold'>Reset</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Dropdown
                                            style={{ borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10 }}
                                            containerStyle={{ borderWidth: 10 }}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={provinceData.map(item => ({ label: item.label, value: item.value }))}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select item"
                                            searchPlaceholder="Search..."
                                            value={filterLocation}
                                            onChange={item => {
                                                setFilterLocation(item.label);
                                            }}
                                            renderItem={renderItem}
                                        />

                                    </View>
                                </View>
                                <View className='items-center my-5'>
                                    <Button
                                        title="Apply"
                                        accessibilityLabel='Apply this'
                                        containerStyle={{ width: '35%' }}
                                        onPress={handleApplyPress}
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
                            {shelterData !== null && shelterData.length > 0 ? (
                                <FlashList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                    showsVerticalScrollIndicator={false}
                                    estimatedItemSize={50}
                                    data={mergedData || []}
                                    renderItem={({item: shelter}) => (
                                        <TouchableOpacity 
                                            style={{ overflow: 'hidden', marginHorizontal: 15 }} 
                                            onPress={() => navigation.navigate("ShelterDetailScreen", {shelterId : shelter.Id})}
                                            activeOpacity={1}>
                                                {shelter.ImageBase64 === null ? (
                                                    <Image source={require('../../../../assets/animal-shelter.png')} 
                                                        resizeMode='stretch'
                                                        style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} 
                                                    />
                                                ) : (
                                                    <Image source={{ uri: `data:image/*;base64,${shelter.ImageBase64}` }} 
                                                        resizeMode='contain'
                                                        style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} 
                                                    />
                                                )}
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
                                                            <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{shelter.ShelterLocationName}</Text>
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
            </BottomSheetModalProvider>
        </>
    )
}