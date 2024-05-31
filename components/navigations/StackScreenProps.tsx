import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavigationStackParams } from "./Root/RootNavigationStackParams";
import { AdminNavigationStackParams } from "./Admin/AdminNavigationStackParams";

export type RootNavigationStackScreenProps<T extends keyof RootNavigationStackParams> = NativeStackScreenProps<RootNavigationStackParams, T>;
export type AdminNavigationStackScreenProps<T extends keyof AdminNavigationStackParams> = NativeStackScreenProps<AdminNavigationStackParams, T>;
