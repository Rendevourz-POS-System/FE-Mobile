import { Text } from "react-native"
import { View } from "react-native"
import { CreateNavigationStackParams } from "../../../StackParams/Create/CreateNavigationStackParams"
import { FC } from "react"
import { CreateNavigationStackScreenProps } from "../../../StackParams/StackScreenProps"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome6 } from "@expo/vector-icons"

export const CreateScreen : FC<CreateNavigationStackScreenProps<'ChooseScreen'>> = () => {
    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <View className="flex justify-center items-center mt-24">
                    <Text className="text-4xl font-bold">Choose What To Do:</Text>
                </View>
                <View className="w-full h-full flex flex-row justify-center items-center">
                    <View className="px-10 py-24 bg-blue-600 w-56 rounded-xl items-center">
                        <View className="p-3 bg-white rounded-full mb-3">
                            <FontAwesome6 name="kit-medical" size={36} color="blue"  />
                        </View>
                        <Text className="text-center text-white font-bold text-lg">Create Rescue</Text>
                    </View>
                    <View className="px-10 py-24 bg-blue-600 w-56 rounded-xl items-center ml-8">
                        <View className="mb-3">
                            <FontAwesome6 name="circle-plus" size={60} color="white"  />
                        </View>
                        <Text className="text-center text-white font-bold text-lg">Create Pet</Text>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}