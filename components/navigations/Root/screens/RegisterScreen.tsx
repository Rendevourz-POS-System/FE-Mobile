import React, { FC, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Button, ActivityIndicator } from "react-native";
import { Icon } from "react-native-elements";
import { number, z, ZodNumber } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { post } from "../../../../functions/Fetch";
import { BackendApiUri } from "../../../../functions/BackendApiUri";
import { getCity, getKabupaten, getProvince } from "../../../../functions/getLocation";
import { LocationAPI } from "../../../../interface/ILocationAPI";
import { GuestNavigationStackScreenProps } from "../../../StackParams/StackScreenProps";

const registerFormSchema = z.object({
    Username: z.string({ required_error: "Name cannot be empty" })
        .min(5, { message: "Name must be more than 5 characters" }),
    Nik: z.string({required_error: "NIK cannot be empty"}),
        // .min(16, {message: "NIK length atleast 16"}),
    Email: z.string({ required_error: "Email cannot be empty" }).email({ message: "Invalid email address" }),
    PhoneNumber: z.string({required_error: "Phone Number cannot be empty"})
        .min(11, {message: "Phone Number at least 11 characters"}),
    City : z.string({required_error : "City cannot be empty"})
        .min(1, {message : "Please select city"}),
    District : z.string({required_error : "Kabupaten cannot be empty"})
        .min(1, {message : "Please select kabupaten"}),
    Address : z.string({required_error : "Address cannot be empty"})
        .min(2, {message: "Address must be more than 2 characters"}),
    PostalCode : z.string({required_error: "Postal Code cannot be empty"})
        .max(5, {message: "Postal Code must be 5 or less characters"}),
    Province : z.string({required_error: "Province cannot be empty"})
        .min(1, {message : "Please select province"}),
    Password: z.string({ required_error: "Password cannot be empty" })
        .min(5, { message: "Password must be more than 5 character" }),
    ConfirmPassword: z.string({ required_error: "Confirm Password cannot be empty" })
        .min(5, { message: "Password must be more than 5 character" })
}).refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});


type RegisterFormType = z.infer<typeof registerFormSchema>

