import React, { FC, useCallback, useRef, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { NoHeaderNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const rescueFormSchema = z.object({
    condition: z.string({ required_error: "Kondisi hewan tidak boleh kosong" }).min(1, { message: "Kondisi hewan tidak boleh kosong" }),
    address: z.string({ required_error: "Alamat tidak boleh kosong" }).min(1, { message: "Alamat tidak boleh kosong" }),
})

type RescueFormType = z.infer<typeof rescueFormSchema>

export const RescueFormScreen: FC<NoHeaderNavigationStackScreenProps<'RescueFormScreen'>> = ({ navigation, route }: any) => {
    const [image, setImage] = useState<string | null>(null);
    const imgDir = FileSystem.documentDirectory + 'images/';
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<RescueFormType>({
        resolver: zodResolver(rescueFormSchema),
    });

    const onSubmit = async (data: RescueFormType) => {
        console.log(data)
    }

    const ensureDirExists = async () => {
        const dirInfo = await FileSystem.getInfoAsync(imgDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
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

    const removeImage = async (imageUri: string) => {
        await FileSystem.deleteAsync(imageUri);
        setImage(null);
    }

    const handleImagePress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    return (
        <SafeAreaProvider className='flex-1'>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={['20%%']}
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
                        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                        <Text className="text-xl">Lapor Penyelamatan</Text>
                    </View>

                    <ScrollView>
                        <Text className='mt-5 mb-5 text-xs text-center text-[#8A8A8A]'>Isilah data Anda dengan baik dan benar</Text>

                        {image && (
                            <View className="items-end mx-5 ">
                                <TouchableOpacity className="flex-row items-center p-2" onPress={() => removeImage(image)}>
                                    <Ionicons name="trash" size={20} color="black" />
                                    <Text className="text-xs">Hapus Gambar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View className="items-center mb-5">
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

                        <Text style={styles.textColor}>Kondisi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={styles.inputBox}>
                            <Controller
                                name="condition"
                                control={control}
                                render={() => (
                                    <TextInput
                                        placeholder="Masukkan kondisi hewan"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('condition', text)}
                                    />
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.condition?.message}</Text>

                        <Text style={styles.textColor}>Alamat<Text className='text-[#ff0000]'>*</Text></Text>
                        <View style={styles.inputBox}>
                            <Controller
                                name="address"
                                control={control}
                                render={() => (
                                    <TextInput
                                        placeholder="Masukkan Alamat"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('address', text)}
                                    />
                                )}
                            />
                        </View>
                        <Text style={styles.errorMessage}>{errors.address?.message}</Text>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} className='mb-5'>
                            <Text className="text-center font-bold text-white">Submit</Text>
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
    imageBox: {
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
        marginHorizontal: 30,
        width: 150
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
