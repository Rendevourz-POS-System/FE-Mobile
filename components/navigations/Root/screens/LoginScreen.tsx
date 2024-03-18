import { FC, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigationStackScreenProps } from "../../StackScreenProps";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const loginFormSchema = z.object({
    email: z.string({ required_error: "Email cannot be empty" }).email({ message: "Invalid email address" }),
    password: z.string({ required_error: "Password cannot be empty" })
})

type LoginFormType = z.infer<typeof loginFormSchema>

export const LoginScreen: FC<RootNavigationStackScreenProps<'LoginScreen'>> = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: undefined,
            password: undefined,
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    const onSubmit = async (data: LoginFormType) => {
        navigation.navigate('TabMenu');
    }

    return (
        <SafeAreaProvider className="flex-1 bg-white">
            <ScrollView>

                <View className="my-8">
                    <View className="items-center my-10">
                        <Text className="text-2xl mb-5">Welcome To Our App</Text>
                        <Image source={require('../../../../assets/logo-login.png')} />
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
                                    secureTextEntry={!showPassword}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={style.passwordToggleIcon}>
                            <Icon name={showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={style.errorMessage}>{errors.password?.message}</Text>
                </View>

                <View className="flex-row justify-between mx-8 top-2">
                    <CheckBox
                        checked={rememberMe}
                        onPress={handleRememberMeChange}
                        checkedColor="#488DF4"
                        containerStyle={style.checkboxContent}
                        title={"Remember Me"}
                        className="mt-1"
                        textStyle={style.fontColor}
                    ></CheckBox>
                    <TouchableOpacity>
                        <Text style={style.fontColor} className="mt-1">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={style.button} onPress={handleSubmit(onSubmit)}>
                    <Text className="text-center font-bold text-white">Sign In</Text>
                </TouchableOpacity>

                    <Text className="text-center my-5 opacity-30">Or Sign In With</Text>

                    <View className="flex-row flex justify-evenly">
                        <Image source={require('../../../../assets/Facebook.png')} />
                        <Image source={require('../../../../assets/Google.png')} />
                        <Image source={require('../../../../assets/Instagram.png')} />
                    </View>

                    <View className="flex-row justify-center top-5">
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                            <Text className="underline underline-offset-4" style={style.fontColor}> Sign Up</Text>
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
    checkboxContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -5,
        marginRight: -100,
        marginTop: -10,
        borderColor: 'transparent',
    },
    passwordToggleIcon: {
        flexDirection: 'row',
        top: 5,
    },
    errorMessage: {
        color: 'red',
        marginHorizontal: 35,
        marginBottom: 20,
    },
})