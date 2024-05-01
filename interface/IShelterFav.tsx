export interface ShelterFav {
    Id: string;
    UserId: string;
    ShelterName: string;
    ShelterLocation: string;
    ShelterCapacity: number;
    ShelterContactNumber: string;
    ShelterDescription: string;
    TotalPet: number;
    BankAccountNumber: string;
    Pin: string;
    ShelterVerified: boolean;
    CreatedAt: string;
    Type: "Shelter";
    isFav : boolean;
}