import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { Searchbar } from "react-native-paper";

export const HomeShelter = () => {
    const [search, setSearch] = useState<string>('');

    return (
        <ScrollView className="mt-5">
            <View className='flex-row items-center justify-around'>
                <Searchbar
                    placeholder='Text Here...'
                    value={search}
                    onChangeText={setSearch}
                    style={{ backgroundColor: 'white', width: '87%' }}
                />
                <MaterialCommunityIcons name='tune-variant' size={24} color='black'
                    style={{ marginRight: 10 }}
                />
            </View>
            
            <View className="mt-5 flex-row justify-around">
                <TouchableOpacity style={styles.button}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="plus" color="white" size={25} />
                    </View>
                    <Text style={styles.text}>Tambah Hewan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="history" color="white" size={25} />
                    </View>
                    <Text style={styles.text}>History List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="receipt-outline" size={25} color="white" />
                    </View>
                    <Text style={styles.text}>Approval List</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        backgroundColor: "#4689FD",
        padding: 5,
        borderRadius: 20,
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        marginTop: 5,
    },
});
