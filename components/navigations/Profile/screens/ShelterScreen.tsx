import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { CreateShelter } from "../../../CreateShelter";

export const ShelterScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ShelterScreen'>> = ({ navigation }) => {

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Create Shelter</Text>
            </View>
            <CreateShelter />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    nextIconContainer: {
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        padding: 5
    },
});
