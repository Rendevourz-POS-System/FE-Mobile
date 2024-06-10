import { Ionicons } from "@expo/vector-icons";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { FontAwesome6 } from '@expo/vector-icons';
import { BackendApiUri, baseUrl } from "../../../../functions/BackendApiUri";
import { get } from "../../../../functions/Fetch";
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import * as FileSystem from 'expo-file-system';
import { useAuth } from "../../../../app/context/AuthContext";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

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
    Image: string,
    ImageBase64: []
}

const profileFormSchema = z.object({
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

type ProfileFormType = z.infer<typeof profileFormSchema>

export const ManageScreen: FC<ProfileNavigationStackScreenProps<'ManageScreen'>> = ({ navigation }) => {
    const [userData, setUserData] = useState<User>();
    const [image, setImage] = useState<string | null>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema),
    });
    const imgDir = FileSystem.documentDirectory + 'images/';
    const { authState } = useAuth();

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

    const removeImage = async (imageUri: string) => {
        await FileSystem.deleteAsync(imageUri);
        setImage(null);
    }

    const onSubmit = async (data: ProfileFormType) => {
        // data.OldImageName = userData?.Image ?? '';
        let payloadString = JSON.stringify(data);
        
        const formData = new FormData();
        // Add image file
        if (image) {
            const fileInfo = await FileSystem.getInfoAsync(image);
            formData.append('file', {
                uri: image,
                name: fileInfo.uri.split('/').pop(),
                type: 'image/jpeg',
            } as any); // You can also check and set the type dynamically based on file extension
        }

        formData.append('data', payloadString);
        const res = await fetch(`${baseUrl}/user/update`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authState?.token}`,
            }
        }).then(response => {
            if(image) {
                removeImage(image!);
            }
            if (response.status === 200) {
                Alert.alert(
                    'Data Tersimpan',
                    'Data anda telah tersimpan.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ],
                    { cancelable: false }
                );
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const handleImagePress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const selectImage = async (useLibrary : boolean) => {
        let result;
        const options : ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
        }

        if (useLibrary) {
            result = await ImagePicker.launchImageLibraryAsync(options);
        } else {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync(options);
        }

        if (!result.canceled) {
            saveImage(result.assets[0].uri);
        }
        bottomSheetModalRef.current?.close();
    };

    const ensureDirExists = async () => {
        const dirInfo = await FileSystem.getInfoAsync(imgDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
        }
    }

    const saveImage = async (uri: string) => {
        await ensureDirExists();
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const dest = imgDir + fileName;
        await FileSystem.copyAsync({ from: uri, to: dest });
        setImage(dest);
    }
    
    return (
        <SafeAreaProvider style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <View className="mt-5 flex-row items-center justify-center mb-3">
                        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                        <Text className="text-xl">Manage Profile</Text>
                    </View>

                    <ScrollView>
                        <View className="mb-10 mt-10">
                            <View style={styles.rowContainer} className="justify-around">
                            <BottomSheetModal
                                ref={bottomSheetModalRef}
                                index={0}
                                snapPoints={['20%']}
                                backdropComponent={(props) => (
                                    <BottomSheetBackdrop
                                        {...props}
                                        disappearsOnIndex={-1}
                                        appearsOnIndex={0}
                                        pressBehavior="close"
                                    />
                                )}
                            >
                                <BottomSheetView className="flex items-center justify-center">
                                    <View className="flex flex-col items-center">
                                        <TouchableOpacity className="py-4" onPress={() => selectImage(true)}>
                                            <Text className="text-lg ">Choose Photo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="py-4" onPress={() => selectImage(false)}>
                                            <Text className="text-lg ">Take Photo</Text>
                                        </TouchableOpacity>
                                    </View>
                                </BottomSheetView>
                            </BottomSheetModal>
                                <TouchableOpacity
                                    style={{ width: 100, height: 100, backgroundColor: '#2E3A59', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={handleImagePress}
                                >
                                    {image ? (
                                        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                    ) : userData?.ImageBase64 ? (
                                        <Image source={{ uri: `data:image/*;base64,${userData.ImageBase64}` }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                    ) : (
                                        <Ionicons name="camera" size={40} color="white" />
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
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
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
