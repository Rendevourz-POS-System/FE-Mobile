import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminNavigationStackParams } from "./AdminNavigationStackParams";
import HomeAdmin from "./screens/HomeAdmin";
import { EditUserScreen } from "./screens/EditUserScreen";

const Stack = createNativeStackNavigator<AdminNavigationStackParams>();

export const AdminNavigationStack: React.FC<{}> = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeAdmin" component={HomeAdmin} options={noHeader} />
            <Stack.Screen name="EditUserScreen" component={EditUserScreen} options={noHeader} />
        </Stack.Navigator>
    );
}

const noHeader : NativeStackNavigationOptions = {
    headerShown: false
};