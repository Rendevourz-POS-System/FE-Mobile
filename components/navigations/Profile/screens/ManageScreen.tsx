import { Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { FontAwesome6 } from '@expo/vector-icons';
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import axios from "axios";

interface User {
    Username: string,
    Email: string;
    Address: string,
    City: string,
    Nik: string,
    PhoneNumber: string,
    PostalCode: number,
    Province: string,
}

const profileFormSchema = z.object({
    Nik: z.string({ required_error: "NIK tidak boleh kosong" }).regex(/^\d{16}$/, { message: "Format NIK tidak valid" }),
    PhoneNumber: z.string({ required_error: "Nomor telepon tidak boleh kosong" }).min(1, { message: "Nomor Telepon tidak boleh kosong" }).refine(value => /^\d+$/.test(value), { message: "Nomor telepon harus berupa angka (0-9)" }),
    Address: z.string({ required_error: "Alamat tidak boleh kosong" }).min(1, { message: "Alamat tidak boleh kosong" }),
    City: z.string({ required_error: "Kabupaten/Kota tidak boleh kosong" }).min(1, { message: "Kabupaten/Kota tidak boleh kosong" }),
    Province: z.string({ required_error: "Provinsi tidak boleh kosong" }).min(1, { message: "Provinsi tidak boleh kosong" }),
    PostalCode: z.number({ required_error: 'Kode pos tidak boleh kosong' }),
})

type ProfileFormType = z.infer<typeof profileFormSchema>

export const ManageScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ManageScreen'>> = ({ navigation }) => {
    const [userData, setUserData] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BackendApiUri.getUserData}`);
                setUserData(response.data);
                setValue("Nik", response.data?.Nik);
                setValue("PhoneNumber", response.data?.PhoneNumber);
                setValue("Address", response.data?.Address);
                setValue("City", response.data?.City);
                setValue("Province", response.data?.Province);
                setValue("PostalCode", response.data?.PostalCode);
            } catch (error) {
                console.error("Error fetching shelter data:", error);
            }
        };
        fetchData();
    }, []);

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema)
    });

    const onSubmit = async (data: ProfileFormType) => {
        setValue("Nik", data.Nik);
        setValue("PhoneNumber", data.PhoneNumber);
        setValue("Address", data.Address);
        setValue("City", data.City);
        setValue("Province", data.Province);
        setValue("PostalCode", data.PostalCode);
        Alert.alert('Data Tersimpan', 'Data anda telah tersimpan.');
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Manage Profile</Text>
            </View>

            <ScrollView>
                <View className="mb-10 mt-10">
                    <View style={styles.rowContainer} className="justify-around">
                        <Ionicons name="person-circle-outline" size={120} color="black" />
                        <Text className="top-5 text-3xl">{userData?.Username}</Text>
                    </View>
                </View>

                <View style={styles.disabledInput}>
                    <TextInput
                        style={{ flex: 1 }}
                        placeholder="Name"
                        value={userData?.Username}
                        editable={false}
                    />
                </View>

                <View style={styles.disabledInput}>
                    <TextInput
                        style={{ flex: 1 }}
                        placeholder="Email"
                        value={userData?.Email}
                        editable={false}
                    />
                </View>

                <View style={styles.inputBox}>
                    <Controller
                        name="Nik"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="NIK"
                                onChangeText={(text: string) => setValue('Nik', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.Nik?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="PhoneNumber"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Nomor Telepon"
                                onChangeText={(text: string) => setValue('PhoneNumber', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.PhoneNumber?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="Address"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Alamat"
                                onChangeText={(text: string) => setValue('Address', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.Address?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="City"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Kota"
                                onChangeText={(text: string) => setValue('City', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.City?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="Province"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Kota"
                                onChangeText={(text: string) => setValue('Province', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.Province?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="PostalCode"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Kode Pos"
                                onChangeText={(text: string) => {
                                    const numericValue = parseInt(text);
                                    if (!isNaN(numericValue)) {
                                        setValue('PostalCode', numericValue);
                                    }
                                }}
                                value={value?.toString()}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.PostalCode?.message}</Text>

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text className="text-center font-bold text-white">Save</Text>
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
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        bottom: 15
    },
    rowContainer: {
        alignItems: 'center',
        marginBottom: 25
    },
    iconContainer: {
        backgroundColor: "#4689FD",
        padding: 5,
        borderRadius: 100,
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    nextIconContainer: {
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        padding: 5
    },
    text: {
        fontSize: 18,
        left: 20,
        marginRight: 'auto',
        fontWeight: '600'
    },
    inputBox: {
        backgroundColor: "#F7F7F9",
        padding: 20,
        marginHorizontal: 30,
        borderBottomColor: "#488DF4",
        borderBottomWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    disabledInput: {
        backgroundColor: "#CCCCCC",
        padding: 20,
        marginHorizontal: 30,
        marginBottom: 25,
        borderBottomColor: "#488DF4",
        borderBottomWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    errorMessage: {
        color: 'red',
        marginHorizontal: 35,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        top: 30,
        marginBottom: 60
    },
});
