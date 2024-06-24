import { FC, useEffect, useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { CreateNavigationStackScreenProps } from "../../../StackParams/StackScreenProps"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { ShelterData } from "../../../../interface/IShelterList"
import { Location } from "../../../../interface/ILocation"
import { useDebounce } from "use-debounce"
import { get } from "../../../../functions/Fetch"
import { BackendApiUri } from "../../../../functions/BackendApiUri"
import { useAuth } from "../../../../app/context/AuthContext"
import { ShelterFav } from "../../../../interface/IShelterFav"
import { PetType } from "../../../../interface/IPetType"
import { myProvince } from "../../../../functions/getLocation"
import { Searchbar } from "react-native-paper"
import { ActivityIndicator } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { RefreshControl } from "react-native"
import { getIconName } from "../../../../functions/GetPetIconName"
import { truncateText } from "../../../../functions/TruncateText"

export const ChooseShelter: FC<CreateNavigationStackScreenProps<'ChooseShelter'>> = ({navigation, route}: any) => {
    const createType = route.params.type
    const {authState} = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [provinceData, setProvinceData] = useState<Location[]>([]);
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
    const [shelterFav, setShelterFav] = useState<ShelterData[]>([]);
    const [filterLocation, setFilterLocation] = useState<Location>({
        label: "",
        value: ""
    });
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const [refreshing, setRefreshing] = useState(false);

    const fetchShelter = async () => {
        try{
            const response = await get(`${BackendApiUri.getShelterList}/?search=${search}&location_name=${filterLocation?.label}`);
            if(response.data && response.status === 200) {
                const filterShelter = response.data.filter((shelter: ShelterData) => shelter.UserId != authState?.userId);
                setShelterData(filterShelter);
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

    const fetchData =  () => {
        const data = mergeShelters();
        setMergedData(data);
    };

    useEffect(() => {
        fetchData();
        setRefreshing(false);
    }, [shelterFav, shelterData]);

    useEffect(() => {
        fetchShelter();
        fetchShelterFav();
        fetchPetType();
    }, [debounceValue, refreshing]);

    const onRefresh = async () => {
        try{
            setRefreshing(true);
            await fetchData();
        } catch(e){
            console.log(e);
        }
    };



    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <View className="">
                    <View className="mt-5 flex-row items-center justify-center mb-3">
                        <Ionicons name="chevron-back" size={24} color="black"
                            onPress={() => {
                                // if (image) {
                                //     removeImage(image!);
                                // }
                                navigation.goBack()
                            }}
                            style={{ position: 'absolute', left: 20 }} />
                        <Text className="text-xl">Shelter List</Text>
                    </View>
                    <View className="mx-3 mb-3">
                        <Searchbar
                            placeholder="Search"
                            onChangeText={text => setSearch(text)}
                            value={search}
                            loading={isLoading}
                            style={{backgroundColor: 'white'}}
                        />
                        <Text className="text-md mt-2 mx-2">Pilih shelter yang di-inginkan untuk <Text className="underline font-bold">{createType} Pet</Text></Text>
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
                                            onPress={() => {
                                                if(createType == 'Rescue'){
                                                    navigation.navigate('CreateRescueScreen', {shelterId: shelter.Id, type: 'Rescue'} )
                                                } else {
                                                    navigation.navigate('CreateSurrenderScreen', {shelterId: shelter.Id, type: 'Surrender'})
                                                }
                                            }}
                                            activeOpacity={1}
                                        >
                                                {shelter.ImageBase64 === null ? (
                                                    <Image source={require('../../../../assets/animal-shelter.png')} 
                                                        resizeMode='cover'
                                                        height={290}
                                                        style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderRadius: 20 }} 
                                                    />
                                                ) : (
                                                    <Image source={{ uri: `data:image/*;base64,${shelter.ImageBase64}` }} 
                                                        resizeMode='cover'
                                                        height={290}
                                                        style={{ width: '100%', marginBottom: 15, marginTop: 5, borderRadius: 20 }} 
                                                        
                                                    />
                                                )}
                                                <View style={{ position: 'absolute', top: 168, left: 0, right: 0, bottom: 0}}>
                                                    <View style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20 }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{truncateText(shelter.ShelterName, 40)}</Text>
                                                            <TouchableOpacity activeOpacity={0}>
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
                                <View className=''>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={
                                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                        }
                                        className="w-full h-full"
                                        contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                    >
                                        <Text className=''>Sorry, data not found</Text>
                                    </ScrollView>
                                </View>
                            )}
                        </>
                    )}
                </>
                
            </SafeAreaView>
        </SafeAreaProvider>
    )
}