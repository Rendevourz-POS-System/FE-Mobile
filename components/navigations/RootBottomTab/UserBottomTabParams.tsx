import { NavigatorScreenParams } from "@react-navigation/native";
import { HomeUserNavigationStackParams } from "../HomeUserNavigationStackParams";
import { ProfileNavigationStackParams } from "../Profile/ProfileNavigationStackParams";

export type UserBottomTabParams = {
    Home: NavigatorScreenParams<HomeUserNavigationStackParams>;
    Profile: NavigatorScreenParams<ProfileNavigationStackParams>;
}