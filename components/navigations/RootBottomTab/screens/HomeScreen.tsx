import React, { FC, useEffect, useState} from 'react';
import { FlatList, Image, ScrollView} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopNavigation from '../../../TopNavigation';
import HomeCarousel from '../../../HomeCarousel';
import { HomeUser } from '../../HomeUser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface ShelterData {
    Id: string;
    UserId: string;
    ShelterName: string;
    ShelterLocation: string;
    ShelterCapacity: number;
    ShelterContactNumber: string;
    ShelterDescription: string;
    TotalPet: number;
    BankAccountNumber: string;
    Pin: string;
    ShelterVerified: boolean;
    CreatedAt: string;
}


export const HomeScreen: FC<{}> = () => {
    return (
        <SafeAreaProvider className='flex-1'>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <TopNavigation />
                <HomeUser/>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
