export const baseUrl = "http://192.168.18.3:8080"

export const BackendApiUri = {
    registerUser : baseUrl + '/user/register',
    loginUser : baseUrl + '/user/login',

    getShelterList : '/shelter',
    getPetList : '/pet/?search=&type=&age_start=&age_end=&location=&gender=&page=1&page_size=10&order_by=name&sort=Desc',
    getShelterDetail : '/shelter',
    getUserData : '/user/data',
    


}