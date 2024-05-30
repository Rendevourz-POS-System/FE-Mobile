import React, { FC, useEffect, useState } from "react";
import { BackHandler, Text, View, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { RootNavigationStackScreenProps } from "../../StackScreenProps";
import { ActivityIndicator } from "react-native-paper";

export const EmailScreen: FC<RootNavigationStackScreenProps<'EmailScreen'>> = ({ navigation, route }) => {
    const [time, setTime] = useState<number>(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime - 1); // Decrement time every second
        }, 1000); // Update time every 1000 milliseconds (1 second)

        // Replace the current screen with the Login screen after countdown ends
        const timeout = setTimeout(() => {
            navigation.replace('LoginScreen');
        }, 3000);

        return () => {
            clearInterval(interval); // Cleanup function to clear the interval when the component unmounts
            clearTimeout(timeout); // Clear the timeout to prevent navigation after 5 seconds
        };
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => true; // Returning true disables back button

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-blue-400 justify-center">
                <View className="items-center mb-10">
                    <Image
                        source={require(`../../../../assets/EmailSent.jpg`)}
                        style={{ width: 450, height: 450, borderRadius: 999 }}
                    />
                </View>
                <View className="items-center">
                    <Text className="text-3xl text-white font-bold">Your Email Successfully Verified!</Text>
                </View>
                <View className="items-center">
                    <Text className="text-md text-white">You will be redirected to the Login page in {time}...</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};
