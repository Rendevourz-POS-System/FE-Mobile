import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Image, BackHandler } from "react-native";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { MultipleSelectList, SelectList } from "react-native-dropdown-select-list";
import { BackendApiUri, baseUrl } from "../functions/BackendApiUri";
import { get, post, postForm } from "../functions/Fetch";
import { PetType, ShelterLocation } from "../interface/IPetType";
import * as ImagePicker from 'expo-image-picker';
import { ProfileRootBottomTabCompositeScreenProps, RootBottomTabCompositeNavigationProp } from "./navigations/CompositeNavigationProps";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../app/context/AuthContext";
import * as FileSystem from 'expo-file-system';
import { ProfileNavigationStackParams } from "./navigations/Profile/ProfileNavigationStackParams";
import { RootNavigationStackParams } from "./navigations/Root/AppNavigationStackParams";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const createShelterFormSchema = z.object({
    ShelterName: z.string({ required_error: "Nama shelter tidak boleh kosong" }).min(1, { message: "Nama shelter tidak boleh kosong" }),
    ShelterLocation: z.string({ required_error: "Lokasi shelter tidak boleh kosong" }).min(10, { message: 'Lokasi shelter tidak boleh kosong' }),
    ShelterAddress: z.string({ required_error: "Alamat shelter tidak boleh kosong" }).min(1, { message: "Alamat shelter tidak boleh kosong" }),
    ShelterCapacity: z.number({ required_error: "Kapasitas shelter tidak boleh kosong" }).int().positive().nonnegative("Kapasitas shelter harus merupakan bilangan bulat positif"),
    ShelterContactNumber: z.string({ required_error: "Kontak shelter tidak boleh kosong" }),
    ShelterDescription: z.string({ required_error: 'Deskripsi shelter tidak boleh kosong' }),
    PetTypeAccepted: z.string().array().nonempty(),
    TotalPet: z.number({ required_error: "Total hewan tidak boleh kosong" }).int().positive().nonnegative("Total hewan harus merupakan bilangan bulat positif"),
    BankAccountNumber: z.string({ required_error: 'Nomor rekening bank tidak boleh kosong' }).min(10, { message: 'Nomor rekening harus lebih dari 10 digit' }).refine(value => /^\d+$/.test(value), { message: "Nomor rekening harus berupa angka (0-9)" }),
    Pin: z.string({ required_error: "Pin tidak boleh kosong" }).min(6, { message: "Pin tidak boleh kurang dari 6 karakter" }).refine(value => /^\d+$/.test(value), { message: "Pin harus berupa angka (0-9)" }),
})

type CreateShelterFormType = z.infer<typeof createShelterFormSchema>

