import React, { FC, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RootNavigationStackScreenProps } from '../../StackScreenProps';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const adoptionFormSchema = z.object({
    fullName: z.string({ required_error: "Nama lengkap tidak boleh kosong" }).min(5, { message: "Nama lengkap tidak boleh kosong" }),
    nik: z.string({ required_error: "NIK tidak boleh kosong" }).email({ message: "NIK tidak boleh kosong" }),
    address: z.string({ required_error: "Alamat rumah tidak boleh kosong" }).min(5, { message: "Alamat rumah tidak boleh kosong" }),
    city: z.string({ required_error: "Kabupaten/Kota tidak boleh kosong" }).min(5, { message: "Kabupaten/Kota tidak boleh kosong" }),
    postalCode: z.string({ required_error: 'Kode pos tidak boleh kosong' }).min(5, { message: "Kode pos tidak boleh kosong" }),
    work: z.string({ required_error: "Pekerjaan tidak boleh kosong" }).min(5, { message: "Pekerjaan tidak boleh kosong" }),
    reasonAdoption: z.string({ required_error: "Alasan adopsi tidak boleh kosong" }).min(5, { message: "Alasan adopsi tidak boleh kosong" }),
})

type AdoptionFormType = z.infer<typeof adoptionFormSchema>

export const AdoptionFormScreen: FC<RootNavigationStackScreenProps<'AdoptionFormScreen'>> = ({ navigation, route }: any) => {
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<AdoptionFormType>({
        resolver: zodResolver(adoptionFormSchema),
    });

    const onSubmit = async (data: AdoptionFormType) => {
        console.log(data)
    }

    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Adopsi Hewan</Text>
            </View>

            <ScrollView>
                <Text className='mt-5 mb-8 text-xs text-center text-[#8A8A8A]'>Isilah data Anda dengan baik dan benar</Text>

                <Text style={styles.textColor}>Nama Lengkap (Sesuai KTP)<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="fullName"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Nama Lengkap"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('fullName', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.fullName?.message}</Text>

                <Text style={styles.textColor}>NIK<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="nik"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan NIK"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('nik', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.nik?.message}</Text>

                <Text style={styles.textColor}>Alamat Rumah<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="address"
                        control={control}
                        render={() => (
                            <TextInput
                                multiline
                                numberOfLines={4}
                                placeholder="Masukkan Alamat Rumah"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('address', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.address?.message}</Text>

                <Text style={styles.textColor}>Kabupaten/Kota<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="city"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Kabupaten/Kota"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('city', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.city?.message}</Text>

                <Text style={styles.textColor}>Kode Pos<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="postalCode"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Kode Pos"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('postalCode', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.postalCode?.message}</Text>

                <Text style={styles.textColor}>Pekerjaan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="work"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Pekerjaan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('work', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.work?.message}</Text>

                <Text style={styles.textColor}>Alasan Adopsi<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="reasonAdoption"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Alasan Adopsi"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('reasonAdoption', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.reasonAdoption?.message}</Text>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} className='mb-5'>
                    <Text className="text-center font-bold text-white">Submit</Text>
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
        color: 'white',
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
    errorMessage: {
        color: 'red',
        marginHorizontal: 35,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 20
    },
});
