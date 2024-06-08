import React, { FC, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, Linking, ImageBackground, TouchableHighlight } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { get, post } from '../../../../functions/Fetch';
import { PetType } from '../../../../interface/IPetType';
import { getIconName } from '../../../../functions/GetPetIconName';
import { UserBottomTabCompositeNavigationProps, UserNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';
import { UserBottomTabParams } from '../../../BottomTabs/UserBottomTabParams';
interface ShelterData {
    Id: string,
    UserId: string,
    ShelterName: string,
    ShelterLocationName: string,
    ShelterCapacity: number,
    ShelterAddress : string,
    ShelterContactNumber: string,
    ShelterDescription: string,
    TotalPet: number,
    BankAccountNumber: string,
    PetTypeAccepted : [],
    ImageBase64 : string[],
    Pin: string,
    ShelterVertified: boolean,
    CreatedAt: Date
}
interface ShelterProps {
    Message: string,
    Data: ShelterData
}
export const ShelterDetailScreen: FC<{}> = ({ navigation, route }: any) => {
    const [isFavorite, setIsFavorite] = useState<Boolean>();
    const [favAttempt, setFavAttempt] = useState<number>(0);
    const [data, setData] = useState<ShelterProps>({
        Message: "",
        Data: {
            Id: "",
            UserId: "",
            ShelterName: "",
            ShelterLocationName: "",
            ShelterCapacity: 0,
            ShelterContactNumber: "",
            ShelterDescription: "",
            ShelterAddress : "",
            TotalPet: 0,
            BankAccountNumber: "",
            PetTypeAccepted: [],
            ImageBase64: [],
            Pin: "",
            ShelterVertified: false,
            CreatedAt: new Date(),
        },
    });

    const detailData = async () => {
        try {
            const shelterId = route.params.shelterId;
            const response = await get(`${BackendApiUri.getShelterDetail}/${shelterId}`);
            if (response.status === 200) {
                setData({
                    Message: response.data.Message,
                    Data: {
                        Id: response.data.Data.Id,
                        UserId: response.data.Data.UserId,
                        ShelterName: response.data.Data.ShelterName,
                        ShelterLocationName: response.data.Data.ShelterLocationNName,
                        ShelterAddress : response.data.Data.ShelterAddress,
                        ShelterCapacity: response.data.Data.ShelterCapacity,
                        ShelterContactNumber: response.data.Data.ShelterContactNumber,
                        ShelterDescription: response.data.Data.ShelterDescription,
                        TotalPet: response.data.Data.TotalPet,
                        BankAccountNumber: response.data.Data.BankAccountNumber,
                        PetTypeAccepted : response.data.Data.PetTypeAccepted,
                        Pin: response.data.Data.Pin,
                        ShelterVertified: response.data.Data.ShelterVertified,
                        ImageBase64 : response.data.Data.ImageBase64 || [],
                        CreatedAt: response.data.Data.CreatedAt
                    }
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const shelterFavData = async () => {
        try {
            const res = await get(`${BackendApiUri.getShelterFav}`);
            if(res && res.status === 200) {
                const detail = await res.data.find((shelter : ShelterData) => shelter.Id === data.Data.Id);
                if(detail != null) {
                    setIsFavorite(true);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const fetchPetType = async () => {
        try {
            const res = await get(BackendApiUri.getPetTypes);
            setPetTypes(res.data)
        } catch(e) {
            console.error(e)
        }
    }

    useEffect(() => {
        detailData();
    }, [route.params.shelterId]);

    useEffect(() => {
        shelterFavData();
        fetchPetType();
    }, [data.Data.Id]);

    const handlePressFavorite = async (shelterId : string) => {
        try {
            const body = { "ShelterId": shelterId }; // Body as an array containing an object
            const res = await post(BackendApiUri.postShelterFav, body);
            if(res && res.status === 200) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.error('Error:', error); // Handle error
        } finally {
            setFavAttempt(prev => prev + 1);
        }
    };

    const handleWhatsApp = (phoneNumber: string) => {
        const message = 'Halo saya ingin bertanya mengenai shelter anda.';
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`);
    }

    return (
        <SafeAreaProvider className='bg-white'>
            <View style={[styles.nextIcon, { position: 'absolute', left: 20, top: 45, zIndex: 1 }]}>
                {/* DONT REMOVE THIS COMMENT
                Passing refFav to HomeScreen to trigger refresh if not the list shelter not updated */}
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.navigate('ShelterListScreen', { refFav: favAttempt } )} />
            </View>
            <ScrollView>
                {data.Data.ImageBase64 && data.Data.ImageBase64.length > 0 ? (
                    <ImageBackground source={{ uri: `data:image/*;base64,${data.Data.ImageBase64[0]}` }} style={{ width: '100%', height: 350 }} />
                ) : (
                    <ImageBackground source={require('../../../../assets/animal-shelter.png')} style={{ width: '100%', height: 350 }} />
                )}
                <View className='pt-8 px-6 bottom-6 bg-white rounded-t-3xl border border-slate-300 border-b-0'>
                    <View className='flex flex-row justify-between'>
                        <Text className='text-3xl font-bold'>{data.Data.ShelterName}</Text>
                        <View className='flex flex-row items-center'>
                            <FontAwesome name="whatsapp" size={28} color="green" style={{ marginRight: 15 }} onPress={() => handleWhatsApp(data.Data.ShelterContactNumber)} />
                            <TouchableHighlight
                                onPress={() => handlePressFavorite(data.Data.Id)}
                                underlayColor="transparent"
                                >
                                <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} style={{ color: isFavorite ? '#FF0000' : '#4689FD' }}  />
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View className='mt-2 flex flex-row items-center'>
                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' style={{ marginLeft: 2 }} />
                        <Text className='text-base ml-2 text-[#8A8A8A]'>Jakarta Barat</Text>
                    </View>

                    <View className="flex flex-row justify-between items-center mt-4">
                        <View className="flex-1 border-2 border-gray-300 px-4 py-5 mx-1 rounded-xl items-center" style={{height: 75}}>
                            <Text className="text-gray-500 text-center">Total Hewan</Text>
                            <Text className="text-black font-bold">{data.Data.TotalPet}</Text>
                        </View>
                        <View className="flex-1 border-2 border-gray-300 px-4 py-3 mx-1 text-center rounded-xl items-center" style={{height: 75}}>
                            <Text className="text-gray-500 text-center">Adopsi Available</Text>
                            <Text className="text-black font-bold">{data.Data.ShelterCapacity}</Text>
                        </View>
                        <View className="flex-1 border-2 border-gray-300 px-4 py-[4] mx-1 text-center rounded-xl items-center" style={{height: 75}}>
                            <Text className="text-gray-500 text-center">Menerima Hewan</Text>
                            <View className="flex flex-row justify-center items-center mt-1">
                                {data.Data.PetTypeAccepted.map((item) => {
                                    const matchingPet = petTypes.find((pet) => pet.Id === item);
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

                    <Text className='mt-8 text-xl font-bold'>Tentang Kami</Text>
                    <Text className='mt-2 text-base ml-1 text-[#8A8A8A]'>{data.Data.ShelterDescription}</Text>
                </View>
                <View className='my-3'>
                    <View className='flex-row justify-around'>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => navigation.navigate("HewanAdopsiScreen", {shelterId: route.params.shelterId})}>
                            <MaterialIcons name="pets" size={24} color="white" />
                            <Text style={styles.fontButton} className='ml-3 text-s text-center'>Adoption Pet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => navigation.navigate("SurrenderFormScreen")}>
                            <FontAwesome6 name="house-medical-circle-exclamation" size={24} color="white" />
                            <Text style={styles.fontButton} className='ml-3 text-s text-center'>Surrender Pet</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className='mt-3 flex-row justify-around'>
                        <TouchableOpacity disabled={data.Data.BankAccountNumber === ""} style={styles.buttonBox} onPress={() => navigation.navigate("DonateScreen", {bankNumber : data.Data.BankAccountNumber})}>
                            <FontAwesome6 name="hand-holding-heart" size={24} color="white" />
                            <Text style={styles.fontButton} className='ml-3 text-s text-center'>Donation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => navigation.navigate("RescueFormScreen")}>
                            <MaterialIcons name="warning" size={24} color="white" />
                            <Text style={styles.fontButton} className='ml-3 text-s text-center'>Rescue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nextIcon: {
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        padding: 5
    },
    fontButton: {
        color: 'white'
    },
    buttonBox: {
        backgroundColor: "#4689FD",
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: 180,
        borderRadius: 10
    }
});
