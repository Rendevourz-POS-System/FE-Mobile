import React, { FC } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { post } from '../../../../functions/Fetch';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { NoHeaderNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';

const adoptionFormSchema = z.object({
    Reason: z.string({ required_error: "Alasan adopsi tidak boleh kosong" }).min(5, { message: "Alasan adopsi harus lebih dari 5 karakter" }),
})

type AdoptionFormType = z.infer<typeof adoptionFormSchema>

export const AdoptionFormScreen: FC<NoHeaderNavigationStackScreenProps<'AdoptionFormScreen'>> = ({ navigation, route }: any) => {
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<AdoptionFormType>({
        resolver: zodResolver(adoptionFormSchema),
    });

    const onSubmit = async (data: AdoptionFormType) => {
        const payload = {
            ShelterId: route.params.shelterId,
            PetId: route.params.petId,
            Type: "Adoption",
            Reason: data.Reason
        }
        try {
            const response = await post(BackendApiUri.postRequest, payload);
            if (response.status == 200) {
                Alert.alert("Data Anda Berhasil Tersimpan", "", [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ],
                    { cancelable: false })
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaProvider className='flex-1 bg-white'>
            <View className="mt-5 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Adopsi Hewan</Text>
            </View>

            <ScrollView>
                <Text className='mt-5 mb-8 text-xs text-center text-[#8A8A8A]'>Isilah Alasan Anda dengan baik dan benar</Text>

                <Text style={styles.textColor}>Alasan Adopsi<Text className='text-[#ff0000]'>*</Text></Text>
                <View style={styles.inputBox}>
                    <Controller
                        name="Reason"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Masukkan Alasan Adopsi"
                                style={{ flex: 1 }}
                                multiline
                                onChangeText={(text: string) => setValue('Reason', text)}
                            />
                        )}
                    />
                </View>
                <Text style={styles.errorMessage}>{errors.Reason?.message}</Text>

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
