import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PublishRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const publishFormSchema = z.object({
    // shelterId: z.string({ required_error: "Nama lengkap tidak boleh kosong" }).min(5, { message: "Nama lengkap tidak boleh kosong" }),
    name: z.string({ required_error: "Nama tidak boleh kosong" }).email({ message: "Nama tidak boleh kosong" }),
    age: z.string({ required_error: "Umur tidak boleh kosong" }).min(5, { message: "Umur tidak boleh kosong" }),
    type: z.string({ required_error: "Jenis Hewan tidak boleh kosong" }).min(5, { message: "Jenis Hewan tidak boleh kosong" }),
    species: z.string({ required_error: 'Spesies hewan tidak boleh kosong' }).min(5, { message: "Spesies hewan tidak boleh kosong" }),
    gender: z.string({ required_error: "Jenis kelamin hewan tidak boleh kosong" }).min(5, { message: "Jenis kelamin hewan tidak boleh kosong" }),
    description: z.string({ required_error: "Deskripsi tidak boleh kosong" }).min(5, { message: "Deskripsi tidak boleh kosong" }),
    condition: z.string({ required_error: "Kondisi hewan tidak boleh kosong" }).min(5, { message: "Kondisi hewan tidak boleh kosong" }),
})

type PublishFormType = z.infer<typeof publishFormSchema>

export const PublishScreen: FC<PublishRootBottomTabCompositeScreenProps<'PublishScreen'>> = ({ navigation }) => {
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<PublishFormType>({
        resolver: zodResolver(publishFormSchema),
    });

    const onSubmit = async (data: PublishFormType) => {
        console.log(data)
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Tambah Hewan</Text>
            </View>

            <ScrollView>
                <Text className='mt-5 mb-8 text-xs text-center text-[#8A8A8A]'>Isilah data Anda dengan baik dan benar</Text>

                <Text style={styles.textColor}>Nama<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="name"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Nama Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('name', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.name?.message}</Text>

                <Text style={styles.textColor}>Umur<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="age"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Umur Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('age', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.age?.message}</Text>

                <Text style={styles.textColor}>Jenis Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="type"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Jenis Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('type', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.type?.message}</Text>

                <Text style={styles.textColor}>Spesies<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="species"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Spesies Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('species', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.species?.message}</Text>

                <Text style={styles.textColor}>Jenis Kelamin<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="gender"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Jenis Kelamin Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('gender', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.gender?.message}</Text>

                <Text style={styles.textColor}>Deskripsi<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="description"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Deskripsi Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('description', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.description?.message}</Text>

                <Text style={styles.textColor}>Kondisi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="condition"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Kondisi Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('condition', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.condition?.message}</Text>

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
