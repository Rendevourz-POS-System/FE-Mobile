import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const profileFormSchema = z.object({
    name: z.string({ required_error: "Name cannot be empty" }).min(5, { message: "Name must be more than 5 character" }),
    email: z.string({ required_error: "Email cannot be empty" }).email({ message: "Invalid email address" }),
    phoneNumber: z.string({ required_error: "Phone Number cannot be empty" }).min(1, { message: "Phone number cannot be empty" }).refine(value => /^\d+$/.test(value), { message: "Phone Number must be numeric (0-9)" }),
    address: z.string({ required_error: "Address cannot be empty" }).min(1, { message: "Address cannot be empty" }),
    password: z.string({ required_error: "Password cannot be empty" })
})

type ProfileFormType = z.infer<typeof profileFormSchema>

export const ManageScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ManageScreen'>> = ({ navigation }) => {
    const [image, setImage] = useState('');

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormType>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "John",
            email: "JohnDue@gmail.com",
            phoneNumber: "",
            address: "",
            password: "******",
        }
    });

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

    const onSubmit = async (data: ProfileFormType) => {
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("phoneNumber", data.phoneNumber);
        setValue("address", data.address);
        console.log(data);
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View className="mt-20 flex justify-normal left-5">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                </View>

                <View className="mb-10 mt-5">
                    <View style={styles.rowContainer} className="justify-around">
                        <TouchableOpacity
                            style={{ width: 100, height: 100, backgroundColor: '#2E3A59', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
                            onPress={pickImage}
                            disabled={image ? true : false}
                        >
                            {image ? (<Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />) : (<Ionicons name="camera" size={40} color="white" />)}
                        </TouchableOpacity>
                        <Text className="top-5 text-3xl">David Robinson</Text>
                    </View>
                </View>

                <View style={styles.inputBox}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Name"
                                onChangeText={(text: string) => setValue('name', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>

                <View style={styles.inputBox}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Email"
                                onChangeText={(text: string) => setValue('email', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.email?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Phone Number"
                                onChangeText={(text: string) => setValue('phoneNumber', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.phoneNumber?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Address"
                                onChangeText={(text: string) => setValue('address', text)}
                                value={value}
                            />
                        )}
                    />
                    <FontAwesome6 name="edit" size={24} color="black" />
                </View>
                <Text style={styles.errorMessage}>{errors.address?.message}</Text>

                <View style={styles.disabledInput}>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field: { value } }) => (
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Password"
                                value={value}
                                editable={false}
                            />
                        )}
                    />
                </View>

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
    disabledInput: {
        backgroundColor: "#CCCCCC",
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
});
