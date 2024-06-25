import { Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { SectionList, Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { useAuth } from "../../../../app/context/AuthContext";

interface History {
    Id: string,
    UserId: string,
    PetId: string,
    ShelterId: string,
    Type: string,
    Status: string,
    Reason: string,
    RequestedAt: string,
}

interface ShelterProps {
    Data: {
        ShelterName: string
    }
}

interface GroupedHistory {
    title: string;
    data: History[];
}

export const HistoryScreen: FC<ProfileNavigationStackScreenProps<'HistoryScreen'>> = ({ navigation }) => {
    const { authState } = useAuth();
    const [data, setData] = useState<History[]>([]);
    const [groupedData, setGroupedData] = useState<GroupedHistory[]>([]);
    const [shelterData, setShelterData] = useState<ShelterProps>();
    const [shelterNames, setShelterNames] = useState<{ [key: string]: string }>({});

    const fetchData = async () => {
        try {
            const response = await get(`${BackendApiUri.findRequest}?user_id=${authState?.userId}`);
            if (response.status === 200) {
                const fetchedData = response.data.Data;
                setData(fetchedData);
                setGroupedData(groupByDate(fetchedData));
            } else {
                setData([]);
                setGroupedData([]);
            }
        } catch (e) {
            console.error('Fetch error:', e);
        }
    };

    const fetchShelterName = async (shelterId: string) => {
        if (!shelterNames[shelterId]) {
            try {
                const response = await get(`${BackendApiUri.getShelterDetail}/${shelterId}`);
                if (response.status === 200) {
                    setShelterNames(prev => ({ ...prev, [shelterId]: response.data.Data.ShelterName }));
                    console.log(`Fetched shelter name for ${shelterId}:`, response.data.Data.ShelterName);
                } else {
                    console.error(`Error fetching shelter name for ${shelterId}:`, response.status);
                }
            } catch (e) {
                console.error(`Fetch shelter name error for ${shelterId}:`, e);
            }
        }
    };

    const groupByDate = (data: History[]): GroupedHistory[] => {
        if (data) {
            const grouped = data.reduce((acc: { [key: string]: History[] }, item) => {
                const date = new Date(item.RequestedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(item);
                return acc;
            }, {});

            return Object.keys(grouped).map(date => ({
                title: date,
                data: grouped[date],
            }));
        }
        return [];
    };

    useEffect(() => {
        if (authState?.userId) {
            fetchData();
        }
    }, [authState]);

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('id-ID', timeOptions);
    };

    const renderHistoryItem = ({ item }: { item: History }) => (
        <View className="mx-5 my-2 bg-blue-200 rounded-md px-4 py-3">
            <View className="flex-row justify-between">
                <Text>{item.Type} {item.Status}</Text>
                <Text>{formatTime(item.RequestedAt)}</Text>
            </View>
            <View>
                <Text className="text-xs font-light mt-1">{item.Reason}</Text>
            </View>
        </View>
    );

    const renderSectionHeader = ({ section }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 25, top: 12 }} />
                    <Text style={styles.title} className="mt-2">History</Text>
                </View>
                <SectionList
                    sections={groupedData}
                    keyExtractor={(item) => item.Id}
                    renderItem={renderHistoryItem}
                    renderSectionHeader={renderSectionHeader}
                    className="mt-5"
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionHeader: {
        backgroundColor: '#f3f3f3',
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyItemDetails: {
        flexDirection: 'column',
    },
    historyItemText: {
        fontSize: 14,
    },
});
