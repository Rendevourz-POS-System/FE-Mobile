import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileNavigationStackParams } from "./ProfileNavigationStackParams";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ManageScreen } from "./screens/ManageScreen";
import { NotificationScreen } from "./screens/NotificationScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { FavoriteScreen } from "./screens/FavoriteScreen";
import { ChangePasswordScreen } from "./screens/ChangePasswordScreen";
import { ShelterScreen } from "./screens/ShelterScreen";
import { ManageShelterScreen } from "./screens/ManageShelterScreen";
import { CreatePetScreen } from "./screens/CreatePetScreen";

const Stack = createNativeStackNavigator<ProfileNavigationStackParams>();

export const ProfileNavigationStack: React.FC<{}> = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={noHeader} />
            <Stack.Screen name="ManageScreen" component={ManageScreen} options={noHeader} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={noHeader} />
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={noHeader} />
            <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} options={noHeader} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={noHeader} />
            <Stack.Screen name="ShelterScreen" component={ShelterScreen} options={noHeader} />
            <Stack.Screen name="ManageShelterScreen" component={ManageShelterScreen} options={noHeader} />
            <Stack.Screen name="CreatePetScreen" component={CreatePetScreen} options={noHeader} />
        </Stack.Navigator>
    );
}

const noHeader : NativeStackNavigationOptions = {
    headerShown: false
};