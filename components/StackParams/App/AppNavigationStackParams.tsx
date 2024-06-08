import { NavigatorScreenParams } from "@react-navigation/native";
import { AdminNavigationStackParams } from "../Admin/AdminNavigationStackParams";
import { UserBottomTabParams } from "../../BottomTabs/UserBottomTabParams";
import { GuestNavigationStackParams } from "../Guest/GuestNavigationStackParams";

export type AppNavigationStackParams = {
    AdminStack: NavigatorScreenParams<AdminNavigationStackParams>;
    UserStack: NavigatorScreenParams<UserBottomTabParams>;
    GuestStack: NavigatorScreenParams<GuestNavigationStackParams>;
}