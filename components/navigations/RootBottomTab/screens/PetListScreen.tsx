import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet"
import { FlashList } from "@shopify/flash-list";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown";
import { Button } from "react-native-elements";
import { Searchbar, TextInput } from "react-native-paper";
import { PetData } from "../../../../interface/IPetList";
import { useDebounce } from "use-debounce";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get } from "../../../../functions/Fetch";
import { Location } from "../../../../interface/ILocation";
import { dataJenisHewan, dataProvinsi } from "../../../../constans/data";
import { ProfileProps } from "../../../../interface/TProfileProps";
import { NoHeaderProps } from "../../../../interface/TNoHeaderProps";

type PetImageMap = {
    [key: string]: any; // This allows indexing with strings
};

export const PetListScreen : FC<NoHeaderProps> = ({navigation, route} : any) => {
    const [filterLocation, setFilterLocation] = useState<string>();
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

    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const orderBy = "ascending";
    const sort = "";

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

    const fetchData = async () => {
        try{
            const responsePet = await get(`${BackendApiUri.getPetList}/?search=${search}&page=1&page_size=200&order_by=${orderBy}&sort=${sort}&locatio=${filterLocation}&shelter_name=${shelterName}`)
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
        forceUpdate();
    }, [selectedItems]);

    useEffect(() => {
        fetchData();
        setRefreshing(false);
    }, [debounceValue, refreshing, applyPressed]);

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
    const petImages : PetImageMap = {
        Dog: require('../../../../assets/icon_Dog.jpg'),
        Cat: require('../../../../assets/icon_Cat.jpg'),
        Rabbit: require('../../../../assets/icon_Rabbit.jpg'),
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

    const renderItem = (item : Location) => {
        return (
            <View className="p-4 flex-row justify-between items-center">
                <Text className="flex-1 text-base">{item.value}</Text>
            </View>
        );
    };

    const handleApplyPress = () => {
        setApplyPressed(true);
        bottomSheetModalRef.current?.dismiss();
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
                                                style={{ backgroundColor: "#F7F7F9", marginLeft: 5, borderRadius: 10 }}
                                                activeUnderlineColor="#488DF4"
                                                mode="flat"
                                                onChangeText={setShelterName}
                                                value={shelterName}
                                            />
                                        </View>
                                        <View className="mx-2">
                                            <Text className='text-xl font-bold mt-3'>Location</Text>
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
                        <View style={{ flex: 1 }}>
                            <FlashList
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                                }
                                estimatedItemSize={50}
                                data={petData || []}
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
                                                onPress={() => {
                                                    // Add your onPress logic here
                                                }}
                                            >
                                                <View className="rounded-full">
                                                    <FontAwesome name='heart' size={20} color="#FF0000" />
                                                </View>
                                            </TouchableHighlight>

                                            <View style={{ position: 'absolute', top: 230, left: 0, right: 0, bottom: 0 }}>
                                                <View style={{ marginTop: 5, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 15 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pet.PetName}</Text>
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