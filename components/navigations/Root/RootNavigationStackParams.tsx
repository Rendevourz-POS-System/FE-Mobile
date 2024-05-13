import { NavigatorScreenParams } from "@react-navigation/native";
import { RootBottomTabParams } from "../RootBottomTab/RootBottomTabParams";

export type RootNavigationStackParams = {
    HomeScreen: NavigatorScreenParams<RootBottomTabParams>;
    TabMenu: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
    ShelterDetailScreen: {shelterId : string}
    DonateScreen: {bankNumber : string};
    HewanAdopsiScreen: undefined;
    PetDetailScreen: {petId : string};
    AdoptionFormScreen: undefined;
    RescueFormScreen: undefined;
    SurrenderFormScreen: undefined;
}