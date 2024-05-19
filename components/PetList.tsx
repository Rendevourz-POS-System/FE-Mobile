import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PetData } from "../interface/IPetList";
import { useDebounce } from "use-debounce";
import { get } from "../functions/Fetch";
import { BackendApiUri } from "../functions/BackendApiUri";
import { ActivityIndicator, Image, RefreshControl, StyleSheet, TouchableHighlight, View } from "react-native";
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
import { dataJenisHewan, dataProvinsi } from "../constans/data";
import { Button } from "react-native-elements";
import { Location } from "../interface/ILocation";
import { Dropdown } from "react-native-element-dropdown";


export const PetList = () => {
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
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
            const responsePet = await get(`${BackendApiUri.getPetList}/?search=${search}&page=1&page_size=200&order_by=${orderBy}&sort=${sort}`)
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

    const renderItem = (item : Location) => {
        return (
            <View className="p-4 flex-row justify-between items-center">
                <Text className="flex-1 text-base">{item.value}</Text>
            </View>
        );
    };

    return (
        <>
            <View className='p-5'>
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
                        snapPoints={['75%']}
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
                                    <Text className='text-xl font-bold mt-8'>Pet</Text>
                                    <View className='flex flex-row flex-wrap'>
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
                                                                source={require(`../assets/icon_${"Cat"}.jpg`)}
                                                                style={{ width: 80, height: 80, borderRadius: 30 }}
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

                                    <Text className='text-xl font-bold mt-8'>Shelter Location</Text>
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
                            <View className='items-center my-5'>
                                <Button
                                    title="Apply"
                                    accessibilityLabel='Apply this'
                                    containerStyle={{ width: '35%' }}
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
                                    <TouchableOpacity className="mx-2 justify-center" activeOpacity={1} onPress={() => navigation.navigate("PetDetailScreen", {petId : pet.Id})}>
                                    <Image
                                        source={{ uri: `data:image/*;base64,${pet.ImageBase64}` }}
                                        className="w-full h-80 rounded-3xl"
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
                                                    {pet.PetType === "Male" ? (
                                                            <FontAwesome6 name='venus' size={20} color='#FF6EC7' />
                                                        ) : (
                                                            <FontAwesome6 name='mars' size={20} color='#4689FD' />
                                                    )}
                                                </View>
                                                <View className="flex-row">
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                        <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>Jakarta Barat</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>

            )}
        </>
    )

    
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