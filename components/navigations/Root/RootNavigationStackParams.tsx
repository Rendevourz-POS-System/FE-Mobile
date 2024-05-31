import { NavigatorScreenParams } from "@react-navigation/native";
import { RootBottomTabParams } from "../RootBottomTab/RootBottomTabParams";
import { AdminNavigationStackParams } from "../Admin/AdminNavigationStackParams";

export type RootNavigationStackParams = {
    HomeScreen: NavigatorScreenParams<RootBottomTabParams>;
    TabMenu: undefined;
    LoginScreen: undefined;
    EmailScreen : undefined;
    VerifyOTPScreen : {userId: string | null, email : string | null};
    RegisterScreen: undefined;
    ShelterDetailScreen: {shelterId : string}
    DonateScreen: {bankNumber : string};
    HewanAdopsiScreen: undefined;
    PetDetailScreen: {petId : string};
    AdoptionFormScreen: {shelterId: string};
    RescueFormScreen: undefined;
    SurrenderFormScreen: undefined;
    HomeAdmin: NavigatorScreenParams<AdminNavigationStackParams>;
}