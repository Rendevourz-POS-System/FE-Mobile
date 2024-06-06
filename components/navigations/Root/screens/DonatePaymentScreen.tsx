import React, { FC, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, Text, Clipboard } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';
import { BackendApiUri } from '../../../../functions/BackendApiUri';

const PAYMENT_TIMEOUT = 1800;
const SECONDS_PER_MINUTE = 60;

export const DonatePaymentScreen: FC<RootNavigationStackScreenProps<'DonatePaymentScreen'>> = ({ navigation, route }: any) => {
    const [countdown, setCountdown] = useState<string>('00:00');
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const copyBankNumberToClipboard = () => {
        Clipboard.setString(route.params.bankNumber);
        alert('Nomor rekening telah disalin!');
    };

    useEffect(() => {
        const storedTime = Date.now();
        const timeDiff = Math.floor((Date.now() - storedTime) / 1000);
        if (timeDiff < PAYMENT_TIMEOUT) {
            const initialCountdown = PAYMENT_TIMEOUT - timeDiff;
            setCountdown(formatCountdown(initialCountdown));

            const id = setInterval(() => {
                setCountdown(prevCountdown => {
                    const secondsLeft = parseInt(prevCountdown.split(':')[0]) * SECONDS_PER_MINUTE + parseInt(prevCountdown.split(':')[1]);
                    if (secondsLeft === 1) {
                        clearInterval(id);
                        return '00:00';
                    }
                    const minutes = Math.floor((secondsLeft - 1) / SECONDS_PER_MINUTE);
                    const remainingSeconds = (secondsLeft - 1) % SECONDS_PER_MINUTE;
                    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
                });
            }, 5000);

            setIntervalId(id);
        }

        // Clear interval when component unmounts
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const formatCountdown = (seconds: number): string => {
        const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
        const remainingSeconds = seconds % SECONDS_PER_MINUTE;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const RenderBankTransfer = () => {
        return (
            <View>
                <View className='mt-15' style={styles.containerBox}>
                    <View className='flex flex-row items-center' >
                        <Text className='text-base'>Virtual Account</Text>
                    </View>
                    <View className='mt-2 border-dotted border-2 p-3 flex-row justify-between'>
                        <Text>{route.params.vaNumber}</Text>
                        <TouchableOpacity onPress={copyBankNumberToClipboard}>
                            <Text>Salin</Text>
                        </TouchableOpacity>
                    </View>
                    <Text className='mt-2 text-xs'>Jangan Keluar Dari Halaman Ini</Text>
                </View>

                <View className='mt-5' style={{marginHorizontal: 30}}>
                    <Text>M-Banking</Text>
                </View>
            </View>
        )
    }

    const RenderEWallet = () => {
        return(
            <View>

            </View>
        )
    }

    const onCheckStatus = async () => {

    }

    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.navigate("Home")} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Donasi</Text>
            </View>
            <ScrollView className='mt-5'>
                <View style={{ marginHorizontal: 30 }} className='flex-row justify-between mb-3'>
                    <Text >Waktu tersisa untuk pembayaran:</Text>
                    <Text >{countdown}</Text>
                </View>
                {RenderBankTransfer()}
                <TouchableOpacity style={styles.button} onPress={() => onCheckStatus()}>
                    <Text className="text-center font-bold text-white">Cek Status Pembayaran</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        bottom: 15
    },
    fontButton: {
        color: 'white'
    },
    containerBox: {
        backgroundColor: '#E2EAF5',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 15
    },
    textColor: {
        color: '#4689FD',
        fontSize: 18,
        marginHorizontal: 35,
        marginBottom: 5
    },
    inputBox: {
        marginTop: 5,
        padding: 20,
        marginHorizontal: 30,
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row'
    },
    paymentBox: {
        width: 350,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#4689FD',
        borderWidth: 1,
        marginBottom: 10
    },
    button: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        top: 30,
        marginBottom: 60,
        marginTop: 30
    },
    errorMessage: {
        color: 'red',
        marginHorizontal: 35,
        marginBottom: 20,
    },
});
