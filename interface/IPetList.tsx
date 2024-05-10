export interface PetData {
    Id : string;
    ShelterId : string;
    PetName : string;
    PetType : string;
    PetAge : number;
    PetGender : string;
    PetStatus : boolean;
    PetDescription : string;
    IsVaccinated : boolean;
    Image : [];
    CreatedAt : Date;
}