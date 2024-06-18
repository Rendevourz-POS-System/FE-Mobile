export interface PetData {
    Id : string;
    ShelterId : string;
    PetName : string;
    PetType : string;
    PetAge : number;
    PetGender : string;
    PetStatus : boolean;
    PetDescription : string;
    ShelterLocation : string;
    IsVaccinated : boolean;
    IsAdopted: boolean;
    Image : [];
    ImageBase64: [];
    CreatedAt : Date;
}