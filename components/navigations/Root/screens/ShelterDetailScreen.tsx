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
            if (response.status === 200) {
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
                <View className='pt-8 px-6 bottom-6 bg-white rounded-t-3xl'>
                    <View className='flex flex-row justify-between'>
                        <Text className='text-3xl font-bold'>{data.Data.ShelterName}</Text>
                        <View className='flex flex-row items-center'>
                            <FontAwesome name="whatsapp" size={28} color="green" style={{ marginRight: 15 }} onPress={() => handleWhatsApp(data.Data.ShelterContactNumber)} />
                            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color="#4689FD" onPress={handlePressFavorite} />
                        </View>
                    </View>

                    <View className='mt-2 flex flex-row items-center'>
                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' style={{ marginLeft: 2 }} />
                        <Text className='text-base ml-2 text-[#8A8A8A]'>Jakarta Barat</Text>
                    </View>

                    <View className='flex flex-row justify-center items-center gap-5 mt-1'>
                        <View className='border-2 px-6 py-3 text-center flex justify-center items-center border-gray-400 rounded-xl'>
                            <Text className='text-gray-500'>Total Hewan</Text>
                            <Text className='text-black font-bold'>{data.Data.TotalPet}</Text>
                        </View>
                        <View className='border-2 px-6 py-3 text-center flex justify-center items-center border-gray-400 rounded-xl'>
                            <Text className='text-gray-500'>Hewan Adopsi Available</Text>
                            <Text className='text-black font-bold'>{data.Data.ShelterCapacity}</Text>
                        </View>
                        <View className='border-2 px-6 py-2 text-center flex justify-center items-center border-gray-400 rounded-xl'>
                            <Text className='text-gray-500'>Menerima Hewan</Text>
                            <View className='flex flex-row justify-center items-center'>
                                <FontAwesome6 name='cat' size={21} color='black' style={{ marginRight: 5 }} />
                                <FontAwesome6 name='dog' size={21} color='black' style={{ marginRight: 5 }} />
                                <MaterialCommunityIcons name='rabbit' size={26} color='black' />
                            </View>
                        </View>
                    </View>

                    <Text className='mt-8 text-xl font-bold'>Tentang Kami</Text>
                    <Text className='mt-2 text-base ml-1 text-[#8A8A8A]'>{data.Data.ShelterDescription}</Text>
                    <Text className='mt-2 text-base ml-1 text-[#8A8A8A]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus molestiae repudiandae nemo voluptate ipsam nobis. Numquam quae porro fugiat odit magni aliquam repudiandae quaerat quos nam, delectus sint consequatur adipisci facilis tenetur tempore repellendus quod voluptas assumenda? Accusamus quasi nostrum quidem, aut repudiandae mollitia, maiores culpa, fugiat possimus nihil earum itaque asperiores neque. Quos hic quasi enim? Molestias non possimus est nulla, dolore quas libero molestiae recusandae eius labore similique officia, autem fugit asperiores dignissimos quos porro veniam tempora magni. Cumque, assumenda labore. Quia, maxime. Iure commodi pariatur sunt magni iusto dolore quisquam obcaecati nihil officiis alias deserunt, vitae quos accusamus natus consectetur deleniti sint. Voluptatum, magni alias esse vero atque praesentium? Possimus iure facere tenetur distinctio accusantium, illum aut unde blanditiis ducimus fugit soluta nostrum provident quam quidem, voluptatum porro repudiandae dolores nam, incidunt quibusdam eum culpa iusto consequuntur enim. Dolore officiis architecto ducimus? Libero blanditiis sint adipisci tempora culpa quam, amet iusto quis nam quisquam dolore laudantium dicta esse. Fugiat deserunt id quas itaque facere! Nulla voluptatum nihil iste dolorum? Magni maiores aut tempore illo consequuntur consequatur reprehenderit excepturi voluptates dolorem? Ullam architecto odio voluptatem consequatur, inventore repudiandae modi recusandae at corrupti debitis repellendus esse, voluptatum cum ipsum.</Text>
                </View>
                <View className='my-3'>
                    <View className='flex-row justify-around'>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => navigation.navigate("HewanAdopsiScreen")}>
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
    buttonBox: {
        backgroundColor: "#4689FD",
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: 180,
        borderRadius: 10
    }
});
