import { FC, useState } from "react";
import { RootNavigationStackScreenProps } from "../../StackScreenProps";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-elements";

export const RegisterScreen: FC<RootNavigationStackScreenProps<'RegisterScreen'>> = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return (
        <SafeAreaProvider className="flex-1 bg-white">
            <ScrollView>
                <View className="mb-8">
                    <View className="items-center my-10">
                        <View className="absolute left-7 top-1">
                            <Icon name="arrow-left" type="font-awesome" onPress={() => navigation.goBack()} />
                        </View>
                        <Text className="text-2xl mb-5">Sign Up</Text>
                        <Image source={require('../../../../assets/logo-register.png')} />
                    </View>

                    <View style={style.inputBox}>
                        <TextInput
                            placeholder="Name"
                        />
                    </View>

                    <View style={style.inputBox}>
                        <TextInput
                            placeholder="Email"
                        />
                    </View>

                    <View style={style.inputBox}>
                        <TextInput
                            placeholder="Password"
                            style={{flex: 1}}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={style.passwordToggleIcon}>
                            <Icon name={showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={style.inputBox}>
                        <TextInput
                            placeholder="Confirm Password"
                            style={{flex: 1}}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={style.passwordToggleIcon}>
                            <Icon name={showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={style.button}>
                        <Text className="text-center font-bold text-white">Sign In</Text>
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
        marginBottom: 30,
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
})