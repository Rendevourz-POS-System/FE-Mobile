import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { ProgressBar } from "react-native-paper";

export const HistoryScreen: FC<ProfileRootBottomTabCompositeScreenProps<'HistoryScreen'>> = ({ navigation }) => {
    const [historyData, setHistoryData] = useState([
        {
            date: 'March 2023', events: [
                { description: 'Donate to Shelter A', date: '20 March 2023' },
                { description: 'Donate to Shelter B', date: '22 March 2023' },
                { description: 'Adopted Pet A', date: '25 March 2023' },
                { description: 'Adopted Pet B', date: '28 March 2023' },
            ]
        },
        {
            date: 'February 2023', events: [
                { description: 'Donate Shelter C', date: '10 February 2023' },
                { description: 'Donate Shelter C', date: '20 February 2023' },
            ]
        },
    ]);

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">History</Text>
            </View>

            <ScrollView>
                <View className="top-5">
                    <Text style={styles.heading}>Total Transaction</Text>
                    <View style={styles.transactionContainer} className="mx-8">
                        <View className="p-5">
                            <View className="flex-row justify-between">
                                <Text className="mb-2">Donation</Text>
                                <Text>5</Text>
                            </View>
                            <ProgressBar progress={0.5} className="mb-5" />

                            <View className="flex-row justify-between">
                                <Text className="mb-2">Adoption</Text>
                                <Text>4</Text>
                            </View>
                            <ProgressBar progress={0.4} className="mb-5" />

                            <View className="flex-row justify-between">
                                <Text className="mb-2">Rescue</Text>
                                <Text>2</Text>
                            </View>
                            <ProgressBar progress={0.2} />
                        </View>
                    </View>
                </View>

                <View className="top-">
                    {historyData.map((historyItem, index) => (
                        <View key={index}>
                            <Text style={styles.heading}>{historyItem.date}</Text>
                            {historyItem.events.map((event, eventIndex) => (
                                <View key={eventIndex} style={styles.historyContainer}>
                                    <Text style={styles.historyText}>{event.date}</Text>
                                    <Text style={styles.historyText}>{event.description}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
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
