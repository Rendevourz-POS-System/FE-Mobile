import React, { FC } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopNavigation from '../../../TopNavigation';
import HomeCarousel from '../../../HomeCarousel';
import { Input, Text } from 'react-native-elements';
import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootBottomTabCompositeNavigationProp } from '../../CompositeNavigationProps';

export const HomeScreen: FC<{}> = () => {
    const navigation = useNavigation<RootBottomTabCompositeNavigationProp<'Home'>>();
    return (
        <SafeAreaProvider className='flex-1 m-3'>
            <ScrollView>
                <TopNavigation />
                <HomeCarousel />
                <View className='mx-1 mt-4 '>
                    <Text className='text-xl font-bold'>Find a Pet or Shelter</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Input
                            placeholder='Search'
                            leftIcon={{ type: 'font-awesome', name: 'search' }}
                            inputContainerStyle={{ marginTop: 10, borderWidth: 1, borderRadius: 22, borderColor: 'grey', width: '85%' }}
                            leftIconContainerStyle={{ marginLeft: 10 }}
                        />
                        <MaterialCommunityIcons name='tune-variant' size={24} color='black'
                            style={{ marginLeft: -68, marginTop: -15, borderWidth: 1, borderRadius: 22, padding: 14 }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("ShelterDetailScreen")}>
                    <View style={{ overflow: 'hidden' }}>
                        <Image source={require('../../../../assets/image.png')} style={{ width: '100%', height: 300, marginTop: 10 }} />
                        <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                            <View className='border-t-2 rounded-t-3xl mt-5' style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text className='text-xl font-bold'>Shelter Hewan Jakarta</Text>
                                    <FontAwesome name='heart-o' size={30} color='blue' style={{ marginEnd: 10 }} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <FontAwesome6 name='location-dot' size={24} color='blue' style={{ marginEnd: 5 }} />
                                    <Text className='text-base font-light'>Jl. Kebon Jeruk Raya No. 1, Jakarta Barat</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                        <FontAwesome6 name='cat' size={24} color='black' style={{ marginEnd: 5 }} />
                                        <FontAwesome6 name='dog' size={24} color='black' style={{ marginEnd: 5 }} />
                                        <MaterialCommunityIcons name='rabbit' size={24} color='black' style={{ marginEnd: 5 }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ overflow: 'hidden' }} className='mt-3'>
                    <Image source={require('../../../../assets/image.png')} style={{ width: '100%', height: 300, marginTop: 10 }} />
                    <View style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 0 }}>
                        <View className='border-t-2 rounded-t-3xl mt-5' style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text className='text-xl font-bold'>Shelter Hewan Jakarta</Text>
                                <FontAwesome name='heart-o' size={30} color='blue' style={{ marginEnd: 10 }} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <FontAwesome6 name='location-dot' size={24} color='blue' style={{ marginEnd: 5 }} />
                                <Text className='text-base font-light'>Jl. Kebon Jeruk Raya No. 1, Jakarta Barat</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <FontAwesome6 name='cat' size={24} color='black' style={{ marginEnd: 5 }} />
                                    <FontAwesome6 name='dog' size={24} color='black' style={{ marginEnd: 5 }} />
                                    <MaterialCommunityIcons name='rabbit' size={24} color='black' style={{ marginEnd: 5 }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}
