import React, { FC, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { get } from '../../../../functions/Fetch';
import { ProfileRootBottomTabCompositeScreenProps } from '../../CompositeNavigationProps';
import { ShelterData } from '../../../../interface/IShelterList';
import { FlashList } from '@shopify/flash-list';

export const FavoriteScreen: FC<ProfileRootBottomTabCompositeScreenProps<'FavoriteScreen'>> = ({ navigation }: any) => {
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-14 mb-5 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Favorite</Text>
            </View>
            <ScrollView className='p-5'>
                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large" />
                    </View>
                ) : (
                    <>
                        {shelterData && shelterData.length > 0 ? (
                            <FlashList
                                estimatedItemSize={50}
                                data={shelterData || []}
                                renderItem={({ item: shelter }) => (
                                    <TouchableOpacity
                                        style={{ overflow: 'hidden' }}
                                        onPress={() => navigation.navigate("ShelterDetailScreen", { shelterId: shelter.Id })}
                                        activeOpacity={1}>
                                        <Image source={require('../../../../assets/image.png')} style={{ width: '100%', height: 290, marginBottom: 15, marginTop: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                                        <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                                            <View style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{shelter.ShelterName}</Text>
                                                    <FontAwesome name='heart' size={24} color="#4689FD" />
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                                    <Text style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 5 }}>{shelter.ShelterLocation}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                                        <FontAwesome6 name='cat' size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                                        <FontAwesome6 name='dog' size={24} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                                        <MaterialCommunityIcons name='rabbit' size={29} color='#8A8A8A' style={{ marginEnd: 5 }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <View className='flex flex-1 justify-center items-center'>
                                <Text className='text-center'>Sorry, data not found</Text>
                            </View>
                        )}
                    </>
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
