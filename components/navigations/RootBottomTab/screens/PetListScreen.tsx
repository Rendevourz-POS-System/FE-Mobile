import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet"
import { FlashList } from "@shopify/flash-list";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown";
import { Button } from "react-native-elements";
import { Searchbar, TextInput } from "react-native-paper";
import { PetData } from "../../../../interface/IPetList";
import { useDebounce } from "use-debounce";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get, post } from "../../../../functions/Fetch";
import { Location } from "../../../../interface/ILocation";
import { dataJenisHewan } from "../../../../constans/data";
import { ProfileProps } from "../../../../interface/TProfileProps";
import { NoHeaderProps } from "../../../../interface/TNoHeaderProps";
import { PetFav } from "../../../../interface/IPetFav";
import { myProvince } from "../../../../functions/getLocation";
import { truncateText } from "../../../../functions/TruncateText";

type PetImageMap = {
    [key: string]: any; // This allows indexing with strings
};

export const PetListScreen : FC<NoHeaderProps> = ({navigation, route} : any) => {
    const favAttempt = route.params;
    const [filterLocation, setFilterLocation] = useState<Location>({
        label: "",
        value: ""
    });
    const [petData, setPetData] = useState<PetData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);
    const [applyPressed, setApplyPressed] = useState<boolean>(false);
    const [shelterName, setShelterName] = useState<string>("");
    const [petFav, setPetFav] = useState<PetData[]>([]);
    const [mergedData, setMergedData] = useState<PetFav[]>([]);
    const [provinceData, setProvinceData] = useState<Location[]>([]);

    const onRefresh = () => {
        try { 
            setRefreshing(true);
            fetchPet();
            fetchData();
        } catch(e) {
            console.log(e);
        }
    };

    const handleFilterPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    function mergePets() {
        if(!petData || petData.length === 0) {
            return [];
        } else if(!petFav || petFav.length === 0) {
            return petData.map(data => ({ ...data, isFav : false}))
        } else {
            return petData.map(data => {
                const isFav = petFav.some(favPet => favPet.Id === data.Id);
                return { ...data, isFav }
            })
        }
    }

    const fetchPetFav = async () => {
        try {
            const response = await get(`${BackendApiUri.getPetFav}`);
            if(response && response.status === 200) {
                setPetFav(response.data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const fetchPet = async () => {
        try{
            let url = `${BackendApiUri.getPetList}/?search=${search}&location=${filterLocation.label}&shelter_name=${shelterName}`
            if(selectedItems.length > 0 ) {
                for(let i=0; i<selectedItems.length; i++) {
                    url += `&type=${selectedItems[i]}`;
                }
            }
            const responsePet = await get(`${url}`);
            if(responsePet.data && responsePet.status === 200) {
                const userShelter = await get(`${BackendApiUri.getUserShelter}`);
                if(userShelter.data.Data) {
                    const popUserPet = responsePet.data.filter((pet: PetData) => pet.ShelterId !== userShelter.data.Data.Id);
                    setPetData(popUserPet);
                } else {
                    setPetData(responsePet.data);
                }
            } else {
                setPetData([]);
            }
        } catch(e) {
            throw Error;
        } finally {
            setIsLoading(false);
        }
    }

    const fetchData = async () => {
        const data = mergePets();
        const atas = data.filter(item => item.ShelterId != null && item.IsAdopted == false);
        setMergedData(atas);
    };

    useEffect(() => {
        forceUpdate();
    }, [selectedItems]);

    useEffect(() => {
        getMyProvince();
    },[])

    useEffect(() => {
        fetchData();
        setRefreshing(false);
    }, [petFav, petData]);

    useEffect(() => {
        fetchPet();
        fetchPetFav();
        setApplyPressed(false);
    }, [debounceValue, refreshing, favAttempt, applyPressed]);

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

    const petImages : PetImageMap = {
        Dog: require('../../../../assets/icon_Dog.jpg'),
        Cat: require('../../../../assets/icon_Cat.jpg'),
        // Rabbit: require('../../../../assets/icon_Rabbit.jpg'),
    };

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
    }

    const onPressFav = async (petId : string) => {
        try {
            const body = {"PetId": petId};
            const res = await post(BackendApiUri.postPetFav, body);
            if(res.status === 200) {
                setMergedData(prev => {
                    return prev.map(pet => {
                        if(pet.Id === petId) {
                            return {...pet, isFav: !pet.isFav};
                        }
                        return pet;
                    })
                })
            }
        } catch(e) {
            console.error(e)
        }
    }

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
                            snapPoints={['90%']}
                            backdropComponent={(props) => (
                                <BottomSheetBackdrop
                                    {...props}
                                    disappearsOnIndex={-1}
                                    appearsOnIndex={0}
                                    pressBehavior="close"
                                />
                            )}
                            style={styles.bottomSheetModal}
                            >
                            <BottomSheetView style={{flex :1}}>
                                <View style={{flex: 1}}>

                                    <View className='mx-5'>
                                        <Text className='text-xl font-bold'>Filter</Text>
                                        <View className="mx-2">
                                            <Text className='text-xl font-bold mt-6'>Pet</Text>
                                            <View className='flex flex-row flex-wrap mt-1'>
                                                <FlashList
                                                    key={selectedItems.join('-')} // Key based on selectedItems
                                                    estimatedItemSize={600}
                                                    data={dataJenisHewan}
                                                    showsHorizontalScrollIndicator={false}
                                                    horizontal={true}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            key={item.key}
                                                            activeOpacity={1}
                                                            className="mx-2"
                                                            onPress={() => {
                                                                // Toggle selection of the item
                                                                setSelectedItems(prevState => {
                                                                    if (prevState.includes(item.value)) {
                                                                        return prevState.filter(val => val !== item.value);
                                                                    } else {
                                                                        return [...prevState, item.value];
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <View className="flex items-center">
                                                                <View>
                                                                    <Image
                                                                        source={petImages[item.value]}
                                                                        style={{ width: 85, height: 85, borderRadius: 30 }}
                                                                    />
                                                                    {selectedItems.includes(item.value) && (
                                                                        <View className="absolute right-0 -bottom-1 bg-white rounded-3xl overflow-hidden">
                                                                            <FontAwesome6 name='circle-check' solid size={27} color='#5BBCFF'/>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                                <Text className="text-center">{item.value}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        </View>
                                        
                                        <Text className='text-xl font-bold mt-6'>Shelter</Text>
                                        <View className="mx-2">
                                            <Text className='text-xl font-bold mt-3'>Name</Text>
                                            <TextInput
                                                placeholder="Shelter Name"
                                                style={{ backgroundColor: "transparent", marginLeft: 5, borderRadius: 10 }}
                                                underlineColor="#488DF4"
                                                underlineStyle={{ borderWidth: 1, borderColor: "#488DF4", borderRadius: 10 }}
                                                mode="flat"
                                                onChangeText={setShelterName}
                                                value={shelterName}
                                            />
                                        </View>
                                        <View className="mx-2">
                                            <View className="flex flex-row items-center justify-between my-2">
                                                <Text className='text-xl font-bold my-2'>Location</Text>
                                                <TouchableOpacity className='px-2 rounded-2xl my-2' 
                                                onPress={() => {
                                                    setFilterLocation({label: "", value: ""})
                                                    setShelterName("")
                                                    setSelectedItems([])
                                                }}
                                                >
                                                    <Text className='text-[#4689FD] text-lg font-bold'>Reset</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Dropdown
                                                style={{borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10}}
                                                containerStyle={{borderWidth: 10}}
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
                                                value={filterLocation?.value}
                                                onChange={item => {
                                                    setFilterLocation(item);
                                                }}
                                                renderItem={renderItem}
                                            />
                                        </View>
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

                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large"/>
                    </View>
                    ) : (
                        <>
                            {mergedData !== null  && mergedData.length > 0 ? (
                                <View style={{ flex: 1 }}>
                                    <FlashList
                                        refreshControl={
                                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                                        }
                                        estimatedItemSize={50}
                                        data={mergedData || []}
                                        numColumns={2}
                                        keyExtractor={item => item.Id.toString()}
                                        renderItem={({ item: pet }) => (
                                            <View style={{ flex: 1, marginBottom: 35 }}>
                                                <TouchableOpacity className="mx-2 justify-center" 
                                                    activeOpacity={1} 
                                                    onPress={() => navigation.navigate("PetDetailScreen", {petId : pet.Id})}
                                                >
                                                <Image
                                                    // source={{ uri: `data:image/*;base64,${pet.ImageBase64}` }}
                                                    source={ pet.ImageBase64 == null ? require("../../../../assets/default_paw2.jpg") : { uri: `data:image/*;base64,${pet.ImageBase64}` } }
                                                    className="w-full h-80 rounded-3xl"
                                                    resizeMode="cover"
                                                    />
                                                    <TouchableHighlight
                                                        style={{
                                                            position: 'absolute',
                                                            top: 7,
                                                            right: 7,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.65)',
                                                            padding: 8,
                                                            borderRadius: 999
                                                        }}
                                                        underlayColor="transparent"
                                                    >
                                                        <TouchableOpacity onPress={() => onPressFav(pet.Id)}>
                                                            {
                                                                pet.isFav ? (
                                                                    <FontAwesome
                                                                        name='heart'
                                                                        size={19}
                                                                        style={{color: '#FF0000'}}
                                                                    />
                                                                ) : (
                                                                    <FontAwesome
                                                                        name='heart-o'
                                                                        size={19}
                                                                        style={{color: '#4689FD'}}
                                                                    />
                                                                )
                                                            }
                                                        </TouchableOpacity>
                                                    </TouchableHighlight>

                                                    <View style={{ position: 'absolute', top: 230, left: 0, right: 0, bottom: 0 }}>
                                                        <View style={{ marginTop: 5, backgroundColor: "#FFFDFF", paddingHorizontal: 10, paddingVertical: 15, borderRadius: 15 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{truncateText(pet.PetName, 11)}</Text>
                                                                {pet.PetGender === "Male" ? (
                                                                    <FontAwesome6 name='mars' size={22} color='#4689FD' />
                                                                ) : (
                                                                    <FontAwesome6 name='venus' size={22} color='#FF6EC7' />
                                                                )}
                                                            </View>
                                                            <View className="flex-row">
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                                    <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{pet.ShelterLocation}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </View>
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
                    )
                }
            </BottomSheetModalProvider>
        </>
    );
}

const styles = StyleSheet.create({
    bottomSheetModal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
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
})