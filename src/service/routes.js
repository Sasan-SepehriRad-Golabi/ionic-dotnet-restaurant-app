export const Account = {
  forgotPassword: '/api/account/forgotpassword',
  coupons: '/api/account/coupons',
  createPaymentIntent: '/api/account/createpaymentintent',
  createPaymentSecret: '/api/account/CreatePaymentSecret',

  getUserByToken: '/api/account/getuserbytoken',
  registerFcmToken: '/api/account/registerfcmtoken',
  register: '/api/account/register',
  createCustomerAccount: '/api/account/createcustomeraccount',
  login: '/api/account/login',
  createPaymentMethod: '/api/account/createpaymentmethod',

  paymentMethods: '/api/account/paymentmethods',
  defaultPaymentMethod: '/api/account/defaultpaymentmethod',
  statistics: '/api/account/statistics',
  updateUser: '/api/account/updateuser',
  uploadImage: '/api/account/uploadimage',
  credentials: '/api/account/credentials',
  ListCoupons: '/api/Account/ListCoupons',
  AddCoupons: '/api/Account/AddCoupons'
}
export const Restaurants = {
  restaurants: '/api/restaurants',
  allRestaurants: '/api/restaurants/all',
  search: '/api/restaurants/search'
}
export const Orders = {
  orders: '/api/v2/orders',
  last: '/api/v2/orders/last'
}
export const AddToJournal = {
  saveToJournal: "/api/UploadRestaurant/saveToJournal",
  checkIfUserSignedIn: "/api/UploadRestaurant/checkIfUserSignedIn"
}
export const Dishes = {
  dishes: '/api/dishes'
}