export const RegisterScreen: FC<GuestNavigationStackScreenProps<'Register'>> = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [provinces, setProvinces] = useState<LocationAPI[]>([]);
    const [cities, setCities] = useState<LocationAPI[]>([]);
    const [kabupatens, setKabupatens] = useState<LocationAPI[]>([]);

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<RegisterFormType>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            Nik : undefined,
            Username: undefined,
            Email: undefined,
            Password: undefined,
            ConfirmPassword: undefined,
            City : undefined,
            Province : undefined,
            District : undefined,
            Address : undefined,
            PostalCode : undefined,
            PhoneNumber : undefined,
        }
    });
    
    
    useEffect(() => {
        fetchProvinceData();
    }, []);

    const fetchProvinceData = async () => {
        const res = await getProvince();
        setProvinces(res?.data);
    };

    const fetchKabupatenData = async (provinceId : string) => {
        const res = await getKabupaten(provinceId);
        setKabupatens(res?.data);
    };

    const fetchCityData = async (kabupatenId : string) => {
        const res = await getCity(kabupatenId);
        setCities(res?.data);
    }

    const onKabupatenChange = (kabupatenId: string) => {
        if (kabupatenId === "") {
            setCities([]);
            return;
        }
        fetchCityData(kabupatenId);
        // setCities([]);
    };
    

    const onProvinceChange = (provinceId: string) => {
        if(provinceId === "") {
            setKabupatens([]);
            setCities([]);
            reset({District: "", City: ""});
            return;
        }
        fetchKabupatenData(provinceId);
        // setKabupatens([]);
        // setCities([]);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (data: RegisterFormType) => {
        const { Nik, Username, Email, PhoneNumber, City, District, Address, PostalCode, Province, Password, ConfirmPassword } = data;
        
        const selectedProvince = provinces.find(item => item.id === Province);
        const selectedKabupaten = kabupatens.find(item => item.id === data.District);
        const selectedCity = cities.find(item => item.id === data.City);
    
        const provinceName = selectedProvince ? selectedProvince.name : '';
        const kabupatenName = selectedKabupaten ? selectedKabupaten.name : '';
        const cityName = selectedCity ? selectedCity.name : '';
        const postalCode = parseInt(data.PostalCode);
    
        const body = {
            Nik,
            Username,
            Email,
            PhoneNumber,
            City: cityName,
            District: kabupatenName,
            Address,
            PostalCode : postalCode,
            Province: provinceName,
            State : "Indonesia",
            Password,
        };
        try {
            const response = await post(BackendApiUri.registerUser, body);
            if(response.status === 200) {
                navigation.navigate("VerifyOTP", {userId : response.data.Id, email : body.Email});
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaProvider className="flex-1 bg-white">
            <ScrollView>
                <View className="mb-8">
                    <View className="items-center my-10">
                        <View className="absolute left-7 top-1">
                            <Ionicons name="chevron-back" size={24} style={{backgroundColor: "#ECECEC", borderRadius:999, padding: 2.5}} color="black" onPress={() => navigation.goBack()} />
                        </View>
                        <Text className="text-2xl mb-5">Sign Up</Text>
                        <Image source={require('../../../../assets/logo-register.png')} />
                    </View>

                    <View style={style.inputBox}>
                        <Controller
                            name="Nik"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="NIK"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('Nik', text)}
                                    inputMode="numeric"
                                />
                            )}

                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.Nik?.message}</Text>

                    <View style={style.inputBox}>
                        <Controller
                            name="Username"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="Name"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('Username', text)}
                                />
                            )}

                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.Username?.message}</Text>

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
                        <Text style={style.phoneNumberPrefix}>+62</Text>
                        <Controller
                            name="PhoneNumber"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="Phone Number"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('PhoneNumber', text)}
                                    inputMode="numeric"
                                    maxLength={11}
                                />
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.PhoneNumber?.message}</Text>

                    <View style={style.inputSelect}>
                        <Controller
                            name="Province"
                            control={control}
                            render={({ field }) => (
                                <Picker
                                    style={{ flex: 1 }}
                                    selectedValue={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        onProvinceChange(value);
                                    }}
                                    mode="dropdown"
                                >
                                    <Picker.Item label="Select Province" value="" />
                                    {Object.values(provinces).map((item: LocationAPI) => (
                                        <Picker.Item label={item.name} value={item.id} key={item.id} />
                                    ))}
                                </Picker>
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.Province?.message}</Text>

                    <View style={style.inputSelect}>
                        <Controller
                            name="District"
                            control={control}
                            render={({ field }) => (
                                <Picker
                                    style={{ flex: 1 }}
                                    selectedValue={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        onKabupatenChange(value);
                                    }}
                                    enabled={!!watch("Province")}
                                    mode="dropdown"
                                >
                                    <Picker.Item label="Select Kabupaten" value=""/>
                                    {kabupatens && Object.values(kabupatens).map((item: LocationAPI) => (
                                        <Picker.Item label={item.name} value={item.id} key={item.id} />
                                    ))}
                                </Picker>
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.District?.message}</Text>

                    <View style={style.inputSelect}>
                        <Controller
                            name="City"
                            control={control}
                            render={({ field }) => (
                                <Picker
                                    style={{ flex: 1 }}
                                    selectedValue={field.value}
                                    onValueChange={field.onChange}
                                    mode="dropdown"
                                    enabled={!!watch("District")}
                                >
                                    <Picker.Item label="Select City" value=""/>
                                    {cities && Object.values(cities).map((item: LocationAPI) => (
                                        <Picker.Item label={item.name} value={item.id} key={item.id} />
                                    ))}
                                </Picker>
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.City?.message}</Text>

                    <View style={style.inputBox}>
                        <Controller
                            name="PostalCode"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="PostalCode"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('PostalCode', text)}
                                    inputMode="numeric"
                                    maxLength={5}
                                />
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.PostalCode?.message}</Text>

                    <View style={style.inputBox}>
                        <Controller
                            name="Address"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="Address"
                                    style={{ flex: 1, height: 40, textAlignVertical: 'top' }}
                                    onChangeText={(text: string) => setValue('Address', text)}
                                    multiline
                                />
                            )}
                        />
                    </View>
                    <Text style={style.errorMessage}>{errors.Address?.message}</Text>


                    <View style={style.inputBox}>
                        <Controller
                            name="Password"
                            control={control}
                            render={() => (
                                <TextInput
                                    placeholder="Password"
                                    style={{ flex: 1 }}
                                    onChangeText={(text: string) => setValue('Password', text)}
                                    secureTextEntry={showPassword}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={style.passwordToggleIcon}>
                            <Icon name={showPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={style.errorMessage}>{errors.Password?.message}</Text>

                    <View style={style.inputBox}>
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
                        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={style.passwordToggleIcon}>
                            <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} type="font-awesome" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={style.errorMessage}>{errors.ConfirmPassword?.message}</Text>

                    <TouchableOpacity 
                        style={[style.button, isSubmitting ? { backgroundColor: 'gray' } : null]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="flex-row items-center justify-center"
                    >
                        {isSubmitting && <ActivityIndicator color="white" />}
                        <Text className="text-center font-bold text-white">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center top-5">
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
    phoneNumberPrefix: {
        marginRight: 10, // Adjust the margin as needed
        fontSize: 18, // Adjust the font size as needed
        alignSelf: 'center', // Align the prefix vertically in the center
    },    
    inputSelect: {
        backgroundColor: "#F7F7F9",
        marginHorizontal: 30,
        borderBottomColor: "#488DF4",
        borderBottomWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch', // Ensure that children stretch to fill the container vertically
        overflow: 'hidden', // Hide any overflowing content
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
