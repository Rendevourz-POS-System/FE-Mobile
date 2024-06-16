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
            const response = await get(`${BackendApiUri.getShelterFav}`);
            if (response && response.status === 200) {
                setShelterData(response.data);
            }
        } catch (e) {
            console.error('Error fetching shelter data:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPetData = async () => {
        try {
            const response = await get(`${BackendApiUri.getPetFav}`);
            if (response && response.status === 200) {
                setPetDatas(response.data);
            }
        } catch (e) {
            console.error('Error fetching pet data:', e);
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
        fetchPetData();
        fetchPetType();
    }, []);

    const hasData = shelterData.length > 0 || petDatas.length > 0;

    return (
        <SafeAreaProvider style={styles.container} className='mt-5'>
            <View style={styles.header}>
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={styles.backIcon} />
                <Text style={styles.title}>Favorite</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="blue" size="large" />
                    </View>
                ) : hasData ? (
                    <View style={styles.contentContainer}>
                        {shelterData.length > 0 && (
                            <FlashList
                                estimatedItemSize={50}
                                data={shelterData}
                                renderItem={({ item: shelter }) => (
                                    <TouchableOpacity
                                        style={styles.shelterItem}
                                        onPress={() => navigation.navigate("ShelterDetailScreen", { shelterId: shelter.Id })}
                                        activeOpacity={1}
                                    >
                                        <Image
                                            source={shelter.ImageBase64 ? { uri: `data:image/*;base64,${shelter.ImageBase64}` } : require('../../../../assets/animal-shelter.png')}
                                            resizeMode='contain'
                                            style={styles.shelterImage}
                                        />
                                        <View style={styles.shelterInfoContainer}>
                                            <View style={styles.shelterInfo}>
                                                <Text style={styles.shelterName}>{shelter.ShelterName}</Text>
                                                <FontAwesome name='heart' size={24} color="#FF0000" />
                                            </View>
                                            <View style={styles.shelterLocation}>
                                                <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                <Text style={styles.shelterLocationText}>{shelter.ShelterLocationName}</Text>
                                            </View>
                                            <View style={styles.petTypesContainer}>
                                                {shelter.PetTypeAccepted.map((itemId) => {
                                                    const matchingPet = petTypes.find((pet) => pet.Id === itemId.toString());
                                                    if (matchingPet) {
                                                        const iconName = getIconName(matchingPet.Type);
                                                        return iconName === 'rabbit' ? (
                                                            <MaterialCommunityIcons key={matchingPet.Id} name={iconName} size={29} color='#8A8A8A' style={styles.petIcon} />
                                                        ) : (
                                                            <FontAwesome6 key={matchingPet.Id} name={iconName} size={24} color='#8A8A8A' style={styles.petIcon} />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        {petDatas.length > 0 && (
                            <FlashList
                                estimatedItemSize={50}
                                data={petDatas}
                                keyExtractor={item => item.Id.toString()}
                                renderItem={({ item: pet }) => (
                                    <TouchableOpacity
                                        style={styles.petItem}
                                        activeOpacity={1}
                                        onPress={() => navigation.navigate("PetDetailScreen", { petId: pet.Id })}
                                    >
                                        <Image
                                            source={pet.ImageBase64 ? { uri: `data:image/*;base64,${pet.ImageBase64}` } : require("../../../../assets/default_paw2.jpg")}
                                            style={styles.petImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.petHeartIcon}>
                                            <FontAwesome name='heart' size={19} color='#FF0000' />
                                        </View>
                                        <View style={styles.petInfoContainer}>
                                            <View style={styles.petInfo}>
                                                <Text style={styles.petName}>{pet.PetName}</Text>
                                                <FontAwesome6 name={pet.PetGender === "Male" ? 'mars' : 'venus'} size={22} color={pet.PetGender === "Male" ? '#4689FD' : '#FF6EC7'} />
                                            </View>
                                            <View style={styles.petLocation}>
                                                <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                <Text style={styles.petLocationText}>{pet.ShelterLocation}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
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
        width: '100%',
        height: '100%',
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    shelterItem: {
        overflow: 'hidden',
    },
    shelterImage: {
        width: '100%',
        height: 290,
        marginBottom: 15,
        marginTop: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    shelterInfoContainer: {
        position: 'absolute',
        top: 170,
        left: 0,
        right: 0,
        bottom: 0,
    },
    shelterInfo: {
        marginTop: 10,
        backgroundColor: "#FFFDFF",
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shelterName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    shelterLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    shelterLocationText: {
        fontSize: 14,
        marginLeft: 5,
    },
    petTypesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    petIcon: {
        marginEnd: 5,
    },
    petItem: {
        flex: 1,
        marginBottom: 35,
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
        position: 'absolute',
        top: 235,
        left: 0,
        right: 0,
        bottom: 0,
        marginTop: 5,
        backgroundColor: "#FFFDFF",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
    },
    petInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    petName: {
        fontSize: 20,
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
        marginVertical: 20,
    },
});
