import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get, putForm } from "../../../../functions/Fetch";
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from "react-native-dropdown-select-list";
import { PetType, ShelterLocation } from "../../../../interface/IPetType";
import { Checkbox } from "react-native-paper";
import { ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import * as FileSystem from 'expo-file-system';
import { ManageShelterUser, ShelterUser } from "../../../../interface/IShelter";

const editShelterFormSchema = z.object({
    ShelterName: z.string({ required_error: "Nama shelter tidak boleh kosong" }).min(1, { message: "Nama shelter tidak boleh kosong" }),
    ShelterLocation: z.string({ required_error: "Lokasi shelter tidak boleh kosong" }).min(10, { message: 'Lokasi shelter tidak boleh kosong' }),
    ShelterAddress: z.string({ required_error: "Alamat shelter tidak boleh kosong" }).min(1, { message: "Alamat shelter tidak boleh kosong" }),
    ShelterCapacity: z.number({ required_error: "Kapasitas shelter tidak boleh kosong" }).int().positive().nonnegative("Kapasitas shelter harus merupakan bilangan bulat positif"),
    ShelterContactNumber: z.string({ required_error: "Kontak shelter tidak boleh kosong" }),
    ShelterDescription: z.string({ required_error: 'Deskripsi shelter tidak boleh kosong' }),
    PetTypeAccepted: z.string().array().nonempty(),
    TotalPet: z.number({ required_error: "Total hewan tidak boleh kosong" }).nonnegative("Total hewan tidak boleh negatif"),
    BankAccountNumber: z.string({ required_error: 'Nomor rekening bank tidak boleh kosong' }).min(10, { message: 'Nomor rekening harus lebih dari 10 digit' }).refine(value => /^\d+$/.test(value), { message: "Nomor rekening harus berupa angka (0-9)" }),
    Pin: z.string({ required_error: "Pin tidak boleh kosong" }).min(6, { message: "Pin tidak boleh kurang dari 6 karakter" }).refine(value => /^\d+$/.test(value), { message: "Pin harus berupa angka (0-9)" }),
    // OldImage: z.array(z.string()).optional()
})

type CreateShelterFormType = z.infer<typeof editShelterFormSchema>

export const ManageShelterScreen: FC<ProfileNavigationStackScreenProps<'ManageShelterScreen'>> = ({ navigation }) => {
    const [image, setImage] = useState<string | null>(null);
    const [previousImage, setPreviousImage] = useState<string | null>('');
    const [selected, setSelected] = useState<string[]>();
    const [shelterLocation, setShelterLocation] = useState<ShelterLocation[]>([]);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const imgDir = FileSystem.documentDirectory + 'images/';
    const { control, setValue, handleSubmit, formState: { errors }, watch } = useForm<CreateShelterFormType>({
        resolver: zodResolver(editShelterFormSchema),
    });
    const [shelterUser, setShelterUser] = useState<ManageShelterUser>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(`${BackendApiUri.getUserShelter}`);
                setShelterUser(response.data.Data);
                setValue("ShelterName", response.data.Data.ShelterName)
                setValue("ShelterLocation", response.data.Data.ShelterLocation);
                setValue("ShelterAddress", response.data.Data.ShelterAddress)
                setValue("ShelterCapacity", response.data.Data.ShelterCapacity);
                setValue("ShelterContactNumber", response.data.Data.ShelterContactNumber);
                setValue("ShelterDescription", response.data.Data.ShelterDescription);
                setValue("TotalPet", response.data.Data.TotalPet);
                setValue("BankAccountNumber", response.data.Data.BankAccountNumber);
                setValue("Pin", response.data.Data.Pin);
                setSelected(response.data.Data.PetTypeAccepted)
            } catch (error) {
                console.error("Error fetching shelter data:", error);
            }
        };
        fetchData();
    }, []);
    const onSubmit = async (data: CreateShelterFormType) => {
        const formData = new FormData();
        if(image) {
            console.log("masuk imagee nih")
            const fileInfo = await FileSystem.getInfoAsync(image);
            formData.append('files', {
                uri: image,
                name: fileInfo.uri.split('/').pop(),
                type: 'image/jpeg'
            } as any); // You can also check and set the type dynamically based on file extension
        }
        const payload = {
            ShelterName: data.ShelterName,
            ShelterLocation: data.ShelterLocation,
            ShelterAddress: data.ShelterAddress,
            ShelterCapacity: data.ShelterCapacity,
            ShelterContactNumber: data.ShelterContactNumber,
            ShelterDescription: data.ShelterDescription,
            PetTypeAccepted: data.PetTypeAccepted,
            TotalPet: data.TotalPet,
            BankAccountNumber: data.BankAccountNumber,
            Pin: data.Pin,
            OldImage: image ? shelterUser?.ImagePath : [],
            ImagePath: !image ? shelterUser?.ImagePath : []
        }
        
        let payloadString = JSON.stringify(payload);

        formData.append('data', payloadString);
        // return;

        const res = await putForm(`${BackendApiUri.putShelterUpdate}`, formData);
        if(image){
            removeImage(image!)
        }
        if (res.status == 200) {
            Alert.alert('Shelter Berhasil Terupdate', 'Data shelter anda telah berhasil terupdate.', 
                [{ text: "OK", 
                    onPress: () => {
                        navigation.goBack() 
                    }}]);
        } else {
            Alert.alert('Shelter Gagal Update', 'Data shelter anda gagal terupdate.');
        }
    }

    const ensureDirExists = async () => {
        const dirInfo = await FileSystem.getInfoAsync(imgDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
        }
    }

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        await ensureDirExists();
        const files = await FileSystem.readDirectoryAsync(imgDir);
        if (files.length > 0) {
            setImage(imgDir + files[0]);
        }
    }

    const saveImage = async (uri: string) => {
        await ensureDirExists();
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const dest = imgDir + fileName;
        await FileSystem.copyAsync({ from: uri, to: dest });
        setPreviousImage(dest);
        setImage(dest);
    }
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
            if (previousImage) {
                removeImage(previousImage)
            }
            saveImage(result.assets[0].uri);
        }
        bottomSheetModalRef.current?.close();
    };

    const removeImage = async (imageUri: string) => {
        await FileSystem.deleteAsync(imageUri);
        setImage(null);
    }
    
    const handleImagePress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

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

    return (
        <SafeAreaProvider style={styles.container}>
            <SafeAreaView className="flex-1">
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
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
                        <View className="mt-5 flex-row items-center justify-center mb-3">
                            <Ionicons name="chevron-back" size={24} color="black" 
                                onPress={() => {
                                    if (image) {
                                        removeImage(image!);
                                    }
                                    navigation.goBack()
                                }} 
                                style={{ position: 'absolute', left: 20 }} 
                            />
                            <Text className="text-xl">Manage Shelter Profile</Text>
                        </View>

                        <ScrollView>
                            <View style={styles.rowContainer} className="justify-around mt-5 mb-5">
                                <TouchableOpacity
                                    style={{ width: 350, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={handleImagePress}
                                    disabled={image ? true : false}
                                >

                                    {image ? (
                                        <Image source={{ uri: image }} style={{ width: 350, height: 200, borderRadius: 10 }} />
                                    ) : shelterUser?.ImageBase64 ? (
                                        <Image source={{ uri: `data:image/*;base64,${shelterUser.ImageBase64}` }} style={{ width: 350, height: 200, borderRadius: 10 }} />
                                    ) :(
                                        <Ionicons name="camera" size={40} color="white" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.textColor}>Nama Shelter<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="ShelterName"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            placeholder="Masukkan Nama Shelter"
                                            style={{ flex: 1 }}
                                            onChangeText={(text: string) => setValue('ShelterName', text)}
                                            value={value}
                                        />
                                    )}
                                />
                            </View>
                            <Text style={styles.errorMessage}>{errors.ShelterName?.message}</Text>

                            <Text style={styles.textColor}>Lokasi Shelter<Text className='text-[#ff0000]'>*</Text></Text>
                            <Controller
                                name="ShelterLocation"
                                control={control}
                                render={({ field: { value } }) => (
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
                                        defaultOption={shelterLocationData.find(item => item.key === value)}
                                    />
                                )}
                            />
                            <Text style={styles.errorMessage}>{errors.ShelterLocation?.message}</Text>

                            <Text style={styles.textColor}>Alamat Shelter<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="ShelterAddress"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            placeholder="Masukkan Alamat Shelter"
                                            style={{ flex: 1 }}
                                            multiline
                                            onChangeText={(text: string) => setValue('ShelterAddress', text)}
                                            value={value}
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
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            style={{ flex: 1 }}
                                            placeholder="Kapasitas Shelter"
                                            onChangeText={(text: string) => {
                                                const numericValue = parseInt(text);
                                                if (!isNaN(numericValue)) {
                                                    setValue('ShelterCapacity', numericValue);
                                                }
                                            }}
                                            value={value?.toString()}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </View>
                            <Text style={styles.errorMessage}>{errors.ShelterCapacity?.message}</Text>

                            <Text style={styles.textColor}>Kontak Shelter<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="ShelterContactNumber"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            placeholder="Masukkan Kontak Shelter"
                                            style={{ flex: 1 }}
                                            onChangeText={(text: string) => setValue('ShelterContactNumber', text)}
                                            value={value}
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
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            style={{ flex: 1 }}
                                            placeholder="Total hewan"
                                            editable={false}
                                            value={value?.toString()}
                                            keyboardType="numeric"
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
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            placeholder="Masukkan Nomor Rekening"
                                            style={{ flex: 1 }}
                                            onChangeText={(text: string) => setValue('BankAccountNumber', text)}
                                            value={value}
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
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            placeholder="Masukkan Deskripsi Shelter"
                                            style={{ flex: 1 }}
                                            multiline
                                            onChangeText={(text: string) => setValue('ShelterDescription', text)}
                                            value={value}
                                        />
                                    )}
                                />
                            </View>
                            <Text style={styles.errorMessage}>{errors.ShelterDescription?.message}</Text>

                            <Text style={styles.textColor}>Jenis Hewan Shelter<Text className='text-[#ff0000]'>*</Text></Text>
                            <Controller
                                name="PetTypeAccepted"
                                control={control}
                                render={({ field: { value } }) => (
                                    <View style={{ marginHorizontal: 35 }}>
                                        {petTypeData.map((petType) => (
                                            <View key={petType.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Checkbox
                                                    status={selected?.includes(petType.key) ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        setSelected(prevSelected => {
                                                            if (prevSelected && prevSelected.includes(petType.key)) {
                                                                return prevSelected.filter(item => item !== petType.key);
                                                            } else {
                                                                return [...(prevSelected || []), petType.key];
                                                            }
                                                        });
                                                    }}
                                                />
                                                <Text>{petType.value}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            />
                            <Text style={styles.errorMessage}>{errors.PetTypeAccepted?.message}</Text>

                            <Text style={styles.textColor}>Pin Shelter<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="Pin"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <TextInput
                                            placeholder="Masukkan Pin"
                                            style={{ flex: 1 }}
                                            onChangeText={(text: string) => setValue('Pin', text)}
                                            value={value}
                                        />
                                    )}
                                />
                            </View>
                            <Text style={styles.errorMessage}>{errors.Pin?.message}</Text>

                            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                                <Text className="text-center font-bold text-white">Save</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>

            </SafeAreaView>
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
    textColor: {
        color: '#4689FD',
        fontSize: 18,
        marginHorizontal: 35,
        marginBottom: 5
    },
    selectBox: {
        marginTop: 5,
        marginHorizontal: 30,
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row'
    },
    petTypeButton: {
        borderColor: '#488DF4',
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        marginRight: 10
    }
});
