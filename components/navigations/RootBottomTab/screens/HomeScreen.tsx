import React, { FC, useEffect, useState} from 'react';
import { FlatList, Image, ScrollView} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopNavigation from '../../../TopNavigation';
import HomeCarousel from '../../../HomeCarousel';
import { HomeUser } from '../../HomeUser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootBottomTabCompositeNavigationProp } from '../../CompositeNavigationProps';

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


export const HomeScreen: FC<{}> = ({navigation, route} : any) => {
    const favAttempt = route.params;
    return (
        <SafeAreaProvider className='flex-1'>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <TopNavigation />
                <HomeUser favAttempt={favAttempt}/>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
