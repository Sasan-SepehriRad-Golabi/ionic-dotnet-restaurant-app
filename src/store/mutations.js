export default {
  setPushInitStatus(state) {
    state.pushInitStatus = true
  },
  setDataCard(state, last4) {
    state.user.last4 = last4
  },
  setFirstlyEnter(state, val) {
    state.isFirstlyEnter = val
  },
  setFirstlyHitFilter(state, val) {
    state.isFirstlyHitFilter = val
  },
  setDeviceToken(state, token) {
    state.deviceToken = token
  },
  setUser(state, val) {
    if (val.birthDate) {
      val.birthDate = val.birthDate.substring(0, 10)
    }
    state.user = val
  },
  setHideBottomMenu(state, status) {
    state.hideBottomMenu = status
  },
  setPreloadingForRestaurant(state, val) {
    state.preloadingForRestaurant = val
  },
  setIsPhone(state, status) {
    state.iphone = status
  },
  setDish(state, dish) {
    state.dish = dish
  },
  setRestaurant(state, rest) {
    state.restaurant = rest
  },
  changeCredentials(state, token) {
    state.token = token
  },
  setEmail(state, email) {
    state.email = email
  },
  auth_request(state) {
    state.status = 'loading'
  },
  auth_success(state, token) {
    state.status = 'success'
    state.token = token
  },
  auth_error(state) {
    state.status = 'error'
  },
  logout(state) {
    state.status = ''
    state.token = ''
    state.user = {}
  }
}
