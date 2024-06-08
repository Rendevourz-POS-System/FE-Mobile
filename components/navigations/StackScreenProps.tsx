import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminNavigationStackParams } from "./Admin/AdminNavigationStackParams";
import { ProfileNavigationStackParams } from "./Profile/ProfileNavigationStackParams";
import { AppNavigationStackParams } from "./Root/AppNavigationStackParams";
import { UserBottomTabParams } from "./RootBottomTab/UserBottomTabParams";
import { GuestNavigationStackParams } from "./GuestNavigationStackParams";

// Role User
// Navigate to UserBottomTab
export type UserNavigationStackScreenProps<T extends keyof UserBottomTabParams> = NativeStackScreenProps<UserBottomTabParams, T>;

// Navigate to Profile Screen
export type ProfileNavigationStackScreenProps<T extends keyof ProfileNavigationStackParams> = NativeStackScreenProps<ProfileNavigationStackParams, T>;

// Role Admin
// Navigate to Admin Screens
export type AdminNavigationStackScreenProps<T extends keyof AdminNavigationStackParams> = NativeStackScreenProps<AdminNavigationStackParams, T>;

// Role Guest
// Navigate to Guest Screens
export type GuestNavigationStackScreenProps<T extends keyof GuestNavigationStackParams> = NativeStackScreenProps<GuestNavigationStackParams, T>;