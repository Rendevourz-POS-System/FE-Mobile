import React, { FC, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';

export const ShelterDetailScreen: FC<RootNavigationStackScreenProps<'ShelterDetailScreen'>> = ({ navigation, route }: any) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handlePressFavorite = () => {
        setIsFavorite(!isFavorite);
    };


    return (
        <SafeAreaProvider className='flex-1'>
            <ScrollView>
                <View className="mt-1" style={styles.container}>
                    <Image source={require('../../../../assets/image.png')} style={{ width: '100%', height: 350 }} />
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={[styles.nextIcon, { position: 'absolute', left: 20, top: 45 }]} />
                </View>
                <View className='p-3'>
                    <View className='flex flex-row justify-between'>
                        <Text className='text-xl font-bold'>Shelter Hewan Jakarta</Text>
                        <View className='flex flex-row items-center'>
                            <FontAwesome name="whatsapp" size={28} color="green" style={{ marginRight: 15 }} />
                            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color="#4689FD" onPress={handlePressFavorite}/>
                        </View>
                    </View>

                    <View className='mt-5 flex flex-row items-center'>
                        <FontAwesome6 name='location-dot' size={20} color='#4689FD' style={{ marginLeft: 2 }} />
                        <Text className='text-base ml-3 text-[#8A8A8A]'>Jl. Kebon Jeruk Raya No. 1, Jakarta Barat</Text>
                    </View>

                    <View className='mt-5 flex flex-row items-center justify-between'>
                        <View className='flex flex-row items-center'>
                            <MaterialIcons name="pets" size={21} color="#4689FD" />
                            <Text className='text-base ml-2 text-[#8A8A8A]'>22</Text>
                        </View>
                        <View className='flex flex-row items-center'>
                            <FontAwesome6 name='cat' size={21} color='#8A8A8A' style={{ marginEnd: 5 }} />
                            <FontAwesome6 name='dog' size={21} color='#8A8A8A' style={{ marginEnd: 5 }} />
                            <MaterialCommunityIcons name='rabbit' size={26} color='#8A8A8A' />
                        </View>
                    </View>

                    <View className='mt-5 flex flex-row items-center'>
                        <FontAwesome5 name="calendar-alt" size={21} color="#4689FD" style={{ marginLeft: 3 }} />
                        <Text className='text-base ml-2 text-[#8A8A8A]'>2010</Text>
                    </View>

                    <Text className='mt-8 text-xl font-bold'>Tentang Kami</Text>
                    <Text className='mt-2 text-base ml-1 text-[#8A8A8A]'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>

                    <View className='mt-8 flex flex-row justify-evenly'>
                        <TouchableOpacity style={styles.donasiButton} onPress={() => navigation.navigate("DonateScreen")}>
                            <Text style={styles.fontButton} className='text-xs text-center'>Donasi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.adopsiButton} onPress={() => navigation.navigate("HewanAdopsiScreen")}>
                            <Text style={styles.fontButton} className='text-xs text-center'>Hewan Adopsi</Text>
                        </TouchableOpacity>
                        <View style={styles.laporButton}>
                            <Text style={styles.fontButton} className='text-xs text-center'>Rescue</Text>
                        </View>
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
        width: 120,
        height: 60
    },
    adopsiButton: {
        backgroundColor: "#4689FD",
        paddingVertical: 20,
        marginRight: 5,
        width: 120,
        height: 60
    },
    laporButton: {
        backgroundColor: "#4689FD",
        padding: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        width: 120,
        height: 60
    }
});
