import { Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import { useAuth } from "../../../../app/context/AuthContext";
import { ShelterData } from "../../../../interface/IShelterList";
import { Location } from "../../../../interface/ILocation";
import { useDebounce } from "use-debounce";
import { myProvince } from "../../../../functions/getLocation";
import { get } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { PetData } from "../../../../interface/IPetList";

export const ApprovalScreen: FC<ProfileNavigationStackScreenProps<"ApprovalScreen">> = ({ navigation }) => {
    const {authState} = useAuth();
    const [provinceData, setProvinceData] = useState<Location[]>([]);
    const [shelterData, setShelterData] = useState<ShelterData[]>([]);
    const [shelterFav, setShelterFav] = useState<ShelterData[]>([]);
    const [filterLocation, setFilterLocation] = useState<Location>({
        label: "",
        value: ""
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debounceValue] = useDebounce(search, 1000);
    const [refreshing, setRefreshing] = useState(false);
    const [petData, setPetData] = useState<PetData[]>([]);
    
    const onRefresh = () => {
        try { 
            setRefreshing(true);
            fetchPet();
        } catch(e) {
            console.log(e);
        }
    };

    const fetchPet = async () => {
        try{
            const response = await get(`${BackendApiUri.findRequest}`)
        } catch(e) {
            throw Error;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPet();
    }, [debounceValue, refreshing]);







    



    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View className="mt-5 flex-row items-center justify-center">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                    <Text className="text-xl">Approval</Text>
                </View>

                {isLoading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator color="blue" size="large"/>
                    </View>
                ) : (
                    <>

                    </>
                )}

            </SafeAreaView>
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
