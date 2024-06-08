import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeNavigationProp, CompositeScreenProps } from "@react-navigation/native";
import { UserBottomTabParams } from "../BottomTabs/UserBottomTabParams";
import { AppNavigationStackParams } from "../StackParams/App/AppNavigationStackParams";
import { ProfileNavigationStackParams } from "../StackParams/Profile/ProfileNavigationStackParams";

export type RootBottomTabCompositeNavigationProp<T extends keyof UserBottomTabParams> = CompositeNavigationProp<
    BottomTabNavigationProp<UserBottomTabParams, T>,
    NativeStackNavigationProp<AppNavigationStackParams>
>;

export type ProfileRootBottomTabCompositeScreenProps<T extends keyof ProfileNavigationStackParams> = CompositeScreenProps<
    NativeStackScreenProps<ProfileNavigationStackParams, T>,
    CompositeScreenProps<
        BottomTabScreenProps<UserBottomTabParams>,
        NativeStackScreenProps<ProfileNavigationStackParams>
    >
>;
