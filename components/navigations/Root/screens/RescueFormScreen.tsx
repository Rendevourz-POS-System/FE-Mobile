import React, { FC, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { NoHeaderNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';

const rescueFormSchema = z.object({
    condition: z.string({ required_error: "Kondisi hewan tidak boleh kosong" }).min(1, { message: "Kondisi hewan tidak boleh kosong" }),
    address: z.string({ required_error: "Alamat tidak boleh kosong" }).min(1, { message: "Alamat tidak boleh kosong" }),
})

type RescueFormType = z.infer<typeof rescueFormSchema>

export const RescueFormScreen: FC<NoHeaderNavigationStackScreenProps<'RescueFormScreen'>> = ({ navigation, route }: any) => {
    const [image, setImage] = useState('');

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<RescueFormType>({
        resolver: zodResolver(rescueFormSchema),
    });

    const onSubmit = async (data: RescueFormType) => {
        console.log(data)
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
        <SafeAreaProvider className='flex-1'>
            <View className="mt-5 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Lapor Penyelamatan</Text>
            </View>

            <ScrollView>
                <Text className='mt-5 mb-8 text-xs text-center text-[#8A8A8A]'>Isilah data Anda dengan baik dan benar</Text>

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

                <Text style={styles.textColor}>Gambar<Text className='text-[#ff0000]'>*</Text></Text>
                <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                    <Text className='text-center text-gray-500'>Pilih Gambar</Text>
                </TouchableOpacity>
                {image ? (<Image source={{ uri: image }} style={{ width: 100, height: 100, marginHorizontal: 30}} />) : (<Ionicons name="camera" size={40} color="white" />)}

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
