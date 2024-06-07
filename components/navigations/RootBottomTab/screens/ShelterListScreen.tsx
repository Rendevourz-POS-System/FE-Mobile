import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import ShelterList from "../../../ShelterList"

export const ShelterListScreen = ({route} : any) => {
    const favAttempt = route.params
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                {/* <ShelterList favAttempt={favAttempt}/> */}
                <TouchableOpacity onPress={() => console.log("touch")} className="bg-slate-400 p-5">
                    <Text>Touchh</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}