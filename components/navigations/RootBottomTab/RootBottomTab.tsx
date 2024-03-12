import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions, } from '@react-navigation/bottom-tabs';
import { RootBottomTabParams } from './RootBottomTabParams';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FC } from 'react';
import { Platform, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { ProfileScreen } from '../Profile/screens/ProfileScreen';


const Tab = createBottomTabNavigator<RootBottomTabParams>();

const homeTabOptions : BottomTabNavigationOptions = {
    headerShown : false,
    tabBarLabel : 'Home',
    tabBarIcon : ({color, size}) => (
        <MaterialCommunityIcons name="home" color={color} size={size} />
    )
}
const profileTabOptions : BottomTabNavigationOptions = {
    headerShown : false,
    tabBarLabel : 'Profile',
    tabBarIcon : ({color, size}) => (
        <MaterialCommunityIcons name="account" color={color} size={size} />
    )
}

const RootBottomTab : FC<unknown> = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle : Platform.OS === 'ios' ? styles.iOSTabBar : styles.androidTabBar,
                tabBarActiveTintColor : '#000',
                tabBarInactiveTintColor : '#000',
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={homeTabOptions} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={profileTabOptions} />
        </Tab.Navigator>
    );
}

export default RootBottomTab;

const styles = StyleSheet.create({
    iOSTabBar: {
        height: 88,
        paddingTop: 8,
    },
    androidTabBar: {
        height: 70,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 14,
        paddingRight: 14,
    },
});