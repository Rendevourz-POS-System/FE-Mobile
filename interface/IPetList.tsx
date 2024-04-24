export interface PetData {
    Id : string;
    ShelterId : string;
    PetName : string;
    PetType : string;
    PetAge : number;
    PetGender : string;
    PetStatus : boolean;
    PetDescription : string;
    Image : [];
    CreatedAt : Date;
    Type : "Pet";
}