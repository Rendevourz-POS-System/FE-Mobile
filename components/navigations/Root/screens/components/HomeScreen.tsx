import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

const HomeScreen = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <Text>Open up App.js to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

export default HomeScreen;
