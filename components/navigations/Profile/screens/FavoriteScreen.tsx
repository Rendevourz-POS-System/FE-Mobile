import React, { FC, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { get } from '../../../../functions/Fetch';
import { ShelterData } from '../../../../interface/IShelterList';
import { FlashList } from '@shopify/flash-list';
import { PetType } from '../../../../interface/IPetType';
import { getIconName } from '../../../../functions/GetPetIconName';
import { ProfileNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';
import { PetData } from '../../../../interface/IPetList';

export const FavoriteScreen: FC<ProfileNavigationStackScreenProps<'FavoriteScreen'>> = ({ navigation }: any) => {
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
    const [petDatas, setPetDatas] = useState<PetData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);

    const fetchData = async () => {
        try {
            const shelterResponse = await get(`${BackendApiUri.getShelterFav}`);
            if (shelterResponse.data != null && shelterResponse.status === 200) {
                setShelterData(shelterResponse.data);
            } else {
                setShelterData([]);
            }

            const petResponse = await get(`${BackendApiUri.getPetFav}`);
            if (petResponse.data != null && petResponse.status === 200) {
                setPetDatas(petResponse.data);
            } else {
                setPetDatas([]);
            }
        } catch (e) {
            console.error('Error fetching data:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPetType = async () => {
        try {
            const res = await get(BackendApiUri.getPetTypes);
            setPetTypes(res.data);
        } catch (e) {
            console.error('Error fetching pet types:', e);
        }
    };

    useEffect(() => {
        fetchData();
        fetchPetType();
    }, []);

    const combinedData = [...shelterData, ...petDatas]; // Combine shelter and pet data into a single array

    const renderShelterItem = ({ item }: { item: ShelterData }) => (
        <TouchableOpacity 
            className='mb-10'
            style={styles.shelterItem} 
            onPress={() => navigation.navigate("ShelterDetailScreen", { shelterId: item.Id })}
            activeOpacity={1}
        >
            <View style={styles.shelterImageContainer}>
                <Image
                    source={item.ImageBase64 && item.ImageBase64.length > 0 ? { uri: `data:image/*;base64,${item.ImageBase64}` } : require('../../../../assets/animal-shelter.png')}
                    resizeMode='cover'
                    style={styles.shelterImage}
                />
            </View>
            <View style={styles.shelterInfoContainer}>
                <View style={styles.shelterInfo}>
                    <Text style={styles.shelterName}>{item.ShelterName}</Text>
                    <FontAwesome name='heart' size={24} color="#FF0000" />
                </View>
                <View style={styles.shelterLocation}>
                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                    <Text style={styles.shelterLocationText}>{item.ShelterLocationName}</Text>
                </View>
                {item.PetTypeAccepted && item.PetTypeAccepted.length > 0 && (
                    <View style={styles.petTypesContainer}>
                        {item.PetTypeAccepted.map((itemId) => {
                            const matchingPet = petTypes.find((pet) => pet.Id === itemId.toString());
                            if (matchingPet) {
                                const iconName = getIconName(matchingPet.Type);
                                if (iconName === 'rabbit') {
                                    return <MaterialCommunityIcons key={matchingPet.Id} name={iconName} size={29} color='#8A8A8A' />;
                                }
                                return <FontAwesome6 key={matchingPet.Id} name={iconName} size={24} color='#8A8A8A'/>;
                            }
                            return null;
                        })}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
    
    const renderPetItem = ({ item }: { item: PetData }) => (
        <TouchableOpacity
            className='my-10'
            style={styles.petItem}
            activeOpacity={1}
            onPress={() => navigation.navigate("PetDetailScreen", { petId: item.Id })}
        >
            <Image
                source={item.ImageBase64 && item.ImageBase64.length > 0 ? { uri: `data:image/*;base64,${item.ImageBase64}` } : require("../../../../assets/default_paw2.jpg")}
                style={styles.petImage}
                resizeMode="cover"
            />
            <View style={styles.petHeartIcon}>
                <FontAwesome name='heart' size={19} color='#FF0000' />
            </View>
            <View style={styles.petInfoContainer}>
                <View style={styles.petInfo}>
                    <Text style={styles.petName}>{item.PetName}</Text>
                    <FontAwesome6 name={item.PetGender === "Male" ? 'mars' : 'venus'} size={22} color={item.PetGender === "Male" ? '#4689FD' : '#FF6EC7'} />
                </View>
                <View style={styles.petLocation}>
                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                    <Text style={styles.petLocationText}>{item.ShelterLocation}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: ShelterData | PetData }) => {
        if ('ShelterName' in item) {
            return renderShelterItem({ item });
        } else {
            return renderPetItem({ item });
        }
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={styles.backIcon} />
                <Text style={styles.title}>Favorite</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="blue" size="large" />
                    </View>
                ) : combinedData.length > 0 ? (
                    <View className='w-full h-full'>
                        <FlashList
                            estimatedItemSize={300} // Adjust the estimated item size based on your content
                            data={shelterData}
                            renderItem={renderShelterItem}
                        />
                        <FlashList
                            estimatedItemSize={300} // Adjust the estimated item size based on your content
                            data={petDatas}
                            renderItem={renderPetItem}
                        />
                    </View>

                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No favorite data found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    shelterItem: {
        backgroundColor: '#FFF', // Adjust background color as needed
        borderRadius: 20, // Adjust border radius as needed
    },
    shelterImageContainer: {
        width: '100%',
        height: 290,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    shelterImage: {
        width: '100%',
        height: '100%',
    },
    shelterInfoContainer: {
        backgroundColor: "#FFFDFF",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        marginTop: -20, // Adjust margin top as needed
    },
    shelterInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10, // Adjust margin bottom as needed
    },
    shelterName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    shelterLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shelterLocationText: {
        fontSize: 14,
        marginLeft: 5,
    },
    petTypesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
    },
    header: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        position: 'absolute',
        left: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    petItem: {
        marginBottom: 20,
    },
    petImage: {
        width: '100%',
        height: 320,
        borderRadius: 20,
    },
    petHeartIcon: {
        position: 'absolute',
        top: 7,
        right: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        padding: 8,
        borderRadius: 999,
    },
    petInfoContainer: {
        marginTop: 250, // Adjust this margin top based on your design
        backgroundColor: "#FFFDFF",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        position: 'absolute',
        width: '100%',
    },
    petInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    petLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    petLocationText: {
        fontSize: 14,
        marginLeft: 5,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
    },
});

export default FavoriteScreen;
