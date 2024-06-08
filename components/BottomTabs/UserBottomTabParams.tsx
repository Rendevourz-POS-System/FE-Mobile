import { NavigatorScreenParams } from "@react-navigation/native";
import { HomeUserNavigationStackParams } from "../StackParams/User/HomeUserNavigationStackParams";
import { ProfileNavigationStackParams } from "../StackParams/Profile/ProfileNavigationStackParams";

export type UserBottomTabParams = {
    Home: NavigatorScreenParams<HomeUserNavigationStackParams>;
    Profile: NavigatorScreenParams<ProfileNavigationStackParams>;
}