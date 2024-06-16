import React, { FC, useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, TextInput, Text, Linking, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { post } from '../../../../functions/Fetch';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { RadioButton } from 'react-native-paper';
import { NoHeaderNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';

interface Donation {
    ShelterId: string;
    Type: string;
    Amount: number;
    PaymentType: string;
    Reason?: string | null;
    PaymentChannel?: string | null;
}

const donationFormSchema = z.object({
    Amount: z.number({ required_error: "Nominal tidak boleh kosong" }).int().positive("Kapasitas shelter harus merupakan bilangan bulat positif"),
    PaymentType: z.string({ required_error: "Jenis Pembayaran tidak boleh kosong" }).min(1, { message: "Jenis Pembayaran tidak boleh kosong" }),
    Reason: z.string().optional(),
    PaymentChannel: z.string()
})

type DonationFormType = z.infer<typeof donationFormSchema>

export const DonateScreen: FC<NoHeaderNavigationStackScreenProps<'DonateScreen'>> = ({ navigation, route }: any) => {
    const { control, watch, setValue, handleSubmit, formState: { errors } } = useForm<DonationFormType>({
        resolver: zodResolver(donationFormSchema),
        defaultValues: {
            Reason: "",
            PaymentChannel: "-",
        }
    });

    const onSubmit = async (data: DonationFormType) => {
        const payload = {
            ShelterId: route.params.shelterId,
            Type: "Donation",
            Amount: data.Amount,
            PaymentType: data.PaymentType,
            PaymentChannel: data.PaymentType == "gopay" ? "gopay" : data.PaymentType == "shopeepay" ? "shopeepay" : data.PaymentChannel,
            Reason: data.Reason === undefined ? "" : data.Reason
        }
        console.log(payload);

        try {
            const response = await post(BackendApiUri.postRequestDonation, payload);
            if (response.status === 200) {
                console.log(response.data)

                if (data.PaymentType == "bank_transfer") {
                    const vaNumbers = response.data.Data.va_numbers;

                    let firstVaNumber = {
                        bank: "",
                        va_number: ""
                    };

                    if (vaNumbers.length > 0) {
                        firstVaNumber = vaNumbers[0];
                    }

                    navigation.navigate("DonatePaymentScreen", { vaNumber: firstVaNumber.va_number, amount: data.Amount })
                } else {
                    const actions = response.data.Data.actions;

                    let getDeepLink = { url: "" }

                    if (actions.length > 0) {
                        getDeepLink = actions[1]
                        console.log("deeplink uri", getDeepLink.url)
                    }

                    Linking.openURL(getDeepLink.url)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaProvider className='flex-1 bg-white'>
            <View className="mt-5 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Donasi</Text>
            </View>
            <ScrollView className='mt-5'>
                <Text style={styles.textColor}>Masukan Nominal<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="Amount"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    value={value ? value.toString() : ''}
                                    onChangeText={(text) => {
                                        const numericValue = parseFloat(text);
                                        if (!isNaN(numericValue)) {
                                            onChange(numericValue);
                                        } else {
                                            onChange(undefined);
                                        }
                                    }}
                                />
                            </View>
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.Amount?.message}</Text>

                <Image source={{ uri: '../../../../assets/Bca_logo.png' }} style={{ width: 100, height: 10 }} />
                <Text style={styles.textColor}>Jenis Pembayaran</Text>
                <View className='flex' style={{ marginHorizontal: 30 }}>
                    <Controller
                        name="PaymentType"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <RadioButton.Group onValueChange={onChange} value={value} >
                                <View className="flex">
                                    <View className="flex-row justify-start items-center mr-5">
                                        <RadioButton.Android value="bank_transfer" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">Bank Transfer</Text>
                                    </View>
                                    <View className="flex-row justify-start items-center">
                                        <RadioButton.Android value="gopay" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">Gopay</Text>
                                    </View>
                                    <View className="flex-row justify-start items-center">
                                        <RadioButton.Android value="shopeepay" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">ShopeePay</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.PaymentType?.message}</Text>

                {watch("PaymentType") == "bank_transfer" && <>
                    <Text style={styles.textColor}>Jenis Bank</Text>
                    <View className='flex-row' style={{ marginHorizontal: 30 }}>
                        <Controller
                            name="PaymentChannel"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <RadioButton.Group onValueChange={onChange} value={value} >
                                    <View className="flex">
                                        <View className="flex-row justify-start items-center mr-5">
                                            <RadioButton.Android value="bca" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">BCA</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="bni" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">BNI</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="bri" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">BRI</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="mandiri" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">Mandiri</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="maybank" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">MayBank</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="permata" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">Permata</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="mega" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">Mega</Text>
                                        </View>
                                        <View className="flex-row justify-start items-center">
                                            <RadioButton.Android value="cimb" color={'#4689FD'} uncheckedColor="#808080" />
                                            <Text className="text-base text-[#808080]">CIMB</Text>
                                        </View>
                                    </View>
                                </RadioButton.Group>
                            )}
                        />
                    </View>
                    <Text style={styles.errorMessage}>{errors.PaymentType?.message}</Text>
                </>}

                <Text style={styles.textColor}>Alasan Donasi</Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="Reason"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                multiline
                                placeholder="Masukkan Alasan Donasi"
                                style={{ flex: 1 }}
                                value={value}
                                onChangeText={(text: string) => setValue("Reason", text)}
                            />
                        )}
                    />
                    <Text className='text-center text-xs'>
                        Note: ini hanya simulasi donasi menggunakan MidTrans
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text className="text-center font-bold text-white">Donate</Text>
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
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    nominalButton: {
        backgroundColor: '#ddd', // Ganti dengan warna button yang diinginkan
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    nominalButtonText: {
        color: '#000', // Ganti dengan warna teks yang diinginkan
    },
});
