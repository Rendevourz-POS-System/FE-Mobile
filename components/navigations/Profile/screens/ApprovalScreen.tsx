import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

export const ApprovalScreen: FC<ProfileNavigationStackScreenProps<"ApprovalScreen">> = ({ navigation }) => {


    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-5 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Approval</Text>
            </View>

            <ScrollView>
                <View className="top-5">
                    
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
    heading: {
        top: 20,
        left: 30,
        marginBottom: 25
    },
    historyText: {
        fontSize: 13,
        fontWeight: '600',
        flexWrap: 'wrap'
    },
    historyContainer: {
        backgroundColor: '#378CE74D',
        padding: 20,
        marginHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    transactionContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        elevation: 5,
        marginBottom: 20
    },
});
