import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNavigation from '../../../TopNavigation';
import HomeCarousel from '../../../HomeCarousel';

const HomeScreen = () => {

    return (
        <SafeAreaView className='flex-1 m-3'>
            <ScrollView>
                <TopNavigation />
                <HomeCarousel />
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;