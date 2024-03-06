import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeScreen = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <Text>Open up App.js to start working on your app!</Text>
            <View>
                <Icon name="circle-thin" size={30} color="#900" />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

export default HomeScreen;
