// import React from 'react';
// import { createBottomTabNavigator, BottomTabNavigationOptions, } from '@react-navigation/bottom-tabs';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { FC } from 'react';
// import { Platform, StyleSheet } from 'react-native';
// import { HomeScreen } from '../navigations/RootBottomTab/screens/HomeScreen';
// import { UserBottomTabParams } from './UserBottomTabParams';
// import ProfileNavigationStack from '../StackParams/Profile/ProfileNavigationStack';

// const Tab = createBottomTabNavigator<UserBottomTabParams>();

// const homeTabOptions : BottomTabNavigationOptions = {
//     headerShown : false,
//     tabBarLabel : 'Home',
//     tabBarLabelStyle: { color: '#4689FD' },
//     tabBarIcon : ({size}) => (
//         <MaterialCommunityIcons name="home" color={"#4689FD"} size={size} />
//     )
// }

// const profileTabOptions : BottomTabNavigationOptions = {
//     headerShown : false,
//     tabBarLabel : 'Profile',
//     tabBarLabelStyle: { color: '#4689FD' },
//     tabBarIcon : ({size}) => (
//         <MaterialCommunityIcons name="account" color={"#4689FD"} size={size} />
//     )
// }

// const UserBottomTab : FC<unknown> = () => {
//     return (
//         <Tab.Navigator
//             screenOptions={{
//                 tabBarStyle : Platform.OS === 'ios' ? styles.iOSTabBar : styles.androidTabBar,
//                 tabBarActiveTintColor : '#000',
//                 tabBarInactiveTintColor : '#000',
//             }}
            
//         >
//             <Tab.Screen name="Home" component={HomeScreen} options={homeTabOptions} />
//             <Tab.Screen name="Profile" component={ProfileNavigationStack} options={profileTabOptions} />
//         </Tab.Navigator>
//     );
// }

// export default UserBottomTab;

// const styles = StyleSheet.create({
//     iOSTabBar: {
//         height: 88,
//         paddingTop: 8,
//     },
//     androidTabBar: {
//         height: 70,
//         paddingTop: 14,
//         paddingBottom: 14,
//         paddingLeft: 14,
//         paddingRight: 14,
//     },
// });