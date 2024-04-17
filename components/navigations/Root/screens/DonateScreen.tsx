import React, { FC, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';

export const DonateScreen: FC<RootNavigationStackScreenProps<'DonateScreen'>> = ({ navigation }: any) => {

    return (
        <SafeAreaProvider className='flex-1'>
             <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Donasi</Text>
            </View>
            <ScrollView>
                <View className='mt-15' style={styles.containerBox}>
                    <View className='flex flex-row items-center' >
                        <Text className='text-base'>Virtual Account</Text>
                    </View>
                    <View className='mt-2 border-dotted border-2 p-3'>
                        <Text>0001 0002 0003 0004</Text>
                    </View>
                    <Text className='mt-2 text-xs'>Checked within 10 minutes after successfully donate</Text>
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
    containerBox: {
        backgroundColor: '#E2EAF5',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 15
    }
});