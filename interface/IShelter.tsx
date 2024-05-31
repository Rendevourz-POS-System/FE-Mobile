export interface IShelter {
    Id: string;
    UserId: string;
    ShelterName: string;
    ShelterLocation: string;
    ShelterAddress: string;
    ShelterCapacity: number;
    ShelterContactNumber: string;
    ShelterDescription: string;
    PetTypeAccepted: string[];
    TotalPet: number;
    BankAccountNumber: string;
    Pin: string;
    ImagePath: [],
    ShelterVerified: boolean;
    CreatedAt: string;
}

export interface ShelterUser {
    Data: {
        Id: string;
        UserId: string;
        ShelterName: string;
        ShelterLocation: string;
        ShelterAddress: string;
        ShelterCapacity: number;
        ShelterContactNumber: string;
        ShelterDescription: string;
        PetTypeAccepted: string[];
        TotalPet: number;
        BankAccountNumber: string;
        Pin: string;
        ImagePath: [],
        ShelterVerified: boolean;
        CreatedAt: string;
    }
}