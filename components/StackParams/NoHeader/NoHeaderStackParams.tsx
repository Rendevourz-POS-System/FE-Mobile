import { NavigatorScreenParams } from "@react-navigation/native"
import { CreateNavigationStackParams } from "../Create/CreateNavigationStackParams"

export type NoHeaderStackParams = {
    TopTabs: undefined,
    ShelterDetailScreen: { shelterId: string | null }
    PetDetailScreen: { petId: string | null }
    AdoptionFormScreen: undefined
    HewanAdopsiScreen: { shelterId: string }
    DonateScreen: { bankNumber: string }
    Create: NavigatorScreenParams<CreateNavigationStackParams>;
}