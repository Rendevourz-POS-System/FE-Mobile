import { FC, useEffect, useState } from "react";
import { RootNavigationStackScreenProps } from "../../StackScreenProps";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "react-native";

export const EmailScreen : FC<RootNavigationStackScreenProps<'EmailScreen'>> = ({ navigation, route }) => {
    const [time, setTime] = useState<number>(5);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime - 1); // Decrement time every second
        }, 1000); // Update time every 1000 milliseconds (1 second)

        // Navigate away after countdown ends
        const timeout = setTimeout(() => {
            navigation.navigate('LoginScreen');
        }, 5000);

        return () => {
            clearInterval(interval); // Cleanup function to clear the interval when the component unmounts
            clearTimeout(timeout); // Clear the timeout to prevent navigation after 5 seconds
        };
    }, [navigation]);
    
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
                    <Text className="text-3xl text-white font-bold">Your Email Success Verified !</Text>
                </View>
                <View className="items-center">
                    <Text className="text-md text-white">You will redirect to Login page in {time} ....</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}