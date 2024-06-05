import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavigationStackParams } from "./Root/RootNavigationStackParams";
import { AdminNavigationStackParams } from "./Admin/AdminNavigationStackParams";
import { ProfileNavigationStackParams } from "./Profile/ProfileNavigationStackParams";

export type RootNavigationStackScreenProps<T extends keyof RootNavigationStackParams> = NativeStackScreenProps<RootNavigationStackParams, T>;
export type ProfileNavigationStackScreenProps<T extends keyof ProfileNavigationStackParams> = NativeStackScreenProps<ProfileNavigationStackParams, T>;
export type AdminNavigationStackScreenProps<T extends keyof AdminNavigationStackParams> = NativeStackScreenProps<AdminNavigationStackParams, T>;
