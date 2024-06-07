import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./RootBottomTab/screens/HomeScreen";
import { HomeUserNavigationStackParams } from "./HomeUserNavigationStackParams";

const Stack = createNativeStackNavigator<HomeUserNavigationStackParams>();
export const HomeUserNavigationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="ShelterList" component={} options={{ headerShown: false }} />
            <Stack.Screen name="PetList" component={} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    )
}