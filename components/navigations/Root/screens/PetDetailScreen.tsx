import React, { FC, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, ImageBackground, TouchableHighlight } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';
import { PetData } from '../../../../interface/IPetList';
import { get } from '../../../../functions/Fetch';
import { BackendApiUri } from '../../../../functions/BackendApiUri';

interface PetProps{
    Data: PetData
}

export const PetDetailScreen: FC<RootNavigationStackScreenProps<'PetDetailScreen'>> = ({ navigation, route }: any) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [data, setData] = useState<PetProps>();

    const fetchData = async() => {
        try{
            const response = await get(`${BackendApiUri.getPet}/${route.params.petId}`)
            setData(response.data)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        fetchData()
    }, [route.params.petId])

    return (
        <SafeAreaProvider className='bg-white'>
            <View style={[styles.nextIcon, { position: 'absolute', left: 20, top: 45, zIndex: 1 }]}>
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <ScrollView>
                <ImageBackground source={require('../../../../assets/image.png')} style={{ width: '100%', height: 350 }} />
                <View className='pt-8 px-6 bottom-6 bg-white rounded-t-3xl border border-slate-300 border-b-0'>
                    <View className='flex flex-row justify-between'>
                        <Text className='text-3xl font-bold'>{data?.Data.PetName}</Text>
                        <View className='flex flex-row items-center'>
                            <TouchableHighlight
                                // onPress={() => handlePressFavorite(data.Data.Id)}
                                underlayColor="transparent"
                                >
                                <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} style={{ color: isFavorite ? '#FF0000' : '#4689FD' }}  />
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View className='mt-2 flex flex-row items-center'>
                        <MaterialIcons name="pets" size={21} color="#4689FD" />
                        <Text className='text-base text-[#8A8A8A] ml-2'>{data?.Data.PetType}</Text>
                    </View>

                    <View className="flex flex-row justify-between items-center mt-4">
                        <View className="flex-1 border-2 border-gray-300 px-4 py-4 mx-1 rounded-xl items-center" style={{height: 75}}>
                            <Text className="text-gray-500 text-center">Vaksinasi</Text>
                            <Text className="text-black font-bold mt-1">{data?.Data.IsVaccinated == true ? "Sudah" : "Belum"}</Text>
                        </View>
                        <View className="flex-1 border-2 border-gray-300 px-4 py-4 mx-1 text-center rounded-xl items-center" style={{height: 75}}>
                            <Text className="text-gray-500 text-center">Umur</Text>
                            <Text className="text-black font-bold mt-1">{data?.Data.PetAge} tahun</Text>
                        </View>
                        <View className="flex-1 border-2 border-gray-300 px-4 py-4 mx-1 text-center rounded-xl items-center" style={{height: 75}}>
                            <Text className="text-gray-500 text-center">Gender</Text>
                            <Text className="text-black font-bold mt-1">{data?.Data.PetGender}</Text>
                        </View>
                    </View>

                    <Text className='mt-8 text-xl font-bold'>Deskripsi Hewan</Text>
                    <Text className='mt-2 text-base text-[#8A8A8A]'>{data?.Data.PetDescription}</Text>
                </View>
            </ScrollView>
            <View className='mt-8 flex flex-row justify-evenly absolute bottom-0 left-0 right-0 pb-5 px-5'>
                <TouchableOpacity style={styles.adopsiButton} onPress={() => navigation.navigate("AdoptionFormScreen")} className='w-4/5'>
                    <Text style={styles.fontButton} className='text-xl text-center'>Adopsi Sekarang</Text>
                </TouchableOpacity>
            </View>
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
    adopsiButton: {
        backgroundColor: "#4689FD",
        paddingVertical: 20,
        height: 70,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Properti bayangan untuk Android
        elevation: 5,
    },
});
