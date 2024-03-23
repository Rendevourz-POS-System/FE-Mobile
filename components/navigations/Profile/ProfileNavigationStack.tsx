import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileNavigationStackParams } from "./ProfileNavigationStackParams";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ManageScreen } from "./screens/ManageScreen";

const Stack = createNativeStackNavigator<ProfileNavigationStackParams>();

export const ProfileNavigationStack: React.FC<{}> = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={noHeader} />
            <Stack.Screen name="ManageScreen" component={ManageScreen} options={noHeader} />
        </Stack.Navigator>
    );
}

const noHeader : NativeStackNavigationOptions = {
    headerShown: false
};