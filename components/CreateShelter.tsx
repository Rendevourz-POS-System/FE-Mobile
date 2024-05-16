import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { MultipleSelectList, SelectList } from "react-native-dropdown-select-list";
import { BackendApiUri } from "../functions/BackendApiUri";
import { get, post } from "../functions/Fetch";
import { PetType, ShelterLocation } from "../interface/IPetType";

const createShelterFormSchema = z.object({
    ShelterName: z.string({ required_error: "Nama shelter tidak boleh kosong" }).min(1, { message: "Nama shelter tidak boleh kosong" }),
    ShelterLocation: z.string({ required_error: "Lokasi shelter tidak boleh kosong" }).min(10, { message: 'Lokasi shelter tidak boleh kosong' }),
    ShelterAddress: z.string({ required_error: "Alamat shelter tidak boleh kosong" }).min(1, { message: "Alamat shelter tidak boleh kosong" }),
    ShelterCapacity: z.number().int().positive().nonnegative("Kapasitas shelter harus merupakan bilangan bulat positif"),
    ShelterContactNumber: z.string({ required_error: "Kontak shelter tidak boleh kosong" }),
    ShelterDescription: z.string({ required_error: 'Deskripsi shelter tidak boleh kosong' }),
    PetTypeAccepted: z.string().array().nonempty(),
    Pin: z.string({ required_error: "Pin tidak boleh kosong" }).min(5, { message: "Pin tidak boleh kurang dari 5 karakter" }).refine(value => /^\d+$/.test(value), { message: "Pin harus berupa angka (0-9)" }),
})

type CreateShelterFormType = z.infer<typeof createShelterFormSchema>

export const CreateShelter = () => {
    const [inputValue, setInputValue] = useState<number | undefined>(undefined);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [shelterLocation, setShelterLocation] = useState<ShelterLocation[]>([]);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<CreateShelterFormType>({
        resolver: zodResolver(createShelterFormSchema),
        defaultValues: {
            PetTypeAccepted: [],
        },
    });

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

    const onSubmit = async (data: CreateShelterFormType) => {
        console.log(data);
        const res = await post(BackendApiUri.postShelterRegister, data);
        if (res.status == 200) {
            Alert.alert("Shelter Created", "Shelter Berhasil dibuat");
        }
    }

    const [selected, setSelected] = useState<string[]>([]);

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
        <ScrollView className="mt-5">
            <Text style={styles.textColor}>Nama Shelter<Text className='text-[#ff0000]'>*</Text></Text>
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
                <Controller
                    name="ShelterContactNumber"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Kontak Shelter"
                            style={{ flex: 1 }}
                            onChangeText={(text: string) => setValue('ShelterContactNumber', text)}
                        />
                    )}
                />
            </View>
            <Text style={styles.errorMessage}>{errors.ShelterContactNumber?.message}</Text>

            <Text style={styles.textColor}>Deskripsi Shelter<Text className='text-[#ff0000]'>*</Text></Text>
            <View style={styles.inputBox}>
                <Controller
                    name="ShelterDescription"
                    control={control}
                    render={() => (
                        <TextInput
                            placeholder="Masukkan Deskripsi Shelter"
                            style={{ flex: 1 }}
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
                <Text className="text-center font-bold text-white">Save</Text>
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
