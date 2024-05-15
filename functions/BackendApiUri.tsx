export const baseUrl = "http://192.168.18.186:8080"

export const BackendApiUri = {
    registerUser : '/user/register',
    loginUser : baseUrl + '/user/login',

    getPetTypes : '/pet-types',
    getLocation: '/shelter-location',

    getShelterList : '/shelter',
    getShelterFav : '/shelter/favorite',
    postShelterFav : '/shelter_favorite/update',
    getPetList : '/pet',
    getShelterDetail : '/shelter',
    getUserData : '/user/data',
    putUserUpdate: '/user/update',
    postShelterRegister: '/shelter/register'
}