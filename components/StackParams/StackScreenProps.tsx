import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminNavigationStackParams } from "./Admin/AdminNavigationStackParams";
import { ProfileNavigationStackParams } from "./Profile/ProfileNavigationStackParams";
import { AppNavigationStackParams } from "./App/AppNavigationStackParams";
import { UserBottomTabParams } from "../BottomTabs/UserBottomTabParams";
import { GuestNavigationStackParams } from "./Guest/GuestNavigationStackParams";
import { HomeUserNavigationStackParams } from "./User/HomeUserNavigationStackParams";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NoHeaderStackParams } from "./NoHeader/NoHeaderStackParams";
import { CreateNavigationStackParams } from "./Create/CreateNavigationStackParams";



// Role User
// Navigate Screens that have a bottom tab
export type UserBottomTabCompositeNavigationProps<T extends keyof UserBottomTabParams> = 
    CompositeNavigationProp<
        BottomTabNavigationProp<UserBottomTabParams, T>,
        CompositeNavigationProp<
            NativeStackNavigationProp<HomeUserNavigationStackParams>,
            NativeStackNavigationProp<ProfileNavigationStackParams>
        >
    >;
// Navigate Screens that doesnt have a Header Welcome back
export type NoHeaderNavigationStackScreenProps<T extends keyof NoHeaderStackParams> = NativeStackScreenProps<NoHeaderStackParams, T>;

export type CreateNavigationStackScreenProps<T extends keyof CreateNavigationStackParams> = NativeStackScreenProps<CreateNavigationStackParams, T>;

// Navigate to UserBottomTab
export type UserNavigationStackScreenProps<T extends keyof UserBottomTabParams> = NativeStackScreenProps<UserBottomTabParams, T>;
export type HomeUserNavigationStackScreenProps<T extends keyof HomeUserNavigationStackParams> = NativeStackScreenProps<HomeUserNavigationStackParams, T>;

// Navigate to Profile Screen
export type ProfileNavigationStackScreenProps<T extends keyof ProfileNavigationStackParams> = NativeStackScreenProps<ProfileNavigationStackParams, T>;

// Role Admin
// Navigate to Admin Screens
export type AdminNavigationStackScreenProps<T extends keyof AdminNavigationStackParams> = NativeStackScreenProps<AdminNavigationStackParams, T>;

// Role Guest
// Navigate to Guest Screens
export type GuestNavigationStackScreenProps<T extends keyof GuestNavigationStackParams> = NativeStackScreenProps<GuestNavigationStackParams, T>;