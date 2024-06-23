export type ProfileNavigationStackParams = {
    ProfileScreen: undefined;
    ManageScreen: undefined;
    NotificationScreen: undefined;
    HistoryScreen: undefined;
    FavoriteScreen: undefined;
    ChangePasswordScreen: undefined;
    ShelterScreen: undefined;
    ManageShelterScreen: undefined;
    CreatePetScreen: { shelterId: string };
    HistoryShelterScreen: undefined;
    ManagePetScreen: { petId: string };
    ApprovalScreen: undefined;
    ApprovalPetScreen: {petId : string | null, userId: string | null, requestId: string | null}
}