export const CreateShelter = () => {
    const navigate = useNavigation();
    const { authState } = useAuth();
    const [inputValue, setInputValue] = useState<number | undefined>(undefined);
    const [inputTotalPetValue, setInputTotalPetValue] = useState<number | undefined>(undefined);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [shelterLocation, setShelterLocation] = useState<ShelterLocation[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const imgDir = FileSystem.documentDirectory + 'images/';
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { control, handleSubmit, setValue, watch , reset,  formState: { errors } } = useForm<CreateShelterFormType>({
        resolver: zodResolver(createShelterFormSchema),
        defaultValues: {
            PetTypeAccepted: [],
        },
    });

    const ensureDirExists = async () => {
        const dirInfo = await FileSystem.getInfoAsync(imgDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
        }
    }
    const fetchPetType = async () => {
        const res = await get(BackendApiUri.getPetTypes);
        setPetTypes(res.data)
    }

    const fetchShelterLocation = async () => {
        const res = await get(BackendApiUri.getLocation);
        setShelterLocation(res.data)
    }

    const petTypeData = petTypes.map((item) => ({
        key: item.Id,
        value: item.Type,
    }));

    const shelterLocationData = shelterLocation.map((item) => ({
        key: item.Id,
        value: item.LocationName,
    }));

    useEffect(() => {
        fetchPetType();
        fetchShelterLocation();
    }, []);

    useEffect(() => {
        if (selected && selected.length > 0) {
            const selectedValue: [string, ...string[]] = [selected[0], ...selected.slice(1)];
            setValue('PetTypeAccepted', selectedValue);
        }
    }, [selected, setValue]);

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

    const saveImage = async (uri: string) => {
        await ensureDirExists();
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const dest = imgDir + fileName;
        await FileSystem.copyAsync({ from: uri, to: dest });
        setImage(dest);
    }

    const formatContactNumber = (contactNumber: string) => {
        if (contactNumber.startsWith('0')) {
            return '+62' + contactNumber.slice(1);
        }
        return contactNumber;
    };
    const onSubmit = async (data: CreateShelterFormType) => {
        data.ShelterContactNumber = formatContactNumber(data.ShelterContactNumber);
        const formData = new FormData();

        // Add image file
        if (image) {
            const fileInfo = await FileSystem.getInfoAsync(image);
            formData.append('files', {
                uri: image,
                name: fileInfo.uri.split('/').pop(),
                type: 'image/jpeg'
            } as any); // You can also check and set the type dynamically based on file extension
        }

        formData.append('data', JSON.stringify(data));

        const res = await fetch(`${baseUrl}/shelter/register`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authState?.token}`,
            }
        }).then(response => {
            if(image) {
                removeImage(image!);
            }
            if(response.status === 200) {
                Alert.alert("Pet Created", "Pet Berhasil dibuat", [ { text: "OK", onPress: () => navigate.goBack()}]);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const removeImage = async (imageUri: string) => {
        await FileSystem.deleteAsync(imageUri);
        setImage(null);
    }

    const handleImagePress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    return (
        <ScrollView className="">
            {image && (
                <View className="items-end mx-5 ">
                    <TouchableOpacity className="flex-row items-center" onPress={() => removeImage(image)}>
                        <Ionicons name="trash" size={20} color="black" />
                        <Text className="text-xs">Hapus Gambar</Text>
                    </TouchableOpacity>
                </View>
            )}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={['27%%']}
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
            <View className="items-center">
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 350 }}>
                    {image == null && (
                        <>
                            <TouchableOpacity
                                style={{ width: 350, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}
                                onPress={handleImagePress}
                            >
                            <Ionicons name="camera" size={40} color="white" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                {image && (
                    <Image source={{ uri: image }} style={{ width: 350, height: 200, borderRadius: 10 }} resizeMode="cover" />
                )}
            </View>

            <Text style={styles.textColor} className="mt-5">Nama Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="ShelterName"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Nama Shelter"
                            style={{ flex: 1 }}
                            onChangeText={(text: string) => setValue('ShelterName', text)}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.ShelterName?.message}</Text>

            <Text style={styles.textColor}>Lokasi Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <Controller
                name="ShelterLocation"
                control={control}
                render={() => (
                    <SelectList
                        setSelected={(text: string) => setValue('ShelterLocation', text)}
                        data={shelterLocationData}
                        save="key"
                        search={true}
                        dropdownStyles={styles.inputBox}
                        boxStyles={styles.selectBox}
                        inputStyles={{ padding: 3 }}
                        arrowicon={<FontAwesome name="chevron-down" size={12} color={'#808080'} style={{ padding: 3 }} />}
                        placeholder="Masukkan Lokasi Shelter"
                    />
                )}
            />
            <Text style={styles.errorMessage}>{errors.ShelterLocation?.message}</Text>

            <Text style={styles.textColor}>Alamat Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="ShelterAddress"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Alamat Shelter"
                            style={{ flex: 1 }}
                            multiline
                            onChangeText={(text: string) => setValue('ShelterAddress', text)}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.ShelterAddress?.message}</Text>

            <Text style={styles.textColor}>Kapasitas Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="ShelterCapacity"
                    control={control}
                    render={() => (
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="Masukkan Kapasitas Shelter"
                            keyboardType="numeric"
                            value={inputValue?.toString() ?? ''}
                            onChangeText={(text) => {
                                const numericValue = parseFloat(text);
                                if (!isNaN(numericValue)) {
                                    setInputValue(numericValue);
                                    setValue("ShelterCapacity", numericValue)
                                }
                            }}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.ShelterCapacity?.message}</Text>

            <Text style={styles.textColor}>Kontak Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Text className="mr-2">+62</Text>
                <Controller
                    name="ShelterContactNumber"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Masukkan Kontak Shelter"
                            style={{ flex: 1 }}
                            keyboardType="phone-pad"
                            onChangeText={(text) => setValue('ShelterContactNumber', text)}
                            value={value} // Show the number without +62 prefix
                            maxLength={12}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.ShelterContactNumber?.message}</Text>


            <Text style={styles.textColor}>Total Hewan Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="TotalPet"
                    control={control}
                    render={() => (
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="Masukkan Total Hewan Shelter"
                            keyboardType="numeric"
                            value={inputTotalPetValue?.toString() ?? ''}
                            onChangeText={(text) => {
                                const numericValue = parseFloat(text);
                                if (!isNaN(numericValue)) {
                                    setInputTotalPetValue(numericValue);
                                    setValue("TotalPet", numericValue)
                                }
                            }}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.TotalPet?.message}</Text>

            <Text style={styles.textColor}>Nomor Rekening Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="BankAccountNumber"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Nomor Rekening"
                            style={{ flex: 1 }}
                            onChangeText={(text: string) => setValue('BankAccountNumber', text)}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.BankAccountNumber?.message}</Text>

            <Text style={styles.textColor}>Deskripsi Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="ShelterDescription"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Deskripsi Shelter"
                            style={{ flex: 1 }}
                            multiline
                            onChangeText={(text: string) => setValue('ShelterDescription', text)}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.ShelterDescription?.message}</Text>

            <Text style={styles.textColor}>Jenis Hewan Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <Controller
                name="PetTypeAccepted"
                control={control}
                render={() => (
                    <MultipleSelectList
                        setSelected={setSelected}
                        data={petTypeData}
                        save="key"
                        dropdownStyles={styles.inputBox}
                        boxStyles={styles.selectBox}
                        inputStyles={{ padding: 3 }}
                        arrowicon={<FontAwesome name="chevron-down" size={12} color={'#808080'} style={{ padding: 3 }} />}
                        label="Jenis Hewan"
                    />
                )}
            />
            <Text style={styles.errorMessage}>{errors.PetTypeAccepted?.message}</Text>

            <Text style={styles.textColor}>Pin Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="Pin"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Pin"
                            style={{ flex: 1 }}
                            onChangeText={(text: string) => setValue('Pin', text)}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.Pin?.message}</Text>

            <TouchableOpacity style={[styles.button]} onPress={handleSubmit(onSubmit)}>
                <Text className="text-center font-bold text-white ">Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    nextIconContainer: {
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        padding: 5
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
        flexDirection: 'row',
        alignItems : 'center'
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
        marginBottom: 80
    },
    selectBox: {
        marginTop: 5,
        marginHorizontal: 30,
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row'
    },
    imageBox: {
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
        marginHorizontal: 30,
        width: 150
    },
});
