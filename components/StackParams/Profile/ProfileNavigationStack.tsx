import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileNavigationStackParams } from "./ProfileNavigationStackParams";
import { ProfileScreen } from "../../navigations/Profile/screens/ProfileScreen";
import { ManageScreen } from "../../navigations/Profile/screens/ManageScreen";
import { NotificationScreen } from "../../navigations/Profile/screens/NotificationScreen";
import { HistoryScreen } from "../../navigations/Profile/screens/HistoryScreen";
import { FavoriteScreen } from "../../navigations/Profile/screens/FavoriteScreen";
import { ChangePasswordScreen } from "../../navigations/Profile/screens/ChangePasswordScreen";
import { ShelterScreen } from "../../navigations/Profile/screens/ShelterScreen";
import { ManageShelterScreen } from "../../navigations/Profile/screens/ManageShelterScreen";
import { CreatePetScreen } from "../../navigations/Profile/screens/CreatePetScreen";
import { HistoryShelterScreen } from "../../navigations/Profile/screens/HistoryShelterScreen";
import { ManagePetScreen } from "../../navigations/Profile/screens/ManagePetScreen";
import { ApprovalScreen } from "../../navigations/Profile/screens/ApprovalScreen";

const Stack = createNativeStackNavigator<ProfileNavigationStackParams>();

const ProfileNavigationStack: React.FC<{}> = () => {
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
            <Stack.Screen name="HistoryShelterScreen" component={HistoryShelterScreen} options={noHeader} />
            <Stack.Screen name="ManagePetScreen" component={ManagePetScreen} options={noHeader} />
            <Stack.Screen name="ApprovalScreen" component={ApprovalScreen} options={noHeader} />
        </Stack.Navigator>
    );
}

const noHeader : NativeStackNavigationOptions = {
    headerShown: false
};

export default ProfileNavigationStack;