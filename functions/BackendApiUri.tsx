// export const baseUrl = "https://shelter-apps-v5z53glgzq-et.a.run.app"
// export const baseUrl = "http://192.168.43.15:8080"
export const baseUrl = "http://192.168.43.15:8080"

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
    postPetFav : '/pet_favorite/update',
    getPetFav : '/pet/favorite',
    getUser: '/user',
    postRequest: '/request/create',
    putPetUpdate: '/pet/update',
    deletePet: '/pet/delete',

    // Request
    postRequestDonation: '/request/donation',
    findRequest: '/request/find',
    rescueOrSurennder : '/request/rescue_or_surrender',
    
    // Admin
    deleteAdminUser: '/admin/user/delete',
    deleteAdminShelter: '/admin/shelter/delete',
    deleteAdminPet: '/admin/pet/delete',
    getAdminUserDetails:'/user/details',
    putAdminShelterUpdate:'/admin/shelter/update',
    putAdminUserUpdate: '/admin/user/update'
}