import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootBottomTabParams } from "./RootBottomTab/RootBottomTabParams";
import { RootNavigationStackParams } from "./Root/RootNavigationStackParams";
import { CompositeNavigationProp, CompositeScreenProps } from "@react-navigation/native";
import { ProfileNavigationStackParams } from "./Profile/ProfileNavigationStackParams";

export type RootBottomTabCompositeNavigationProp<T extends keyof RootBottomTabParams> = CompositeNavigationProp<
    BottomTabNavigationProp<RootBottomTabParams, T>,
    NativeStackNavigationProp<RootNavigationStackParams>
>;

export type ProfileRootBottomTabCompositeScreenProps<T extends keyof ProfileNavigationStackParams> = CompositeScreenProps<
    NativeStackScreenProps<ProfileNavigationStackParams, T>,
    CompositeScreenProps<
        BottomTabScreenProps<RootBottomTabParams>,
        NativeStackScreenProps<RootNavigationStackParams>
    >
>;