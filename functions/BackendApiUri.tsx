export const baseUrl = "http://192.168.18.3:8080"

export const BackendApiUri = {
    registerUser : '/user/register',
    loginUser : baseUrl + '/user/login',
    getUserDetail : baseUrl + '/user/data',

    getPetTypes : '/pet-types',
    getLocation: '/shelter-location',
    verifyEmail : '/user/verify-email',
    resendOtp : '/user/resend-otp',
    getShelterList : '/shelter',
    getShelterFav : '/shelter/favorite',
    postShelterFav : '/shelter_favorite/update',
    getPetList : '/pet',
    getShelterDetail : '/shelter',
    getUserData : '/user/data',
    putUserUpdate: '/user/update',
    putUserUpdatePw: '/user/update-pw',
    postShelterRegister: '/shelter/register',
    getUserShelter: '/shelter/my-shelter'
}