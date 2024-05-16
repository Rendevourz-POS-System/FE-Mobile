import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProfileRootBottomTabCompositeScreenProps } from "../../CompositeNavigationProps";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { Icon } from "react-native-elements";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { put } from "../../../../functions/Fetch";

const changePasswordFormSchema = z.object({
    Password: z.string({ required_error: "Current password cannot be empty" }).min(8, { message: "Must be more than 5 character" }),
    NewPassword: z.string({ required_error: "New password cannot be empty" }).min(8, { message: "Must be more than 5 character" }),
    ConfirmPassword: z.string({ required_error: "Confirm password cannot be empty" }).min(8, { message: "Must be more than 5 character" })
}).refine((data) => data.NewPassword === data.ConfirmPassword, {
    message: "Confirm Password tidak sama dengan New Password",
    path: ['ConfirmPassword'],
});

type changePasswordFormType = z.infer<typeof changePasswordFormSchema>

export const ChangePasswordScreen: FC<ProfileRootBottomTabCompositeScreenProps<'ChangePasswordScreen'>> = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<changePasswordFormType>({
        resolver: zodResolver(changePasswordFormSchema),
    });

    const onSubmit = async (data: changePasswordFormType) => {
        try {
            console.log(data);
            await put(BackendApiUri.putUserUpdatePw, data);
            Alert.alert('Password Berhasil Berubah', 'Password anda telah berhasil berubah.');
        } catch (e) {
            Alert.alert('Password Masih salah', 'Password anda masih tidak sesuai.');
        }
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View className="mt-14 flex-row items-center justify-center mb-3">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }} />
                <Text className="text-xl">Change Password</Text>
            </View>

            <ScrollView className="mt-10">
                <View style={styles.inputBox}>
                    <Controller
                        name="Password"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Current Password"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('Password', text)}
                                secureTextEntry={showPassword}
                            />
                        )}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggleIcon}>
                        <Icon name={showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorMessage}>{errors.Password?.message}</Text>

                <View style={styles.inputBox}>
                    <Controller
                        name="NewPassword"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="New Password"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('NewPassword', text)}
                                secureTextEntry={showNewPassword}
                            />
                        )}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.passwordToggleIcon}>
                        <Icon name={showNewPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorMessage}>{errors.NewPassword?.message}</Text>


                <View style={styles.inputBox}>
                    <Controller
                        name="ConfirmPassword"
                        control={control}
                        render={() => (
                            <TextInput
                                placeholder="Confirm Password"
                                style={{ flex: 1 }}
                                onChangeText={(text: string) => setValue('ConfirmPassword', text)}
                                secureTextEntry={showConfirmPassword}
                            />
                        )}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.passwordToggleIcon}>
                        <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorMessage}>{errors.ConfirmPassword?.message}</Text>

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
        marginBottom: 25,
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
    passwordToggleIcon: {
        flexDirection: 'row',
        top: 5,
    },
});
