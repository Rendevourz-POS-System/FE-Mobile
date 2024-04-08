import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";

export const NotificationScreen: FC<ProfileRootBottomTabCompositeScreenProps<'NotificationScreen'>> = ({ navigation }) => {
    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Notifications</Text>
            </View>

            <ScrollView>
                <View className="top-5">
                    <Text style={styles.dateFont}>24 March 2023</Text>
                    <View style={styles.notifContainer}>
                        <Text style={styles.notifText}>Donate to Shelter A</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        bottom: 15
    },
    dateFont: {
        top: 20,
        left: 30,
        marginBottom: 25
    },
    notifText: {
        fontSize: 13,
        left: 20,
        fontWeight: '600'
    },
    notifContainer: {
        backgroundColor: '#378CE74D',
        padding: 20,
        marginHorizontal: 30,
        borderRadius: 15
    }
});
