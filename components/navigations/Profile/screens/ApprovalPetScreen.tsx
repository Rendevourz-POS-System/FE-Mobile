import React, { FC, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, ImageBackground, TouchableHighlight, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PetData } from '../../../../interface/IPetList';
import { get, post, put } from '../../../../functions/Fetch';
import { BackendApiUri } from '../../../../functions/BackendApiUri';
import { NoHeaderNavigationStackScreenProps, ProfileNavigationStackScreenProps } from '../../../StackParams/StackScreenProps';
import { truncateText } from '../../../../functions/TruncateText';
import { IUser } from '../../../../interface/IUser';
import { Request } from '../../../../interface/IRequest';

interface PetProps {
    Data: PetData
}


export const ApprovalPetScreen: FC<ProfileNavigationStackScreenProps<"ApprovalPetScreen">> = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<PetProps>({
        Data: {
            Id: "",
            ShelterId: "",
            PetName: "",
            PetType: "",
            PetAge: 0,
            PetGender: "",
            IsAdopted: false,
            ReadyToAdopt: false,
            PetDescription: "",
            ShelterLocation: "",
            IsVaccinated: false,
            OldImage: [],
            ImageBase64: [],
            CreatedAt: new Date(),
        }
    })
    const [userRequest, setUserRequest] = useState<IUser>();
    const [requestDetail, setRequestDetail] = useState<Request[]>([]);

    const fetchRequestDetail = async () => {
        try {
            const res = await get(`${BackendApiUri.findRequest}?requestId=${route.params.requestId}`);
            if(res.status === 200 && res.data) {
                setRequestDetail(res.data.Data);
            } 
        } catch(e) {
            console.log(e);
        }
    }

    const fetchUserRequest = async () => {
        try {
            const res = await get(`${BackendApiUri.getUserDetailById}/${route.params.userId}`);
            if (res?.data && res.status === 200) {
                setUserRequest(res.data)
            }
        } catch(e) {
            console.error(e)
        }
    }

    const fetchData = async () => {
        try {
            const response = await get(`${BackendApiUri.getPet}/${route.params.petId}`)
            if (response.status === 200) {
                setData(response.data)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        fetchUserRequest()
        fetchRequestDetail()
    }, [])

    const handleWhatsApp = (phoneNumber: string) => {
        const message = 'Halo saya ingin bertanya mengenai Hewan anda.';
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}&phone=${'+62' + phoneNumber}`);
    }

    const handleApprove = async () => {
        const body = {
            RequestId : route.params.requestId,
            Type: requestDetail[0].Type,
            Status: 'approved'
        }
        try {
            const res = await put(`${BackendApiUri.updateStatusRequest}`,body);
            if(res.Data) {
                Alert.alert("Success", "Pet berhasil di approved", 
                    [ { text: "OK", onPress: () => navigation.goBack()
    
                }]);
            }
        } catch(e) {
            console.log(e);
        }
    }

    const handleDecline = async () => {
        const body = {
            RequestId : route.params.requestId,
            Type: requestDetail[0].Type,
            Status: 'rejected'
        }
        try {
            const res = await put(`${BackendApiUri.updateStatusRequest}`,body);
            if(res.Data) {
                Alert.alert("Success", "Pet berhasil di decline", 
                    [ { text: "OK", onPress: () => navigation.goBack()
    
                }]);
            }
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <SafeAreaProvider className='bg-white'>
            {isLoading ? (
                <View className='flex-1 justify-center items-center'>
                    <ActivityIndicator size="large" color="#4689FD" />
                </View>
            ) : (
                <>
                    <View style={[styles.nextIcon, { position: 'absolute', left: 20, top: 17, zIndex: 1 }]}>
                        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                    </View>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', alignContent: 'center' }}>
                        <ImageBackground source={data?.Data.ImageBase64 == null ? require('../../../../assets/default_paw2.jpg') : { uri: `data:image/*;base64,${data?.Data.ImageBase64}` }} style={{ width: '100%', height: 400 }} />
                        <View className='pt-8 px-6 bottom-28 bg-white rounded-t-3xl border border-slate-300 border-b-0'>
                            <View className='flex flex-row justify-between'>
                                <Text className='text-3xl font-bold mr-2'>{truncateText(data?.Data.PetName, 30)}</Text>
                                {data?.Data.PetGender == "Male" ? (
                                    <FontAwesome6 name='mars' size={28} color='#4689FD' />
                                ) : (
                                    <FontAwesome6 name='venus' size={28} color='#FF6EC7' />
                                )}
                            </View>

                            <View className='mt-2 flex flex-row items-center'>
                                <MaterialIcons name="pets" size={21} color="#4689FD" />
                                <Text className='text-base text-[#8A8A8A] ml-2'>{data?.Data.PetType}</Text>
                            </View>

                            <View className="flex flex-row justify-between items-center mt-4">
                                <View className="flex-1 border-2 border-gray-300 px-4 py-4 mx-1 rounded-xl items-center justify-center" style={{ height: 75 }}>
                                    <Text className="text-gray-500 text-center">Vaksinasi</Text>
                                    <Text className="text-black font-bold mt-1">{data?.Data.IsVaccinated == true ? "Sudah" : "Belum"}</Text>
                                </View>
                                <View className="flex-1 border-2 border-gray-300 px-4 py-4 mx-1 text-center rounded-xl items-center justify-center" style={{ height: 75 }}>
                                    <Text className="text-gray-500 text-center">Umur</Text>
                                    <Text className="text-black font-bold mt-1">{data?.Data.PetAge} tahun</Text>
                                </View>

                            </View>

                            <Text className='mt-8 text-xl font-bold'>Deskripsi Hewan</Text>
                            <Text className='mt-2 text-base text-[#8A8A8A]'>{data?.Data.PetDescription}</Text>

                            <Text className='mt-8 text-xl font-bold'>Contact Person</Text>
                            {userRequest ? (
                                <TouchableOpacity className='bg-blue-100 rounded-md' onPress={() => handleWhatsApp(userRequest.PhoneNumber)}>
                                    <View className='ml-2 flex flex-row items-center gap-3 p-3'>
                                        <FontAwesome name="whatsapp" size={50} color="green" />
                                        <Text className='font-bold text-xl'>{userRequest.Username}</Text>
                                    </View>
                                </TouchableOpacity>

                            ) : (
                                <Text className='mt-2 text-base text-[#8A8A8A]'>Tidak ada kontak person</Text>
                            )}
                            </View>

                        <View className='mt-5 items-center pb-7 px-5 flex flex-row justify-around gap-5'>
                            <TouchableOpacity style={styles.adopsiButton} onPress={() => handleApprove()} className='w-5/12 py-3 rounded-xl'>
                                <Text style={styles.fontButton} className='text-xl text-center'>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{elevation: 5}} onPress={() => handleDecline()} className='w-5/12 py-3 rounded-xl bg-red-600'>
                                <Text style={styles.fontButton} className='text-xl text-center'>Decline</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </>
            )}
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nextIcon: {
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        padding: 5
    },
    fontButton: {
        color: 'white'
    },
    adopsiButton: {
        backgroundColor: "#4689FD",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Properti bayangan untuk Android
        elevation: 5,
    },
});
