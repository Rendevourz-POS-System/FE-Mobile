export interface ShelterFav {
    Id: string;
    UserId: string;
    ShelterName: string;
    ShelterLocation: string;
    ShelterLocationName : string;
    ShelterCapacity: number;
    ShelterContactNumber: string;
    ShelterDescription: string;
    PetTypeAccepted : PetType[];
    TotalPet: number;
    BankAccountNumber: string;
    Pin: string;
    ImageBase64 : [],
    ShelterVerified: boolean;
    CreatedAt: string;
    Type: "Shelter";
    isFav : boolean;
}

export interface PetType {
    Id : string;
}