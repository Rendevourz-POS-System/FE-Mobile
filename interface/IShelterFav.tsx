export interface ShelterFav {
    Id: string;
    UserId: string;
    ShelterName: string;
    ShelterLocation: string;
    ShelterCapacity: number;
    ShelterContactNumber: string;
    ShelterDescription: string;
    PetTypeAccepted : PetType[];
    TotalPet: number;
    BankAccountNumber: string;
    Pin: string;
    ShelterVerified: boolean;
    CreatedAt: string;
    Type: "Shelter";
    isFav : boolean;
}

export interface PetType {
    Id : string;
}