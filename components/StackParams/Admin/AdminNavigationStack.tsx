import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminNavigationStackParams } from "./AdminNavigationStackParams";
import HomeAdmin from "../../navigations/Admin/screens/HomeAdmin";
import { EditUserScreen } from "../../navigations/Admin/screens/EditUserScreen";
import { EditShelterScreen } from "../../navigations/Admin/screens/EditShelterScreen";
import { EditPetScreen } from "../../navigations/Admin/screens/EditPetScreen";

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