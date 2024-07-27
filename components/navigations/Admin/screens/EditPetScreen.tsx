import { FC, useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Image, Alert } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { RadioButton } from "react-native-paper";
import { PetType } from "../../../../interface/IPetType";
import { get, putForm } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { SelectList } from "react-native-dropdown-select-list";
import { PetData } from "../../../../interface/IPetList";
import { AdminNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

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
})

type EditPetFormType = z.infer<typeof editPetFormSchema>

export const EditPetScreen: FC<AdminNavigationStackScreenProps<'EditPetScreen'>> = ({ navigation, route }: any) => {
    const [petData, setPetData] = useState<PetProps>();
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<EditPetFormType>({
        resolver: zodResolver(editPetFormSchema),
    });

    useEffect(() => {
        fetchPet();
    }, [route.params.petId])

    const fetchPet = async () => {
        try {
            setIsLoading(false)
            const response = await get(`${BackendApiUri.getPet}/${route.params.petId}`);
            if (response && response.status === 200) {
                setPetData(response.data);
                setValue("PetName", response.data.Data.PetName);
                setValue("PetType", response.data.Data.petType);
                setValue("PetAge", response.data.Data.PetAge);
                setValue("PetGender", response.data.Data.PetGender);
                if (response.data.Data.IsVaccinated == true) {
                    setValue("IsVaccinated", "true");
                } else {
                    setValue("IsVaccinated", "false")
                }
                setValue("PetDescription", response.data.Data.PetDescription);
                setIsLoading(true)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false);
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

    useEffect(() => {
        fetchPetType()
    }, [])

    const onSubmit = async (data: EditPetFormType) => {
        const payload = {
            Id: petData?.Data.Id,
            ShelterId: petData?.Data.ShelterId,
            PetName: data.PetName,
            PetAge: data.PetAge,
            PetType: data.PetType,
            PetGender: data.PetGender,
            IsVaccinated: data.IsVaccinated == "true" ? true : false,
            PetDescription: data.PetDescription,
            OldImage: petData?.Data.OldImage,
        }
        const formData = new FormData();

        formData.append('data', JSON.stringify(payload));
        const res = await putForm(`${BackendApiUri.putPetUpdate}`, formData);
        if (res.status == 200) {
            Alert.alert('Shelter Berhasil Terupdate', 'Data shelter telah berhasil terupdate.', [{ text: "OK", onPress: () => navigation.goBack() }]);
        } else {
            Alert.alert('Shelter Gagal Update', 'Data shelter gagal terupdate.');
        } 
    }

    return (
        <SafeAreaProvider>
            <View className="mt-5 flex-row items-center justify-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Edit {petData ? petData.Data.PetName : ""}</Text>
            </View>

            <ScrollView className="mt-5">
                <View className="mb-10 items-center">
                    <Image source={{ uri: `data:image/*;base64,${petData?.Data.ImageBase64}` }} style={{ width: 350, height: 200, backgroundColor: '#2E3A59', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} />
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
                    name="PetName"
                    control={control}
                    render={({ field: { value } }) => (
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
                            defaultOption={petTypeData.find(item => item.value === petData?.Data.PetType)}
                        />
                    )}
                />
                <Text style={styles.errorMessage}>{errors.PetName?.message}</Text>

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

                <TouchableOpacity style={[styles.button]} onPress={handleSubmit(onSubmit)}>
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