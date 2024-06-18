import { Text } from "react-native"
import { View } from "react-native"
import { CreateNavigationStackParams } from "../../../StackParams/Create/CreateNavigationStackParams"
import { FC } from "react"
import { CreateNavigationStackScreenProps } from "../../../StackParams/StackScreenProps"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

export const CreateScreen : FC<CreateNavigationStackScreenProps<'CreateScreen'>> = () => {
    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <Text>Hello World</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}