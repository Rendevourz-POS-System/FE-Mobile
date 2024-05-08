export const baseUrl = "http://192.168.18.186:8080"

export const BackendApiUri = {
    registerUser : '/user/register',
    loginUser : baseUrl + '/user/login',

    getProvince : baseUrl,

    getShelterList : '/shelter',
    getShelterFav : '/shelter/favorite',
    postShelterFav : '/shelter_favorite/update',
    getPetList : '/pet/?search=&type=&age_start=&age_end=&location=&gender=&page=1&page_size=10&order_by=name&sort=Desc',
    getShelterDetail : '/shelter',
    getUserData : '/user/data',
    putUserUpdate: '/user/update'
}