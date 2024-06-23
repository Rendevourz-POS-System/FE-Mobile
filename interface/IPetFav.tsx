export interface PetFav {
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
    OldImage : [];
    ImageBase64: [];
    CreatedAt : Date;
    isFav : boolean;
}