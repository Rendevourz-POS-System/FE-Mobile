import React, { FC, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, TouchableHighlight } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PetData } from '../../../../interface/IPetList';
import { get } from '../../../../functions/Fetch';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { FlashList } from '@shopify/flash-list';
import { NoHeaderNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';

export const HewanAdopsiScreen: FC<NoHeaderNavigationStackScreenProps<'HewanAdopsiScreen'>> = ({ navigation, route }: any) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [petData, setPetData] = useState<PetData[]>([]);
    
    const fetchPetData = async () => {
        try{
            const responsePet = await get(`${BackendApiUri.getPetList}/?shelter_id=${route.params.shelterId}&page=1&page_size=200`)
            if(responsePet && responsePet.status === 200) {
                setPetData(responsePet.data);
            }
        } catch(e) {
            throw Error;
        } 
    };

    useEffect(() => {
        fetchPetData();
    }, [route.params.shelterId])

    const handlePressFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-5 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Hewan Adopsi</Text>
            </View>

            <ScrollView>
                {petData &&
                    <View style={{ flex: 1, padding: 10 }}>
                    <FlashList
                        estimatedItemSize={25}
                        data={petData || []}
                        numColumns={1}
                        keyExtractor={item => item.Id.toString()}
                        renderItem={({ item: pet }) => (
                            <View style={{ flex: 1, marginBottom: 35, marginTop: 20 }}>
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
                }
            </ScrollView>
        </SafeAreaProvider>
    );
}
