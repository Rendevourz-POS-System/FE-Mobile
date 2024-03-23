import React, { FC, useState } from "react";
import { RootNavigationStackScreenProps } from "../../StackScreenProps";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Ionicons } from "@expo/vector-icons";

const registerFormSchema = z.object({
    name: z.string({ required_error: "Name cannot be empty" }).min(5, { message: "Name must be more than 5 character" }),
    email: z.string({ required_error: "Email cannot be empty" }).email({ message: "Invalid email address" }),
    password: z.string({ required_error: "Password cannot be empty" }).min(5, { message: "Password must be more than 5 character" }),
    confirmPassword: z.string({ required_error: "Confirm Password cannot be empty" }).min(5, { message: "Password must be more than 5 character" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});


type RegisterFormType = z.infer<typeof registerFormSchema>

export const RegisterScreen: FC<RootNavigationStackScreenProps<'RegisterScreen'>> = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormType>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (data: RegisterFormType) => {
        console.log(data);
    }

    return (
        <SafeAreaProvider className="flex-1 bg-white">
            <ScrollView>
                <View className="mb-8">
                    <View className="items-center my-10">
                        <View className="absolute left-7 top-1">
                            <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                        </View>
                        <Text className="text-2xl mb-5">Sign Up</Text>
                        <Image source={require('../../../../assets/logo-register.png')} />
                    </View>

                    <View>
                        <View style={style.inputBox}>
                            <Controller
                                name="name"
                                control={control}
                                render={() => (
                                    <TextInput
                                        placeholder="Name"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('name', text)}
                                    />
                                )}

                            />
                        </View>
                        <Text style={style.errorMessage}>{errors.name?.message}</Text>
                    </View>

                    <View>
                        <View style={style.inputBox}>
                            <Controller
                                name="email"
                                control={control}
                                render={() => (
                                    <TextInput
                                        placeholder="Email"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('email', text)}
                                    />
                                )}
                            />
                        </View>
                        <Text style={style.errorMessage}>{errors.email?.message}</Text>
                    </View>

                    <View>
                        <View style={style.inputBox}>
                            <Controller
                                name="password"
                                control={control}
                                render={() => (
                                    <TextInput
                                        placeholder="Password"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('password', text)}
                                    />
                                )}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={style.passwordToggleIcon}>
                                <Icon name={showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <Text style={style.errorMessage}>{errors.password?.message}</Text>
                    </View>

                    <View>
                        <View style={style.inputBox}>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={() => (
                                    <TextInput
                                        placeholder="Confirm Password"
                                        style={{ flex: 1 }}
                                        onChangeText={(text: string) => setValue('confirmPassword', text)}
                                    />
                                )}
                            />
                            <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={style.passwordToggleIcon}>
                                <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <Text style={style.errorMessage}>{errors.confirmPassword?.message}</Text>
                    </View>

                    <TouchableOpacity style={style.button} onPress={handleSubmit(onSubmit)}>
                        <Text className="text-center font-bold text-white">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center top-5">
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                            <Text className="underline underline-offset-4" style={style.fontColor}> Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

const style = StyleSheet.create({
    inputBox: {
        backgroundColor: "#F7F7F9",
        padding: 20,
        marginHorizontal: 30,
        borderBottomColor: "#488DF4",
        borderBottomWidth: 2,
        borderRadius: 10,
        flexDirection: 'row'
    },
    button: {
        backgroundColor: "#378CE7",
        padding: 15,
        marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 20
    },
    fontColor: {
        color: "#488DF4"
    },
    passwordToggleIcon: {
        flexDirection: 'row',
        top: 5,
    },
    errorMessage: {
        color: 'red',
        marginHorizontal: 35,
        marginBottom: 20,
    }
})

