import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavigationStackParams } from "./Root/RootNavigationStackParams";

export type RootNavigationStackScreenProps<T extends keyof RootNavigationStackParams> = NativeStackScreenProps<RootNavigationStackParams, T>;
