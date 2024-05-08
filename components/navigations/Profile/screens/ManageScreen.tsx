import { Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { FontAwesome6 } from '@expo/vector-icons';
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get, put } from "../../../../functions/Fetch";
import * as ImagePicker from 'expo-image-picker';

interface User {
    Username: string,
    Email: string;
    Address: string,
    State: string,
    City: string,
    Nik: string,
    PhoneNumber: string,
    District: string,
    PostalCode: number,
    Province: string,
}

const profileFormSchema = z.object({
    Username: z.string({ required_error: "Username tidak boleh kosong" }).min(1, { message: "Username tidak boleh kosong" }),
    Email: z.string({ required_error: "Email tidak boleh kosong" }).min(1, { message: "Email tidak boleh kosong" }),
    Nik: z.string({ required_error: "NIK tidak boleh kosong" }).regex(/^\d{16}$/, { message: "Format NIK tidak valid" }),
    PhoneNumber: z.string({ required_error: "Nomor telepon tidak boleh kosong" }).min(1, { message: "Nomor Telepon tidak boleh kosong" }).refine(value => /^\d+$/.test(value), { message: "Nomor telepon harus berupa angka (0-9)" }),
    Address: z.string({ required_error: "Alamat tidak boleh kosong" }).min(1, { message: "Alamat tidak boleh kosong" }),
    State: z.string({ required_error: "Negara tidak boleh kosong" }).min(1, { message: "Negara tidak boleh kosong" }),
    City: z.string({ required_error: "Kabupaten/Kota tidak boleh kosong" }).min(1, { message: "Kabupaten/Kota tidak boleh kosong" }),
    District: z.string({ required_error: "Daerah tidak boleh kosong" }).min(1, { message: "Daerah tidak boleh kosong" }),
    Province: z.string({ required_error: "Provinsi tidak boleh kosong" }).min(1, { message: "Provinsi tidak boleh kosong" }),
    PostalCode: z.number({ required_error: 'Kode pos tidak boleh kosong' }),
})

type ProfileFormType = z.infer<typeof profileFormSchema>

export const ManageScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ManageScreen'>> = ({ navigation }) => {
    const [userData, setUserData] = useState<User>();
    const [image, setImage] = useState('');

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(`${BackendApiUri.getUserData}`);
                setUserData(response.data);
                setValue("Username", response.data?.Username);
                setValue("Email", response.data?.Email);
                setValue("Nik", response.data?.Nik);
                setValue("PhoneNumber", response.data?.PhoneNumber);
                setValue("Address", response.data?.Address);
                setValue("State", response.data?.State);
                setValue("City", response.data?.City);
                setValue("District", response.data?.District);
                setValue("Province", response.data?.Province);
                setValue("PostalCode", response.data?.PostalCode);
            } catch (error) {
                console.error("Error fetching shelter data:", error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: ProfileFormType) => {
        const payload = {
            Nik: data.Nik,
            PhoneNumber: data.PhoneNumber,
            Address: data.Address,
            State: data.State,
            District: data.District,
            City: data.City,
            PostalCode: data.PostalCode,
            Province: data.Province,
            Email: userData?.Email,
            Username: userData?.Username,
        }
        await put(`${BackendApiUri.putUserUpdate}`, payload);
        Alert.alert('Data Tersimpan', 'Data anda telah tersimpan.');
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Manage Profile</Text>
            </View>

            <ScrollView>
                <View className="mb-10 mt-10">
                    <View style={styles.rowContainer} className="justify-around">
                        <TouchableOpacity
                            style={{ width: 100, height: 100, backgroundColor: '#2E3A59', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
                            onPress={pickImage}
                            disabled={image ? true : false}
                        >
                            {image ? (
                                <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />)
                                :
                                (<Ionicons name="camera" size={40} color="white" />
                                )}
                        </TouchableOpacity>
                        <Text className="top-5 text-3xl">{userData?.Username}</Text>
                    </View>
                </View>

                <View style={styles.inputBox}>
                    <Controller
                        name="Username"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Username"
                                onChangeText={(text: string) => setValue('Username', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.Username?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="Email"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Email"
                                onChangeText={(text: string) => setValue('Email', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.Nik?.message}</Text>

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
                        name="State"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Negara"
                                onChangeText={(text: string) => setValue('State', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.State?.message}</Text>

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
                        name="District"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Daerah"
                                onChangeText={(text: string) => setValue('District', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.District?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="Province"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Provinsi"
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
    passwordToggleIcon: {
        flexDirection: 'row',
        top: 5,
    },
});
