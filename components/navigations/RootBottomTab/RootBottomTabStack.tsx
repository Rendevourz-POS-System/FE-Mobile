import React, { FC } from "react";
import { RootBottomTabParams } from "./RootBottomTabStackParams";
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import HomeScreen from "../Root/screens/HomeScreen";
import { AntDesign } from '@expo/vector-icons';
import { Platform, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator<RootBottomTabParams>();

export const RootBottomTabStack: FC<unknown> = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarInactiveTintColor: '#C4C4C4',
                tabBarStyle: Platform.OS === 'ios' ? styles.iOSTabBar : styles.androidTabBar,
                tabBarHideOnKeyboard:true
            }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={homeTabOptions} />
        </Tab.Navigator>
    );
}

const homeTabOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarLabel: 'Home',
    tabBarLabelStyle: {
        'fontSize': 12,
    },
    tabBarIcon: () => (
        <AntDesign name="notification" size={20} color="black" />
    ),
    tabBarHideOnKeyboard: true,
};

const styles = StyleSheet.create({
    iOSTabBar: {
        height: 88,
        paddingTop: 8,
        shadowOpacity: 0.2
    },
    androidTabBar: {
        height: 70,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 14,
        paddingRight: 14,
        borderTopWidth: 3,
        elevation: 0,
    },
});

export default RootBottomTabStack;