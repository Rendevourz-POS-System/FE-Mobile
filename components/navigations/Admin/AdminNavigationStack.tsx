import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminNavigationStackParams } from "./AdminNavigationStackParams";
import HomeAdmin from "./screens/HomeAdmin";
import { EditUserScreen } from "./screens/EditUserScreen";
import { EditShelterScreen } from "./screens/EditShelterScreen";
import { EditPetScreen } from "./screens/EditPetScreen";

const Stack = createNativeStackNavigator<AdminNavigationStackParams>();

export const AdminNavigationStack: React.FC<{}> = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeAdmin" component={HomeAdmin} options={noHeader} />
            <Stack.Screen name="EditUserScreen" component={EditUserScreen} options={noHeader} />
            <Stack.Screen name="EditShelterScreen" component={EditShelterScreen} options={noHeader} />
            <Stack.Screen name="EditPetScreen" component={EditPetScreen} options={noHeader} />
        </Stack.Navigator>
    );
}

const noHeader : NativeStackNavigationOptions = {
    headerShown: false
};