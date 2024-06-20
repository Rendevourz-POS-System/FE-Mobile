import { Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { useAuth } from "../../../../app/context/AuthContext";

interface History {
    Data: {
        Id: string,
        UserId: string,
        PetId: string,
        ShelterId: string,
        Type: string,
        Status: string,
        Reason: string,
        RequestedAt: string,
    }[]
}

interface ShelterProps {
    Data: {
        ShelterName: string
    }
}

export const HistoryScreen: FC<ProfileNavigationStackScreenProps<'HistoryScreen'>> = ({ navigation }) => {
    const { authState } = useAuth();
    const [data, setData] = useState<History>();
    const [shelterData, setShelterData] = useState<ShelterProps>();
    const [shelterNames, setShelterNames] = useState<{ [key: string]: string }>({});

    const fetchData = async () => {
        try {
            const response = await get(`${BackendApiUri.findRequest}?user_id=${authState?.userId}`)
            if (response.status === 200) {
                setData(response.data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const fetchShelterName = async (shelterId: string) => {
        if (!shelterNames[shelterId]) {
            const response = await get(`${BackendApiUri.getShelterDetail}/${shelterId}`);
            if (response.status === 200) {
                setShelterNames(prev => ({ ...prev, [shelterId]: response.data.Data.ShelterName }));
            }
        }
    };

    useEffect(() => {
        if (authState?.userId) {
            fetchData();
        }
    }, [authState]);

    useEffect(() => {
        if (data) {
            data.Data.forEach(item => {
                fetchShelterName(item.ShelterId);
            });
        }
    }, [data]);

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('id-ID', timeOptions);
    };

    const sortDataByDate = (data: History) => {
        return data.Data.sort((a, b) => new Date(b.RequestedAt).getTime() - new Date(a.RequestedAt).getTime());
    };

    return (
        <SafeAreaProvider style={styles.container} className='bg-gray-100'>
            <View className="mt-5 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">History</Text>
            </View>

            <ScrollView>
                <View className="top-5" style={{ marginHorizontal: 30 }}>
                    {data && sortDataByDate(data).map((item, index) => (
                        <View key={index}>
                            <View className="flex-row justify-between">
                                <Text style={styles.heading}>{formatDate(item.RequestedAt)}</Text>
                                <Text style={styles.heading}>{formatTime(item.RequestedAt)}</Text>
                            </View>
                            <View style={styles.historyContainer}>
                                <Text style={styles.historyText}>{item.Status} {item.Type} to {shelterNames[item.ShelterId] || '...'}</Text>
                            </View>
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
        borderRadius: 10,
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
