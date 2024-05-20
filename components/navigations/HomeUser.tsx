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

    const [selectedShelter, setSelectedShelter] = useState<string | null>('Shelter');
    const toggleShelterSelection = (shelterId: string) => {
        setSelectedShelter((prevSelectedShelter) => {
            // If the clicked shelter is already selected, clear the selection
            if (prevSelectedShelter === shelterId) {
                return null;
            } else {
                // Otherwise, select the clicked shelter
                return shelterId;
            }
        });
    };

    return (
        <>
            <BottomSheetModalProvider>
                <View className='flex-row justify-around items-center'>
                    {data.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => toggleShelterSelection(item.name)}
                            className={`px-20 py-3 m-2 ${selectedShelter === item.name ? 'border-b-2 border-blue-400' : ''}`}
                        >
                            <Text className={`text-gray-700`}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {selectedShelter === 'Shelter' ? (
                    <ShelterList favAttempt={favAttempt}/>
                ) : (
                    <PetList/>
                )}
            </BottomSheetModalProvider>
        </>
    )
};

export default HomeUser;
