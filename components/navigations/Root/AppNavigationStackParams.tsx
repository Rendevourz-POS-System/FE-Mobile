import { NavigatorScreenParams } from "@react-navigation/native";
import { AdminNavigationStackParams } from "../Admin/AdminNavigationStackParams";
import { UserBottomTabParams } from "../RootBottomTab/UserBottomTabParams";
import { GuestNavigationStackParams } from "../GuestNavigationStackParams";

export type AppNavigationStackParams = {
    AdminStack: NavigatorScreenParams<AdminNavigationStackParams>;
    UserStack: NavigatorScreenParams<UserBottomTabParams>;
    GuestStack: NavigatorScreenParams<GuestNavigationStackParams>;
}