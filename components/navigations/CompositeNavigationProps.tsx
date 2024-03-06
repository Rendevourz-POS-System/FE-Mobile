import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootBottomTabParams } from "./RootBottomTab/RootBottomTabParams";
import { RootNavigationStackParams } from "./Root/RootNavigationStackParams";
import { CompositeNavigationProp } from "@react-navigation/native";

export type RootBottomTabCompositeNavigationProp<T extends keyof RootBottomTabParams> = CompositeNavigationProp<
    BottomTabNavigationProp<RootBottomTabParams, T>,
    NativeStackNavigationProp<RootNavigationStackParams>
>;