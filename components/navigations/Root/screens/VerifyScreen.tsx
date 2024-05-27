import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { FC, useState, useEffect } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootNavigationStackScreenProps } from "../../StackScreenProps";
import { Button, TextInput } from "react-native-paper";
import { post } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RESEND_OTP_TIMEOUT = 120; // seconds

export const VerifyScreen: FC<RootNavigationStackScreenProps<'VerifyScreen'>> = ({ navigation, route }) => {
    const email = route.params.email;
    const userId = route.params.userId;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [resendAvailable, setResendAvailable] = useState<boolean>(true);
    const [resendMessage, setResendMessage] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() => {
        const checkResendStatus = async () => {
            const storedTime = await AsyncStorage.getItem('resendOtpTime');
            if (storedTime) {
                const timeDiff = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
                if (timeDiff < RESEND_OTP_TIMEOUT) {
                    setCountdown(RESEND_OTP_TIMEOUT - timeDiff);
                    setResendAvailable(false);
                } else {
                    await AsyncStorage.removeItem('resendOtpTime');
                }
            }
        };

        checkResendStatus();

        const interval = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown > 0) return prevCountdown - 1;
                setResendAvailable(true);
                return 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const body = {
            UserId: userId,
            Otp: parseInt(otp)
        };
        try {
            const res = await post(`${BackendApiUri.verifyEmail}`, body);
            if (res.status === 200) {
                navigation.navigate("EmailScreen");
            }
        } catch (e) {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        setResendAvailable(false);
        setResendMessage("OTP resent. Please check your email. You can resend OTP again in 2 minutes.");
        await AsyncStorage.setItem('resendOtpTime', Date.now().toString());
        setCountdown(RESEND_OTP_TIMEOUT);
        const res = await post(`${BackendApiUri.resendOtp}`, { UserId: userId });
        if (res.status !== 200) {
            setResendAvailable(true);
            setResendMessage("Failed to resend OTP. Please try again.");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-start">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View className="absolute left-6 top-12">
                            <Ionicons name="chevron-back" size={24} style={{ backgroundColor: "#ECECEC", borderRadius: 999, padding: 2.5 }} color="black" onPress={() => navigation.navigate("LoginScreen")} />
                        </View>
                        <View className="items-center mt-[20%]">
                            <FontAwesome6 name="envelope-open-text" size={210} style={{ color: "#488DF4" }} />
                        </View>
                        <View className="mx-6">
                            <Text className="text-6xl font-extrabold mt-14">Enter OTP?</Text>
                            <Text className="text-lg mt-4">An 8 digit code has been sent to</Text>
                            <Text className="text-lg">{email}</Text>
                            <View className="flex-row items-center mt-4">
                                <FontAwesome6 name="hashtag" size={20} />
                                <TextInput
                                    placeholder="8 digit code"
                                    style={{ backgroundColor: "transparent", flex: 1, marginLeft: 10 }}
                                    activeUnderlineColor="#488DF4"
                                    mode="flat"
                                    onChangeText={setOtp}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 12 }}>
                                <Text>Don't receive an OTP? </Text>
                                <TouchableOpacity onPress={handleResend} disabled={!resendAvailable}>
                                    <Text style={resendAvailable ? { color: '#488DF4' } : { color: 'gray' }}>
                                        {resendAvailable ? 'Resend OTP' : `Resend in ${countdown}s`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity 
                                style={[style.button, isSubmitting ? { backgroundColor: 'gray' } : null]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                <View style={style.buttonContent}>
                                    {isSubmitting && <ActivityIndicator color="white" style={style.activityIndicator} />}
                                    <Text style={style.buttonText}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const style = StyleSheet.create({
    inputBox: {
        backgroundColor: "#F7F7F9",
        padding: 20,
        marginHorizontal: 30,
        borderBottomColor: "#488DF4",
        borderBottomWidth: 2,
        borderRadius: 10,
        flexDirection: 'row'
    },
    phoneNumberPrefix: {
        marginRight: 10, 
        fontSize: 18,
        alignSelf: 'center',
    },
    inputSelect: {
        backgroundColor: "#F7F7F9",
        marginHorizontal: 30,
        borderBottomColor: "#488DF4",
        borderBottomWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
    },
    button: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 20
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    fontColor: {
        color: "#488DF4"
    },
    passwordToggleIcon: {
        flexDirection: 'row',
        top: 5,
    },
    errorMessage: {
        color: 'red',
        marginHorizontal: 35,
        marginBottom: 20,
    }
});