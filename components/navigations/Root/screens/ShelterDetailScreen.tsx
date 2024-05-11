import React, { FC, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, Linking, ImageBackground } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { get } from '../../../../functions/Fetch';
interface ShelterData {
    Id: string,
    UserId: string,
    ShelterName: string,
    ShelterLocation: string,
    ShelterCapacity: number,
    ShelterContactNumber: string,
    ShelterDescription: string,
    TotalPet: number,
    BankAccountNumber: string,
    Pin: string,
    ShelterVertified: boolean,
    CreatedAt: Date
}
interface ShelterProps {
    Message: string,
    Data: ShelterData
}
export const ShelterDetailScreen: FC<RootNavigationStackScreenProps<'ShelterDetailScreen'>> = ({ navigation, route }: any) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [data, setData] = useState<ShelterProps>({
        Message: "",
        Data: {
            Id: "",
            UserId: "",
            ShelterName: "",
            ShelterLocation: "",
            ShelterCapacity: 0,
            ShelterContactNumber: "",
            ShelterDescription: "",
            TotalPet: 0,
            BankAccountNumber: "",
            Pin: "",
            ShelterVertified: false,
            CreatedAt: new Date(),
        },
    });

    const detailData = async () => {
        try {
            const shelterId = route.params.shelterId;
            const response = await get(`${BackendApiUri.getShelterDetail}/${shelterId}`);
            if(response.status === 200) {
                setData({
                    Message: response.data.Message,
                    Data: {
                        Id: response.data.Data.Id,
                        UserId: response.data.Data.UserId,
                        ShelterName: response.data.Data.ShelterName,
                        ShelterLocation: response.data.Data.ShelterLocation,
                        ShelterCapacity: response.data.Data.ShelterCapacity,
                        ShelterContactNumber: response.data.Data.ShelterContactNumber,
                        ShelterDescription: response.data.Data.ShelterDescription,
                        TotalPet: response.data.Data.TotalPet,
                        BankAccountNumber: response.data.Data.BankAccountNumber,
                        Pin: response.data.Data.Pin,
                        ShelterVertified: response.data.Data.ShelterVertified,
                        CreatedAt: response.data.Data.CreatedAt
                    }
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        detailData();
    }, [route.params.shelterId]);

    const handlePressFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleWhatsApp = (phoneNumber: string) => {
        const message = 'Halo saya ingin bertanya mengenai shelter anda.';
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`);
    }

    return (
        <SafeAreaProvider className='bg-white'>
            <View style={[styles.nextIcon, { position: 'absolute', left: 20, top: 45, zIndex: 1 }]}>
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <ScrollView>
                <ImageBackground source={require('../../../../assets/image.png')} style={{ width: '100%', height: 350 }} />
                <View className='pt-4 px-3 bottom-6 bg-white rounded-t-3xl'>
                    <View className='flex flex-row justify-between'>
                        <Text className='text-xl font-bold'>{data.Data.ShelterName}</Text>
                        <View className='flex flex-row items-center'>
                            <FontAwesome name="whatsapp" size={28} color="green" style={{ marginRight: 15 }} onPress={() => handleWhatsApp(data.Data.ShelterContactNumber)} />
                            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color="#4689FD" onPress={handlePressFavorite} />
                        </View>
                    </View>

                    <View className='mt-5 flex flex-row items-center'>
                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' style={{ marginLeft: 2 }} />
                        <Text className='text-base ml-3 text-[#8A8A8A]'>{data.Data.ShelterLocation}</Text>
                    </View>

                    <View className='mt-5 flex flex-row items-center justify-between'>
                        <View className='flex flex-row items-center'>
                            <MaterialIcons name="pets" size={21} color="#4689FD" />
                            <Text className='text-base ml-2 text-[#8A8A8A]'>{data.Data.ShelterCapacity}</Text>
                        </View>
                        <View className='flex flex-row items-center'>
                            <FontAwesome6 name='cat' size={21} color='#8A8A8A' style={{ marginEnd: 5 }} />
                            <FontAwesome6 name='dog' size={21} color='#8A8A8A' style={{ marginEnd: 5 }} />
                            <MaterialCommunityIcons name='rabbit' size={26} color='#8A8A8A' />
                        </View>
                    </View>

                    <View className='mt-5 flex flex-row items-center'>
                        <FontAwesome5 name="calendar-alt" size={21} color="#4689FD" style={{ marginLeft: 3 }} />
                        <Text className='text-base ml-2 text-[#8A8A8A]'>{new Date(data.Data.CreatedAt).getFullYear()}</Text>
                    </View>

                    <Text className='mt-8 text-xl font-bold'>Tentang Kami</Text>
                    <Text className='mt-2 text-base ml-1 text-[#8A8A8A]'>{data.Data.ShelterDescription}</Text>
                    <Text className='mt-2 text-base ml-1 text-[#8A8A8A]'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestias deleniti laboriosam odit dolorum ex voluptatibus fugit impedit, velit expedita iure rem ad quasi molestiae nesciunt consequatur numquam eaque. Laudantium facilis, id dignissimos distinctio exercitationem dolore ullam quidem corrupti repudiandae soluta nisi suscipit eos odit omnis asperiores ut magnam eum voluptatum voluptates aspernatur voluptatem perferendis? Eaque non corporis obcaecati voluptatibus aspernatur sed, omnis quas error. Adipisci doloribus rerum iure illum! Laboriosam laborum eius officiis eum animi facere modi minima beatae quod inventore possimus, sequi architecto iure, voluptas sit accusamus sapiente corrupti earum repudiandae veniam. Maxime in eos iste eligendi, deleniti quidem!</Text>
                </View>
            </ScrollView>
            <View className='mt-8 flex flex-row justify-evenly absolute bottom-0 left-0 right-0 pb-5'>
                <TouchableOpacity style={styles.donasiButton} onPress={() => navigation.navigate("DonateScreen")}>
                    <Text style={styles.fontButton} className='text-xs text-center'>Donasi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adopsiButton} onPress={() => navigation.navigate("HewanAdopsiScreen")}>
                    <Text style={styles.fontButton} className='text-xs text-center'>Hewan Adopsi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adopsiButton} onPress={() => navigation.navigate("SurrenderFormScreen")}>
                    <Text style={styles.fontButton} className='text-xs text-center'>Surrender</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.laporButton} onPress={() => navigation.navigate("RescueFormScreen")}>
                    <Text style={styles.fontButton} className='text-xs text-center'>Rescue</Text>
                </TouchableOpacity>
            </View>
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
