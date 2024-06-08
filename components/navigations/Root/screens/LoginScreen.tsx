import { FC, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from "../../../../app/context/AuthContext";
import { post } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { GuestNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

const loginFormSchema = z.object({
    Email: z.string({ required_error: "Email cannot be empty" }).email({ message: "Invalid email address" }),
    Password: z.string({ required_error: "Password cannot be empty" })
})

type LoginFormType = z.infer<typeof loginFormSchema>

export const LoginScreen: FC<GuestNavigationStackScreenProps<'Login'>> = ({navigation}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const {onLogin} = useAuth();
    const [isLogin, setIsLogin] = useState(false);

    const login = async () => {
        setIsLogin(true);
        const result = await onLogin!(email, password);
        if(result.data?.Data)  {
            try{
                const res = await post(`${BackendApiUri.resendOtp}`, { UserId: result.data.Data });
            } catch(e){
                console.log(e)
            }
            navigation.navigate("VerifyOTP", { email: email, userId: result.data.Data });
        }
        if(result.error){
            setError('Email', { message: 'Invalid email or password' });
            setError('Password', { message: 'Invalid email or password' });
            setIsLogin(false);
        }
    }

    const {
        control,
        watch,
        setValue,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            Email: undefined,
            Password: undefined,
        }
    });

    const email = watch("Email");
    const password = watch("Password");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <SafeAreaProvider className="flex-1 bg-white">
            <ScrollView>
                <View className="my-8">
                    <View className="items-center my-10">
                        <Text className="text-2xl mb-5">Welcome To Our App</Text>
                        <Image source={require('../../../../assets/logo-login.png')} />
                    </View>

                    <View style={style.inputBox}>
                        <Controller
                            name="Email"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="Email"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('Email', text)}
                                />
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.Email?.message}</Text>

                    <View style={style.inputBox}>
                        <Controller
                            name="Password"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="Password"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('Password', text)}
                                    secureTextEntry={!showPassword}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={style.passwordToggleIcon}>
                            <Icon name={!showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={style.errorMessage}>{errors.Password?.message}</Text>

                    <View className="flex-row justify-between mx-9 top-0">
                        <CheckBox
                            checked={rememberMe}
                            onPress={handleRememberMeChange}
                            checkedColor="#488DF4"
                            containerStyle={style.checkboxContent}
                            title={"Remember Me"}
                            className=""
                            textStyle={style.fontColor}
                        ></CheckBox>
                        <TouchableOpacity>
                            <Text style={style.fontColor} className="mt-1">Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={style.button} onPress={login} disabled={isLogin} className={`flex-row items-center justify-center ${!isLogin ? 'bg-blue-500' : 'bg-slate-500'}`}>
                        {isLogin ? 
                            (
                                <>
                                    <ActivityIndicator animating={isLogin} color="#fff" className="mx-2" />
                                    <Text className="text-center font-bold text-white">Signing In...</Text> 
                                </>
                            )
                            : 
                            (
                                <>
                                    <Text className="text-center font-bold text-white">Sign In</Text>
                                </>
                            )
                        }
                    </TouchableOpacity>

                    <View className="flex-row justify-center top-5">
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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