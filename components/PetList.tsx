import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PetData } from "../interface/IPetList";
import { useDebounce } from "use-debounce";
import { get } from "../functions/Fetch";
import { BackendApiUri } from "../functions/BackendApiUri";
import { ActivityIndicator, Image, RefreshControl, StyleSheet, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { RootBottomTabCompositeNavigationProp } from "./navigations/CompositeNavigationProps";
import { dataJenisHewan } from "../constans/data";


export const PetList = () => {
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
    const [petData, setPetData] = useState<PetData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = () => {
        try { 
            setRefreshing(true);
            fetchData();
        } catch(e) {
            console.log(e);
        }
    };

    const handleFilterPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const filterShelter = [
        {id: 'jakartaBarat', name: 'Jakarta Barat'},
        {id: 'jakartaTimur', name: 'Jakarta Timur'},
        {id: 'jakartaSelatan', name: 'Jakarta Selatan'},
        {id: 'jakartaUtara', name: 'Jakarta Utara'}
    ]

    const fetchData = async () => {
        try{
            const responsePet = await get(`${BackendApiUri.getPetList}`)
            if(responsePet && responsePet.status === 200) {
                setPetData(responsePet.data);
            }
        } catch(e) {
            throw Error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setRefreshing(false);
    }, [debounceValue, refreshing]);


    const styles = StyleSheet.create({
        bottomSheetModal: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
        }
    });

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


    return (
        <>
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
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
                                    {/* {filterPet.map((pet) => (
                                        <TouchableOpacity
                                            key={pet.id}
                                            onPress={() => togglePetSelection(pet.id)}
                                            className={`rounded-full px-4 py-2 m-2 ${isPetSelected(pet.id) ? 'bg-blue-500' : 'bg-gray-200'}`}
                                        >
                                            <Text className={`text-gray-700 ${isPetSelected(pet.id) ? 'text-white' : ''}`}>
                                                {pet.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))} */}
                                    <FlashList
                                        estimatedItemSize={5}
                                        data={dataJenisHewan}
                                        horizontal={true}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                key={item.key}
                                                activeOpacity={1}
                                                className="mx-2"
                                            >
                                                <View className="flex justify-center items-center">
                                                    <TouchableOpacity 
                                                    onPress={() => {
                                                        // Toggle selection of the item
                                                        setSelectedItems(prevState => {
                                                            if (prevState.includes(item.value)) {
                                                                return prevState.filter(val => val !== item.value);
                                                            } else {
                                                                return [...prevState, item.value];
                                                            }
                                                        });
                                                    }}>
                                                        <Image
                                                            source={require(`../assets/icon_${"Cat"}.jpg`)}
                                                            style={{ width: 80, height: 80, borderRadius: 100 }}
                                                        />
                                                        <Text>{item.value}</Text>
                                                        {selectedItems.includes(item.value) && ( // Conditionally render the checklist icon if the item is selected
                                                            <FontAwesome name="check-circle" size={20} color="green" style={{ position: 'absolute', bottom: 5, right: 5 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
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

            {isLoading ? (
                <View className='flex-1 justify-center items-center'>
                    <ActivityIndicator color="blue" size="large"/>
                </View>
                ) : (
                    <FlashList
                        estimatedItemSize={50}
                        data={petData || []}
                        renderItem={({ item: pet }) => (
                            <TouchableOpacity
                                style={{ overflow: 'hidden' }}
                                onPress={() => navigation.navigate("PetDetailScreen")}
                                activeOpacity={1}
                            >
                                <Image source={require('../assets/image.png')} style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                                <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                                    <View style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pet.PetName}</Text>
                                            <FontAwesome name='heart' size={24} color="#4689FD" />
                                        </View>
                                        <View className="flex-row">
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginEnd:70 }}>
                                                {pet.PetType === "Male" ? (
                                                    <FontAwesome6 name='mars' size={20} color='#FF6EC7' />
                                                ) : (
                                                    <FontAwesome6 name='venus' size={20} color='#4689FD' />
                                                )}
                                                <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{pet.PetGender}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                <FontAwesome6 name='calendar-days' size={20} color='#4689FD' />
                                                <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>
                                                    {Math.floor(pet.PetAge / 12)} years, {pet.PetAge % 12} months
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1, position: 'relative' }}>
                                                <FontAwesome6 name='syringe' size={24} color='#4689FD' style={{ marginEnd: 5, zIndex: 1 }} />
                                                {pet.IsVaccinated ? (
                                                    <FontAwesome6 name='check' size={12} color='green' style={{ position: 'absolute', top: 15, right: 5, zIndex: 2 }} />
                                                ) : (
                                                    <FontAwesome6 name='xmark' size={12} color='green' style={{ position: 'absolute', top: 15, right: 5, zIndex: 2 }} />
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
            )}
        </ScrollView>
        </>
    )



}