import React, { FC, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator, TouchableHighlight } from 'react-native';
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

    const fetchData = async () => {
        try {
            const response = await get(`${BackendApiUri.getShelterFav}`);
            if (response && response.status === 200) {
                setShelterData(response.data);
            }
        } catch (e) {
            throw Error;
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
            throw Error;
        } finally {
            setIsLoading(false);
        }
    };

    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const fetchPetType = async () => {
        try {
            const res = await get(BackendApiUri.getPetTypes);
            setPetTypes(res.data)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchData();
        fetchPetData();
        fetchPetType();
    }, []);

    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-5 mb-5 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Favorite</Text>
            </View>
            <ScrollView className='p-5' contentContainerStyle={{width: '100%', height: '100%'}}>
                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large" />
                    </View>
                ) : (
                    <View className='flex-1'>
                        {shelterData && shelterData.length > 0 && (
                            <FlashList
                                estimatedItemSize={50}
                                data={shelterData || []}
                                renderItem={({ item: shelter }) => (
                                    <TouchableOpacity
                                        style={{ overflow: 'hidden' }}
                                        onPress={() => navigation.navigate("ShelterDetailScreen", { shelterId: shelter.Id })}
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
                                        <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                                            <View style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, marginVertical: 10, borderRadius: 15 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{shelter.ShelterName}</Text>
                                                    <FontAwesome name='heart' size={24} color="#FF0000" />
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
                        )}
                        {petDatas && petDatas.length > 0 && (
                            <FlashList
                                estimatedItemSize={50}
                                data={petDatas || []}
                                numColumns={1}
                                keyExtractor={item => item.Id.toString()}
                                renderItem={({ item: pet }) => (
                                    <View style={{ flex: 1, marginBottom: 35 }}>
                                        <TouchableOpacity className="mx-2 justify-center"
                                            activeOpacity={1}
                                            onPress={() => navigation.navigate("PetDetailScreen", { petId: pet.Id })}
                                        >
                                            <Image
                                                source={pet.ImageBase64 == null ? require("../../../../assets/default_paw2.jpg") : { uri: `data:image/*;base64,${pet.ImageBase64}` }}
                                                className="w-full h-80 rounded-3xl"
                                                resizeMode="cover"
                                            />
                                            <View style={{ position: 'absolute', top: 7, right: 7, backgroundColor: 'rgba(255, 255, 255, 0.65)', padding: 8, borderRadius: 999 }}>
                                                <FontAwesome name='heart' size={19} style={{ color: '#FF0000' }} />
                                            </View>
                                            <View style={{ position: 'absolute', top: 235, left: 0, right: 0, bottom: 0 }}>
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
                        )}
                    </View>
                )} 

                {isLoading && (shelterData.length === 0 && petDatas.length === 0) && (
                    <View className='flex flex-1 justify-center items-center'>
                        <Text className='text-center'>Sorry, data not found</Text>
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
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        bottom: 15
    },
    nextIcon: {
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        padding: 5
    },
    fontButton: {
        color: 'white'
    },
    donasiButton: {
        backgroundColor: "#4689FD",
        padding: 20,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        marginRight: 5,
        width: 90,
        height: 60
    },
    adopsiButton: {
        backgroundColor: "#4689FD",
        paddingVertical: 20,
        marginRight: 5,
        width: 90,
        height: 60
    },
    laporButton: {
        backgroundColor: "#4689FD",
        padding: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        width: 90,
        height: 60
    }
});
