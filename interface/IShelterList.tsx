import { PetType } from "./IShelterFav";

export interface ShelterData {
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
    ShelterVerified: boolean;
    CreatedAt: string;
    Type: "Shelter";
}