export interface PetData {
    Id : string;
    ShelterId : string;
    PetName : string;
    PetType : string;
    PetAge : number;
    PetGender : string;
    PetDescription : string;
    ShelterLocation : string;
    IsVaccinated : boolean;
    IsAdopted: boolean;
    ReadyToAdopt: boolean;
    OldImage : [];
    ImageBase64: [];
    CreatedAt : Date;
}