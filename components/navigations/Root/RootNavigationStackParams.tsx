import { NavigatorScreenParams } from "@react-navigation/native";
import { RootBottomTabParams } from "../RootBottomTab/RootBottomTabParams";

export type RootNavigationStackParams = {
    Home: NavigatorScreenParams<RootBottomTabParams>;
    TabMenu: NavigatorScreenParams<RootBottomTabParams>;
    
}