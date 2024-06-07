import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeNavigationProp, CompositeScreenProps } from "@react-navigation/native";
import { ProfileNavigationStackParams } from "./Profile/ProfileNavigationStackParams";
import { UserBottomTabParams } from "./RootBottomTab/UserBottomTabParams";
import { AppNavigationStackParams } from "./Root/AppNavigationStackParams";

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
