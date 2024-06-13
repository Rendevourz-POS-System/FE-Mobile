import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { IUser } from '../../../../interface/IUser';
import { get } from '../../../../functions/Fetch';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { AdminNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';
import { Avatar } from 'react-native-elements';

const editUserFormSchema = z.object({
    Username: z.string({ required_error: "Username tidak boleh kosong" }).min(1, { message: "Username tidak boleh kosong" }),
    Email: z.string({ required_error: "Email tidak boleh kosong" }).min(1, { message: "Email tidak boleh kosong" }),
    Nik: z.string({ required_error: "NIK tidak boleh kosong" }),
    PhoneNumber: z.string({ required_error: "Nomor telepon tidak boleh kosong" }).min(1, { message: "Nomor Telepon tidak boleh kosong" }).refine(value => /^\d+$/.test(value), { message: "Nomor telepon harus berupa angka (0-9)" }),
    Address: z.string({ required_error: "Alamat tidak boleh kosong" }).min(1, { message: "Alamat tidak boleh kosong" }),
    State: z.string({ required_error: "Negara tidak boleh kosong" }).min(1, { message: "Negara tidak boleh kosong" }),
    City: z.string({ required_error: "Kabupaten/Kota tidak boleh kosong" }).min(1, { message: "Kabupaten/Kota tidak boleh kosong" }),
    District: z.string({ required_error: "Daerah tidak boleh kosong" }).min(1, { message: "Daerah tidak boleh kosong" }),
    Province: z.string({ required_error: "Provinsi tidak boleh kosong" }).min(1, { message: "Provinsi tidak boleh kosong" }),
    PostalCode: z.number({ required_error: 'Kode pos tidak boleh kosong' }),
})

type EditUserFormType = z.infer<typeof editUserFormSchema>

export const EditUserScreen: FC<AdminNavigationStackScreenProps<'EditUserScreen'>> = ({ navigation, route }: any) => {
    const [userData, setUserData] = useState<IUser>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<EditUserFormType>({
        resolver: zodResolver(editUserFormSchema),
    });

    useEffect(() => {
        fetchUser();
    }, [route.params.userId])

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const response = await get(`${BackendApiUri.getAdminUserDetails}/${route.params.userId}`);
            if (response && response.status === 200) {
                setUserData(response.data);
                setValue("Username", response.data.Username);
                setValue("Email", response.data.Email);
                setValue("Nik", response.data.Nik);
                setValue("PhoneNumber", response.data.PhoneNumber);
                setValue("Address", response.data.Address);
                setValue("State", response.data.State);
                setValue("District", response.data.District);
                setValue("Province", response.data.Province);
                setValue("PostalCode", response.data.PostalCode)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: EditUserFormType) => {
        let payloadString = JSON.stringify(data);
    }

    return (
        <SafeAreaProvider className='flex-1'>
            <View className="mt-5 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Edit User</Text>
            </View>
            <ScrollView>
                <View className="mb-10 mt-10">
                    <View className='flex items-center justify-center'>
                        <Avatar
                            size={130}
                            rounded
                            source={userData?.ImageBase64 ? { uri: `data:image/*;base64,${userData.ImageBase64}` } : require('../../../../assets/Default_Acc.jpg')}
                        />
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

                </View>
                <Text style={styles.errorMessage}>{errors.Email?.message}</Text>

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
                </View>
                <Text style={styles.errorMessage}>{errors.State?.message}</Text>

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
                </View>
                <Text style={styles.errorMessage}>{errors.Province?.message}</Text>

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
                </View>
                <Text style={styles.errorMessage}>{errors.District?.message}</Text>

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
                </View>
                <Text style={styles.errorMessage}>{errors.PostalCode?.message}</Text>

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text className="text-center font-bold text-white">Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaProvider>
    )
};

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
