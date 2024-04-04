import React, { FC, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';

export const HewanAdopsiScreen: FC<RootNavigationStackScreenProps<'HewanAdopsiScreen'>> = ({ navigation }: any) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handlePressFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <SafeAreaProvider className='flex-1'>
            <ScrollView>
                <View className="mt-20 flex-row items-center justify-center">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                    <Text className="text-xl">Hewan Adopsi</Text>
                </View>

                <View className='mt-5 p-5'>
                    <TouchableOpacity style={{ overflow: 'hidden', marginBottom: 10 }}>
                        <Image source={require('../../../../assets/image.png')} style={styles.imageContainer} />
                        <View style={styles.infoContainer}>
                            <View className='rounded-t-3xl mt-5' style={{ marginTop: 10, backgroundColor: "#FFFDFF", paddingHorizontal: 20, paddingVertical: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text className='text-xl font-bold'>Doggy</Text>
                                    <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color="#4689FD" onPress={handlePressFavorite} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <FontAwesome6 name='location-dot' size={20} color='#4689FD' />
                                    <Text className='text-s font-light ml-2'>Jl. Kebon Jeruk Raya No. 1, Jakarta Barat</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <Ionicons name="male" size={20} color="#4689FD" />
                                        <Text className='text-s font-light ml-2'>Male</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <FontAwesome5 name="calendar-alt" size={18} color="#4689FD" />
                                        <Text className='text-s font-light ml-2'>25 years old</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
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
    fontButton: {
        color: 'white'
    },
    imageContainer: {
        width: '100%',
        height: 280,
        marginTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    infoContainer: {
        position: 'absolute',
        top: 170,
        left: 0,
        right: 0,
        bottom: 0
    }
});
