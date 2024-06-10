import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from "../../../DatePicker";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from "react-native-dropdown-select-list";
import { dataJenisHewan, dataSpesiesHewan } from "../../../../constans/data";
import { NoHeaderNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

const surrenderFormSchema = z.object({
    name: z.string({ required_error: "Nama tidak boleh kosong" }).min(1, { message: "Nama tidak boleh kosong" }),
    dob: z.string({ required_error: "Tanggal lahir tidak boleh kosong" }).min(10, { message: 'Tanggal lahir tidak boleh kosong' }),
    type: z.string({ required_error: "Jenis Hewan tidak boleh kosong" }).min(1, { message: "Jenis Hewan tidak boleh kosong" }),
    species: z.string({ required_error: 'Spesies hewan tidak boleh kosong' }).min(1, { message: "Spesies hewan tidak boleh kosong" }),
    gender: z.string({ required_error: "Jenis kelamin hewan tidak boleh kosong" }),
    steril: z.string({ required_error: 'Steril tidak boleh kosong' }),
    description: z.string({ required_error: "Deskripsi tidak boleh kosong" }).min(5, { message: "Deskripsi tidak boleh kurang dari 5 karakter" }).max(120, { message: 'Deskripsi tidak boleh lebih dari 120 karakter' }),
    condition: z.string({ required_error: "Kondisi hewan tidak boleh kosong" }).min(5, { message: "Kondisi hewan tidak boleh kurang dari 5 karakter" }),
})

type SurrenderFormType = z.infer<typeof surrenderFormSchema>

export const SurrenderFormScreen: FC<NoHeaderNavigationStackScreenProps<'SurrenderFormScreen'>> = ({ navigation }) => {
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<SurrenderFormType>({
        resolver: zodResolver(surrenderFormSchema),
    });

    const onSubmit = async (data: SurrenderFormType) => {
        console.log(data)
    }

    const [enable, setEnable] = useState<{
        dob: boolean;
    }>({
        dob: false,
    });

    const {
        dob, type
    } = watch();

    const onConfirmBirthDate = (value: Date) => {
        setEnable({ ...enable, dob: false });
        const getYear = value.toLocaleString('default', { year: 'numeric' });
        const getMonth = value.toLocaleString('default', { month: '2-digit' });
        let getDay = value.toLocaleString('default', { day: '2-digit' });
        getDay = `${getYear}-${getMonth}-${getDay}`;
        setValue('dob', getDay.toString());
    };

    const [image, setImage] = useState('');

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

    const handleSpeciesSelection = () => {
        if(type == "Dog") return dataSpesiesHewan.Dog;
        if(type == "Cat") return dataSpesiesHewan.Cat;
        if(type == "Rabbit") return dataSpesiesHewan.Rabbit
        return []
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-5 mb-5 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Penyerahan Hewan</Text>
            </View>

            <ScrollView>
                <Text className='mt-5 mb-8 text-xs text-center text-[#8A8A8A]'>Isilah Data Penyerahan Hewan Anda dengan Baik dan Benar</Text>

                <Text style={styles.textColor}>Nama Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="name"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Nama Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('name', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.name?.message}</Text>

                <Text style={styles.textColor}>Tanggal Lahir Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <Controller
                    name="dob"
                    control={control}
                    render={() => (
                        <DatePicker
                            isModalVisible={enable.dob}
                            date={dob ? new Date(dob) : undefined}
                            onConfirm={onConfirmBirthDate}
                            onCancel={() => setEnable({ ...enable, dob: false })}
                            onPress={() => setEnable({ ...enable, dob: true })}
                            disabled={false}
                            style={{ marginTop: 10 }}
                        />
                    )}
                />
                <Text style={styles.errorMessage}>{errors.dob?.message}</Text>

                <Text style={styles.textColor}>Jenis Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <Controller
                    name="type"
                    control={control}
                    render={() => (
                        <SelectList
                            setSelected={(text: string) => setValue('type', text)}
                            data={dataJenisHewan}
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
                <Text style={styles.errorMessage}>{errors.type?.message}</Text>

                <Text style={styles.textColor}>Spesies Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <Controller
                    name="species"
                    control={control}
                    render={() => (
                        <SelectList
                            setSelected={(text: string) => setValue('species', text)}
                            data={handleSpeciesSelection()}
                            save="value"
                            search={true}
                            dropdownStyles={styles.inputBox}
                            boxStyles={styles.selectBox}
                            inputStyles={{ padding: 3 }}
                            arrowicon={<FontAwesome name="chevron-down" size={12} color={'#808080'} style={{ padding: 3}} />}
                            placeholder="Masukkan Spesies Hewan"
                        />
                    )}
                />
                <Text style={styles.errorMessage}>{errors.species?.message}</Text>

                <Text style={styles.textColor}>Jenis Kelamin Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={{ marginHorizontal: 30 }}>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <RadioButton.Group onValueChange={onChange} value={value} >
                                <View className="flex flex-row">
                                    <View className="flex-row justify-start items-center mr-5">
                                        <RadioButton.Android value="laki-laki" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">Laki-Laki</Text>
                                    </View>
                                    <View className="flex-row justify-start items-center">
                                        <RadioButton.Android value="perempuan" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">Perempuan</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.gender?.message}</Text>

                <Text style={styles.textColor}>Steril<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={{ marginHorizontal: 30 }}>
                    <Controller
                        name="steril"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <RadioButton.Group onValueChange={onChange} value={value} >
                                <View className="flex flex-row">
                                    <View className="flex-row justify-start items-center mr-10">
                                        <RadioButton.Android value="Sudah" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">Sudah</Text>
                                    </View>
                                    <View className="flex-row justify-start items-center">
                                        <RadioButton.Android value="Belum" color={'#4689FD'} uncheckedColor="#808080" />
                                        <Text className="text-base text-[#808080]">Belum</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.steril?.message}</Text>

                <Text style={styles.textColor}>Deskripsi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="description"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Deskripsi Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('description', text)}
                                multiline
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.description?.message}</Text>

                <Text style={styles.textColor}>Kondisi Hewan<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="condition"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Kondisi Hewan"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('condition', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.condition?.message}</Text>

                <Text style={styles.textColor}>Gambar<Text className='text-[#ff0000]'>*</Text></Text>
                <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                    <Text className='text-center text-gray-500'>Pilih Gambar</Text>
                </TouchableOpacity>
                {image ? (<Image source={{ uri: image }} style={{ width: 100, height: 100, marginHorizontal: 35, marginTop: 10, borderRadius: 10 }} />) : (<Ionicons name="camera" size={40} color="white" />)}

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
        backgroundColor: 'white',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
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
    submitButton: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 20
    },
    imageBox: {
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
        marginHorizontal: 30,
        width: 150
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
