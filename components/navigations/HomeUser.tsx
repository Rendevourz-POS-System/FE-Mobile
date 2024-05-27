import React, { useState } from 'react';
import { TouchableOpacity, View, } from 'react-native';
import { Text } from 'react-native-elements';
import {
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { ShelterList } from '../ShelterList';
import { PetList } from '../PetList';

export const HomeUser = ({ favAttempt }: any) => {
    
    const data = [
        { id: 'home', name: 'Shelter', icon: 'home' },
        { id: 'paw', name: 'Pets', icon: 'paw' },
    ];

    const [selectedTab, setSelectedTab] = useState<string>('Shelter');

    const selectTab = (tabName: string) => {
        if (selectedTab !== tabName) {
          setSelectedTab(tabName);
        }
      };

    return (
        <>
            <BottomSheetModalProvider>
                <View className='flex-row justify-around items-center'>
                    {data.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => selectTab(item.name)}
                            className={`w-1/2 px-20 py-3 m-2 ${selectedTab === item.name ? 'border-b-2 border-blue-400' : 'border-transparent'}`}
                        >
                            <Text className={`text-center ${selectedTab === item.name ? 'text-blue-400' : 'text-gray-700'}`}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                {selectedTab === 'Shelter' ? (
                    <ShelterList favAttempt={favAttempt}/>
                ) : (
                    <PetList/>
                )}
            </BottomSheetModalProvider>
        </>
    )
};

export default HomeUser;
