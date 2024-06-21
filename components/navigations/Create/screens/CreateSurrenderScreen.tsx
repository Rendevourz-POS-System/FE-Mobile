import { Text } from "react-native"
import { SafeAreaView, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { CreateNavigationStackScreenProps } from "../../../StackParams/StackScreenProps"
import { FC } from "react"
import { Ionicons } from "@expo/vector-icons"

export const CreateSurrenderScreen : FC<CreateNavigationStackScreenProps<'CreateSurrenderScreen'>> = ({navigation}) => {
    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <View>
                    <View className="mt-5 flex-row items-center justify-center mb-3">
                        <Ionicons name="chevron-back" size={24} color="black"
                            onPress={() => {
                                // if (image) {
                                //     removeImage(image!);
                                // }
                                navigation.goBack()
                            }}
                            style={{ position: 'absolute', left: 20 }} />
                        <Text className="text-xl">Create Pet Surrender</Text>
                    </View>
                    <Text>Ini halaman surrener</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}