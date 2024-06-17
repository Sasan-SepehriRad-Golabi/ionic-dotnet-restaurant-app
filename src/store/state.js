export default {
  isFirstlyEnter: false,
  isFirstlyHitFilter: false,
  status: '',
  token: localStorage.getItem('token') || '',
  user: {},
  restaurant: null,
  dish: null,
  pushInitStatus: false,
  firstEnter: true,
  deviceToken: '',
  iphone: false,
  preloadingForRestaurant: false,
  hideBottomMenu: false
}
