import { FC, useCallback, useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { RadioButton } from "react-native-paper";
import { PetType } from "../../../../interface/IPetType";
import { deletesBody, get, putForm } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { SelectList } from "react-native-dropdown-select-list";
import { PetData } from "../../../../interface/IPetList";
import { AdminNavigationStackScreenProps, ProfileNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../../../app/context/AuthContext";
import { Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

interface PetProps {
    Data: PetData
}

const editPetFormSchema = z.object({
    PetName: z.string({ required_error: "Nama hewan tidak boleh kosong" }).min(1, { message: "Nama hewan tidak boleh kosong" }),
    PetType: z.string({ required_error: "Jenis hewan tidak boleh kosong" }).min(1, { message: 'Jenis hewan tidak boleh kosong' }),
    PetAge: z.number({ required_error: "Umur hewan tidak boleh kosong" }).int().positive().nonnegative("Umur hewan harus merupakan bilangan bulat positif"),
    PetGender: z.string({ required_error: "Jenis kelamin hewan tidak boleh kosong" }),
    IsVaccinated: z.string({ required_error: "Vaksinasi hewan tidak boleh kosong" }),
    PetDescription: z.string({ required_error: "Deskripsi hewan tidak boleh kosong" }),
    ReadyToAdopt : z.boolean({ required_error: "Tidak boleh kosong" })
})

type EditPetFormType = z.infer<typeof editPetFormSchema>

export const ManagePetScreen: FC<ProfileNavigationStackScreenProps<"ManagePetScreen">> = ({ navigation, route }: any) => {
    const { authState } = useAuth();
    const [petData, setPetData] = useState<PetProps>();
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [petImage, setPetImage] = useState<string | null>();
    const [image, setImage] = useState<string | null>(null);
    const [previousImage, setPreviousImage] = useState<string | null>('');
    const imgDir = FileSystem.documentDirectory + 'images/';
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { control, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm<EditPetFormType>({
        resolver: zodResolver(editPetFormSchema),
    });

    useFocusEffect( 
        useCallback(() => {
            const fetch = async () => {
                await fetchPetType();
                await fetchPet();
            }
            fetch();
        }, [navigation, route])
    )
    // useEffect(() => {
    //     fetchPetType();
    //     fetchPet();
    // }, [navigation, route])

    useEffect(() => {
        if (petTypes.length > 0 && petData) {
            const selectedPetType = petTypeData.find(item => item.value == petData.Data.PetType);
            setValue("PetType", selectedPetType ? selectedPetType.value : '');
        }
    }, [petTypes, petData]);

    const fetchPet = async () => {
        try {
            const response = await get(`${BackendApiUri.getPet}/${route.params.petId}`);
            if (response && response.status === 200) {
                loadImages();
                setPetData(response.data);
                setValue("PetName", response.data.Data.PetName);
                // console.log("AS ", petTypeData.find(item => item.value == response.data.Data.PetType));
                // const selectedPetType = await petTypeData.find(item => item.value == response.data.Data.PetType);
                // setValue("PetType", selectedPetType ? selectedPetType.value : '');
                // console.log(watch("PetType"))
                // if(selectedPetType) {
                //     setValue("PetType", selectedPetType.value);
                //     console.log("sesudah ", watch("PetType"))
                // }
                setValue("PetAge", response.data.Data.PetAge);
                setValue("PetGender", response.data.Data.PetGender);
                if (response.data.Data.IsVaccinated == true) {
                    setValue("IsVaccinated", "true");
                } else {
                    setValue("IsVaccinated", "false")
                }
                setValue("PetDescription", response.data.Data.PetDescription);
                setValue("ReadyToAdopt", response.data.Data.ReadyToAdopt);
                setPetImage(response.data.Data.ImageBase64);
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e)
        }
    };

    const fetchPetType = async () => {
        const res = await get(BackendApiUri.getPetTypes);
        setPetTypes(res.data)
    }

    const petTypeData = petTypes.map((item) => ({
        key: item.Id,
        value: item.Type,
    }));

    const onSubmit = async (data: EditPetFormType) => {
        const payload = {
            Id: route.params.petId,
            ShelterId: petData?.Data.ShelterId,
            PetName: data.PetName,
            PetAge: data.PetAge,
            PetType: data.PetType,
            PetGender: data.PetGender,
            IsVaccinated: data.IsVaccinated == "true" ? true : false,
            PetDescription: data.PetDescription,
            OldImage: petData?.Data.OldImage,
            ReadyToAdopt : data.ReadyToAdopt
        }
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

        formData.append('data', JSON.stringify(payload));
        // const bodyPutAdopt = {
        //     Id: route.params.petId,
            
        // }
        // const response = await putForm(`${BackendApiUri.putPetStatusAdopt}`, );
        // return;
        const res = await putForm(`${BackendApiUri.putPetUpdate}`, formData);
        if (res.status == 200) {
            Alert.alert('Pet Berhasil Terupdate', 'Data pet anda telah berhasil terupdate.', [{ text: "OK", onPress: () => navigation.goBack() }]);
        } else {
            Alert.alert('Pet Gagal Update', 'Data pet anda gagal terupdate.');
        }
    }

    const selectImage = async (useLibrary: boolean) => {
        let result;
        const options: ImagePicker.ImagePickerOptions = {
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
        setPreviousImage(dest);
        setImage(dest);
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

    const removeImage = async (imageUri: string) => {
        await FileSystem.deleteAsync(imageUri);
        setImage(null);
        setPetImage(null);
    }

    const removeShelterImage = async (imageUri: string) => {
        setPetImage(null);
    }
    
    const handleDelete = async() => {
        const payload = {
            ShelterId: petData?.Data.ShelterId,
            PetId: [`${route.params.petId}`],
            UserId: authState?.userId
        }
        Alert.alert(`Apakah Anda Yakin ingin menghapus ${petData?.Data.PetName}`, '', [
            {
                text: 'Batal',
                onPress: () => navigation.goBack(),
                style: 'cancel',
            },
            {
                text: 'Ya', onPress: async () => {
                    // setIsLoading(true)
                    try {
                        const response = await deletesBody(BackendApiUri.deletePet, payload);
                        if (response) {
                            Alert.alert(`Anda berhasil menghapus ${petData?.Data.PetName}`, "", [ { text: "OK", onPress: () => navigation.goBack()}])
                        }
                    } catch (e) {
                        Alert.alert(`Anda gagal menghapus ${petData?.Data.PetName}`)
                    } finally {
                        // setIsLoading(false);
                    }
                }
            },
        ]);
    }
    
    return (
        <SafeAreaProvider className="bg-white">
            <View className="mt-5 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" 
                onPress={() => {
                    if(image) {
                        removeImage(image!);
                    }
                    navigation.goBack()
                }} 
                style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Edit</Text>
            </View>

            <ScrollView className="mt-5">
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#4689FD" />
                    </View>
                ) : (
                    <>

                        {(petImage) ? (
                            <View className="items-end mx-10">
                                <TouchableOpacity className="flex-row items-center" 
                                onPress={() => {
                                    setPetImage(null)
                                }}
                            >
                                    <Ionicons name="trash" size={20} color="black" />
                                    <Text className="text-xs">Hapus Gambar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                {image && (
                                    <View className="items-end mx-10">
                                        <TouchableOpacity className="flex-row items-center" onPress={() => removeImage(image)}>
                                            <Ionicons name="trash" size={20} color="black" />
                                            <Text className="text-xs">Hapus Gambar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                        <View className="items-center mb-5">
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 350 }}>
                                {petImage == null && image == null && (
                                    <>
                                        <TouchableOpacity
                                            style={{ width: 170, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}
                                            onPress={() => selectImage(true)}
                                        >
                                            <Ionicons name="images" size={40} color="white" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ width: 170, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}
                                            onPress={() => selectImage(false)}
                                        >
                                            <Ionicons name="camera" size={40} color="white" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                            {(petImage) ? (
                                <Image source={{ uri: `data:image/*;base64,${petImage}` }} style={{ width: 350, height: 200, borderRadius: 10 }} resizeMode="cover" />
                            ) : (
                                <>
                                    {(image) && (
                                        <Image source={{ uri: image }} style={{ width: 350, height: 200, borderRadius: 10 }} resizeMode="cover" />
                                    )}
                                </>
                            )}
                        </View>

                        <Text style={styles.textColor}>Nama Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={styles.inputBox}>
                            <Controller
                                name="PetName"
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextInput
                                        placeholder="Masukkan Nama Hewan"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('PetName', text)}
                                        value={value}
                                    />
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.PetName?.message}</Text>

                        <Text style={styles.textColor}>Jenis Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <Controller
                            name="PetType"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <>
                                {/* {console.log(value)} */}
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(itemValue) => setValue('PetType', itemValue)}
                                    style={styles.inputBox}
                                >
                                    {petTypeData.map((item) => (
                                        <Picker.Item key={item.key} label={item.value} value={item.value} />
                                    ))}
                                </Picker>
                                </>
                            )}
                        />
                        <Text style={styles.errorMessage}>{errors.PetType?.message}</Text>

                        <Text style={styles.textColor}>Umur Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={styles.inputBox}>
                            <Controller
                                name="PetAge"
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextInput
                                        style={{ flex: 1 }}
                                        placeholder="Masukkan Umur Hewan"
                                        onChangeText={(text: string) => {
                                            const numericValue = parseInt(text);
                                            if (!isNaN(numericValue)) {
                                                setValue('PetAge', numericValue);
                                            }
                                        }}
                                        keyboardType="numeric"
                                        value={value?.toString()}
                                    />
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.PetAge?.message}</Text>

                        <Text style={styles.textColor}>Jenis Kelamin Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={{ marginHorizontal: 30 }}>
                            <Controller
                                name="PetGender"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <RadioButton.Group onValueChange={onChange} value={value} >
                                        <View className="flex flex-row">
                                            <View className="flex-row justify-start items-center mr-5">
                                                <RadioButton.Android value="Male" color={'#4689FD'} uncheckedColor="#808080" />
                                                <Text className="text-base text-[#808080]">Laki-Laki</Text>
                                            </View>
                                            <View className="flex-row justify-start items-center">
                                                <RadioButton.Android value="Female" color={'#4689FD'} uncheckedColor="#808080" />
                                                <Text className="text-base text-[#808080]">Perempuan</Text>
                                            </View>
                                        </View>
                                    </RadioButton.Group>
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.PetGender?.message}</Text>

                        <Text style={styles.textColor}>Vaksinasi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={{ marginHorizontal: 30 }}>
                            <Controller
                                name="IsVaccinated"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <RadioButton.Group onValueChange={onChange} value={value} >
                                        <View className="flex flex-row">
                                            <View className="flex-row justify-start items-center mr-5">
                                                <RadioButton.Android value="true" color={'#4689FD'} uncheckedColor="#808080" />
                                                <Text className="text-base text-[#808080]">Sudah</Text>
                                            </View>
                                            <View className="flex-row justify-start items-center">
                                                <RadioButton.Android value="false" color={'#4689FD'} uncheckedColor="#808080" />
                                                <Text className="text-base text-[#808080]">Belum</Text>
                                            </View>
                                        </View>
                                    </RadioButton.Group>
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.IsVaccinated?.message}</Text>

                        <View className="mb-5">
                            <Text className="mb-1 ml-8 text-base text-[18px] text-blue-500">Status Siap Adopsi<Text className='text-[#ff0000]'>*</Text></Text>
                            <Controller
                                control={control}
                                name="ReadyToAdopt"
                                render={({ field: { onChange, value } }) => (
                                    <Picker
                                        selectedValue={value}
                                        onValueChange={onChange}
                                        style={styles.inputBox}
                                    >
                                        <Picker.Item label="Siap Diadopsi" value={true}/>
                                        <Picker.Item label="Belum Siap Diadopsi" value={false} />
                                    </Picker>
                                )}
                            />
                            {errors.ReadyToAdopt && <Text className="text-red-500">{errors.ReadyToAdopt.message}</Text>}
                        </View>

                        <Text style={styles.textColor}>Deskripsi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={styles.inputBox}>
                            <Controller
                                name="PetDescription"
                                control={control}
                                render={({ field: { value } }) => (
                                    <TextInput
                                        placeholder="Masukkan Deskripsi Hewan"
                                        style={{ flex: 1 }}
                                        multiline
                                        onChangeText={(text: string) => setValue('PetDescription', text)}
                                        value={value}
                                    />
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.PetName?.message}</Text>
                        
                        <View className='mt-3 flex-row justify-around mb-10'>
                            <TouchableOpacity style={styles.button} className="justify-center" onPress={handleSubmit(onSubmit)}>
                                <Text className="font-bold text-white">Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} className="justify-center" onPress={handleDelete}>
                                <Text className="font-bold text-white">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
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
    textColor: {
        color: '#4689FD',
        fontSize: 18,
        marginHorizontal: 35,
        marginBottom: 5
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
        backgroundColor: "#4689FD",
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: 180,
        borderRadius: 10,
    },
    buttonDelete: {
        backgroundColor: "#8A0B1E",
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: 180,
        borderRadius: 10,
    },
    selectBox: {
        marginTop: 5,
        marginHorizontal: 30,
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row'
    },
});