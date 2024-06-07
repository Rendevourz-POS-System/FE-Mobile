import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminNavigationStackParams } from "./Admin/AdminNavigationStackParams";
import { ProfileNavigationStackParams } from "./Profile/ProfileNavigationStackParams";
import { AppNavigationStackParams } from "./Root/AppNavigationStackParams";
import { UserBottomTabParams } from "./RootBottomTab/UserBottomTabParams";
import { GuestNavigationStackParams } from "./GuestNavigationStackParams";

export type UserNavigationStackScreenProps<T extends keyof UserBottomTabParams> = NativeStackScreenProps<UserBottomTabParams, T>;
export type ProfileNavigationStackScreenProps<T extends keyof ProfileNavigationStackParams> = NativeStackScreenProps<ProfileNavigationStackParams, T>;
export type AdminNavigationStackScreenProps<T extends keyof AdminNavigationStackParams> = NativeStackScreenProps<AdminNavigationStackParams, T>;

export type GuestNavigationStackScreenProps<T extends keyof GuestNavigationStackParams> = NativeStackScreenProps<GuestNavigationStackParams, T>;