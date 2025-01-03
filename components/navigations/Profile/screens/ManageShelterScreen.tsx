import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { get, putForm } from "../../../../functions/Fetch";
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from "react-native-dropdown-select-list";
import { PetType, ShelterLocation } from "../../../../interface/IPetType";
import { Checkbox } from "react-native-paper";

const editShelterFormSchema = z.object({
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

type CreateShelterFormType = z.infer<typeof editShelterFormSchema>

export const ManageShelterScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ManageShelterScreen'>> = ({ navigation }) => {
    const [image, setImage] = useState('');
    const [selected, setSelected] = useState<string[]>();
    const [shelterLocation, setShelterLocation] = useState<ShelterLocation[]>([]);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<CreateShelterFormType>({
        resolver: zodResolver(editShelterFormSchema),
    });

    useEffect(() => {
        const parentNavigation = navigation.getParent();
        
        if (parentNavigation) {
          parentNavigation.setOptions({
            tabBarStyle: { display: 'none' }
          });
        }
    
        return () => {
          if (parentNavigation) {
            parentNavigation.setOptions({
              tabBarStyle: { display: 'flex' }
            });
          }
        };
      }, [navigation]);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(`${BackendApiUri.getUserShelter}`);
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
        let payloadString = JSON.stringify(data);
        const formData = new FormData();
        formData.append('file', image);
        formData.append('data', payloadString);
        const res = await putForm(`${BackendApiUri.putShelterUpdate}`, formData);
        if(res.status == 200){
            Alert.alert('Shelter Berhasil Terupdate', 'Data shelter anda telah berhasil terupdate.', [{ text: "OK", onPress: () => navigation.goBack() } ]);
        }else{
            Alert.alert('Shelter Gagal Update', 'Data shelter anda gagal terupdate.');
        } 
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
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Manage Shelter Profile</Text>
            </View>

            <ScrollView>
                <View style={styles.rowContainer} className="justify-around mt-5 mb-5">
                    <TouchableOpacity
                        style={{ width: 350, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                        onPress={pickImage}
                        disabled={image ? true : false}
                    >

                        {image ? (
                            <Image source={{ uri: image }} style={{ width: 550, height: 200, borderRadius: 10 }} />)
                            :
                            (<Ionicons name="camera" size={40} color="white" />
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
                                onChangeText={(text: string) => {
                                    const numericValue = parseInt(text);
                                    if (!isNaN(numericValue)) {
                                        setValue('TotalPet', numericValue);
                                    }
                                }}
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
                        <View style={{marginHorizontal: 35}}>
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
