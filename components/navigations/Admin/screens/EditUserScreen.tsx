import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useState } from 'react';
import { TouchableHighlight, TouchableOpacity, View, } from 'react-native';
import { Text } from 'react-native-elements';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { IUser } from '../../../../interface/IUser';
import { get } from '../../../../functions/Fetch';
import { AdminNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const EditUserScreen: FC<AdminNavigationStackScreenProps<'EditUserScreen'>> = ({ navigation, route }: any) => {
    const [userData, setUserData] = useState<IUser[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const routes = route.params.userId

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = async () => {
        try {
            const response = await get(`${BackendApiUri.getUserDetail}`);
            if (response && response.status === 200) {
                setUserData(response.data);
            } else {
                setUserData([]);
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Edit User</Text>
            </View>
        </SafeAreaProvider>
    )
};

