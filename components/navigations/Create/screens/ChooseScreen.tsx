import { Text, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { FC } from "react"
import { CreateNavigationStackScreenProps } from "../../../StackParams/StackScreenProps"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons"

export const CreateScreen: FC<CreateNavigationStackScreenProps<'ChooseScreen'>> = ({ navigation, route }: any) => {
    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: "white" }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View className="flex justify-center items-center mt-24">
                    <Text className="text-4xl font-bold">Choose What To Do</Text>
                </View>
                <View className="w-full h-full flex flex-row justify-center items-center">
                    {/* <TouchableOpacity
                        className="px-5 py-20 bg-blue-600 w-40 rounded-xl items-center"
                        onPress={() => navigation.navigate("ChooseShelter", { type: 'Surrender' })}
                    >
                        <View className="mb-3">
                            <FontAwesome6 name="house-medical-circle-exclamation" size={55} color="white" />
                        </View>
                        <Text className="text-center text-white font-bold text-lg">Create Pet Surrender</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        className="px-5 py-20 bg-blue-600 w-40 rounded-xl items-center mb-12"
                        onPress={() => navigation.navigate("ChooseShelter", { type: 'Rescue' })}
                    >
                        <View className="mb-3">
                            <MaterialIcons name="warning" size={60} color="white" />
                        </View>
                        <Text className="text-center text-white font-bold text-lg">Create Pet Rescue</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}