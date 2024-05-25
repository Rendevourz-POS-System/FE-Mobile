import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopNavigation from '../../../TopNavigation';
import { HomeUser } from '../../HomeUser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
