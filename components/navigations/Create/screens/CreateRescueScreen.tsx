import { Image, Text, TextInput, View } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { CreateNavigationStackScreenProps } from "../../../StackParams/StackScreenProps"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet"
import { TouchableOpacity } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native"
import { z } from "zod"
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectList } from "react-native-dropdown-select-list"
import { RadioButton } from "react-native-paper"
import { Alert } from "react-native"
import { BackendApiUri, baseUrl } from "../../../../functions/BackendApiUri"
import { useAuth } from "../../../../app/context/AuthContext"
import { get } from "../../../../functions/Fetch"
import { PetType } from "../../../../interface/IPetType"

const createPetFormSchema = z.object({
    PetName: z.string({ required_error: "Nama hewan tidak boleh kosong" }).min(1, { message: "Nama hewan tidak boleh kosong" }),
    PetType: z.string({ required_error: "Jenis hewan tidak boleh kosong" }).min(1, { message: 'Jenis hewan tidak boleh kosong' }),
    PetAge: z.number({ required_error: "Umur hewan tidak boleh kosong" }).int().positive().nonnegative("Umur hewan harus merupakan bilangan bulat positif"),
    PetGender: z.string({ required_error: "Jenis kelamin hewan tidak boleh kosong" }),
    // IsVaccinated: z.string({ required_error: "Vaksinasi hewan tidak boleh kosong" }),
    PetDescription: z.string({ required_error: "Deskripsi hewan tidak boleh kosong" }).min(10, { message: "Deskripsi hewan harus lebih dari 10 karakter" }),
})

type CreatePetFormType = z.infer<typeof createPetFormSchema>

export const CreateRescueScreen : FC<CreateNavigationStackScreenProps<'CreateRescueScreen'>> = ({navigation}) => {
    const { authState } = useAuth();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const imgDir = FileSystem.documentDirectory + 'images/';
    const [image, setImage] = useState<string | null>(null);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<CreatePetFormType>({
        resolver: zodResolver(createPetFormSchema),
    });

    const fetchPetType = async () => {
        const res = await get(BackendApiUri.getPetTypes);
        setPetTypes(res.data)
    }

    const petTypeData = petTypes.map((item) => ({
        key: item.Id,
        value: item.Type,
    }));

    useEffect(() => {
        fetchPetType()
    }, [])

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

    const removeImage = async (imageUri: string) => {
        await FileSystem.deleteAsync(imageUri);
        setImage(null);
    }

    const handleImagePress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);


    const onSubmit = async (data: CreatePetFormType) => {
        const payload = {
            ShelterId: 1,
            PetName: data.PetName,
            PetAge: data.PetAge,
            PetType: data.PetType,
            PetGender: data.PetGender,
            PetDescription: data.PetDescription
        }

        const formData = new FormData();

        if (image) {
            const fileInfo = await FileSystem.getInfoAsync(image);
            formData.append('files', {
                uri: image,
                name: fileInfo.uri.split('/').pop(),
                type: 'image/jpeg'
            } as any); // You can also check and set the type dynamically based on file extension
        }

        let payloadString = JSON.stringify(payload);
        
        formData.append('data', payloadString);
        
        // const res = await postForm(BackendApiUri.postPet, formData);
        const res = await fetch(`${baseUrl + BackendApiUri.postPet}`, {
            method: 'POST',
            body : formData,
            headers : {
                'Content-Type' : 'multipart/form-data',
                'Authorization' : `Bearer ${authState?.token}`
            }
        });
        if (res?.status === 200) {
            if(image) {
                removeImage(image!);
            }
            Alert.alert("Pet Berhasil", "Pet Berhasil dibuat", [ { text: "OK", onPress: () => navigation.goBack()}]);
        }else{
            Alert.alert("Pet Gagal", "Pet gagal dibuat, mohon diisi dengan yang benar");
        }
    }


    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
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
                                    // if (image) {
                                    //     removeImage(image!);
                                    // }
                                    navigation.goBack()
                                }}
                                style={{ position: 'absolute', left: 20 }} />
                            <Text className="text-xl">Create Pet Rescue</Text>
                        </View>
                        <ScrollView className="mt-5">
                            {image && (
                                <View className="items-end mx-5 mt-8 ">
                                    <TouchableOpacity className="flex-row items-end" onPress={() => removeImage(image)}>
                                        <Ionicons name="trash" size={20} color="black" />
                                        <Text className="text-xs">Hapus Gambar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View className="mt-2 mb-10 items-center">
                                <TouchableOpacity
                                    style={{ width: 350, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={handleImagePress}
                                >

                                    {image ? (
                                        <Image source={{ uri: image }} style={{ width: "100%", height: "100%", borderRadius: 10 }} resizeMode="cover" />) :
                                        (<Ionicons name="camera" size={40} color="white" />)}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.textColor}>Nama Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="PetName"
                                    control={control}
                                    render={() => (
                                        <TextInput
                                            placeholder="Masukkan Nama Hewan"
                                            style={{ flex: 1 }}
                                            onChangeText={(text: string) => setValue('PetName', text)}
                                        />
                                    )}
                                />
                            </View>
                            <Text style={styles.errorMessage}>{errors.PetName?.message}</Text>

                            <Text style={styles.textColor}>Jenis Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                            <Controller
                                name="PetType"
                                control={control}
                                render={() => (
                                    <SelectList
                                        setSelected={(text: string) => setValue('PetType', text)}
                                        data={petTypeData}
                                        save="value"
                                        search={true}
                                        dropdownStyles={styles.inputBox}
                                        boxStyles={styles.selectBox}
                                        inputStyles={{ padding: 3 }}
                                        arrowicon={<FontAwesome name="chevron-down" size={12} color={'#808080'} style={{ padding: 3 }} />}
                                        placeholder="Masukkan Jenis Hewan"
                                    />
                                )}
                            />
                            <Text style={styles.errorMessage}>{errors.PetType?.message}</Text>

                            <Text style={styles.textColor}>Umur Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="PetAge"
                                    control={control}
                                    render={() => (
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

                            <Text style={styles.textColor}>Deskripsi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                            <View style={styles.inputBox}>
                                <Controller
                                    name="PetDescription"
                                    control={control}
                                    render={() => (
                                        <TextInput
                                            placeholder="Masukkan Deskripsi Hewan"
                                            style={{ flex: 1 }}
                                            multiline
                                            onChangeText={(text: string) => setValue('PetDescription', text)}
                                        />
                                    )}
                                />
                            </View>
                            <Text style={styles.errorMessage}>{errors.PetDescription?.message}</Text>

                            <TouchableOpacity style={[styles.button]} onPress={handleSubmit(onSubmit)}>
                                <Text className="text-center font-bold text-white">Save</Text>
                            </TouchableOpacity>
                        </ScrollView>


                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
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
    button: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        top: 30,
        marginBottom: 60
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
