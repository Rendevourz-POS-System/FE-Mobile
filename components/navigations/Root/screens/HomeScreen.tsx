import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ShelterListCard } from './components/ShelterListCard';

const sheltersData = [
    { id: 1, name: 'Shelter 1', imageUrl: require('../../../../assets/image.png') },
    { id: 2, name: 'Shelter 2', imageUrl: require('../../../../assets/image.png') },
    { id: 3, name: 'Shelter 3', imageUrl: require('../../../../assets/image.png') },
    { id: 4, name: 'Shelter 4', imageUrl: require('../../../../assets/image.png') },
    { id: 5, name: 'Shelter 5', imageUrl: require('../../../../assets/image.png') },
    { id: 6, name: 'Shelter 6', imageUrl: require('../../../../assets/image.png') },
    { id: 7, name: 'Shelter 7', imageUrl: require('../../../../assets/image.png') },
    { id: 8, name: 'Shelter 8', imageUrl: require('../../../../assets/image.png') },
];

const HomeScreen = () => {

    const renderHistory = () => {
        return (
            <View>
                <View className='mt-10 flex-row flex items-center justify-between'>
                    <Text className='text-lg font-bold'>Recent History</Text>
                    <TouchableOpacity><Text>See All</Text></TouchableOpacity>
                </View>

                <View className='mt-3 flex-row items-center bg-blue-100 p-3 rounded-md'>
                    <AntDesign name="notification" size={20} color="black" />
                    <Text className='text-base ml-3'>Donate Rp. 50.000 to Shelter 1</Text>
                </View>
            </View>
        );
    }

    const renderShelter = () => {
        return (
            <View>
                <View className='mt-10 flex-row flex items-center justify-between'>
                    <Text className='text-lg font-bold'>Shelter List</Text>
                    <TouchableOpacity><Text>See All</Text></TouchableOpacity>
                </View>

                {sheltersData.map((shelter) => (
                    <View key={shelter.id} className='my-3 p-3 border rounded-md border-blue-900 flex-row flex items-center justify-between'>
                        <Image source={shelter.imageUrl} style={styles.shelterImage} />
                        <View className='items-center mr-10'>
                            <Text className='mb-3'>{shelter.name}</Text>
                            <TouchableOpacity>
                                <Text className='py-2 px-5 bg-blue-100 rounded-md'>View</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* <ShelterListCard key={index} data={item} /> */}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white p-5">
            <Text className='text-xl font-bold'>Welcome Back, John Due</Text>
            <ScrollView>
                {renderHistory()}
                {renderShelter()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 30,
    },
    shelterImage: {
        width: 150,
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover',
    },
});

export default HomeScreen;
