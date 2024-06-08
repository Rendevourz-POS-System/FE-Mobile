export const baseUrl = "http://192.168.43.15:8080"
// export const baseUrl = "http://192.168.200.245:8080"
// export const baseUrl = "http://172.20.10.4:8080"

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
    postShelterRegister: baseUrl + '/shelter/register',
    getUserShelter: '/shelter/my-shelter',
    postPet: '/pet/create',
    putShelterUpdate: '/shelter/update',
    getPet: '/pet',
    getUser: '/user',
    deleteAdminUser: '/admin/user/delete',
    deleteAdminShelter: '/admin/shelter/delete',
    deleteAdminPet: '/admin/pet/delete',
}