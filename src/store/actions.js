import api from '@/service/api'
import { Account } from '@/service/routes'
import router from '@/router'

export default {
  async getUser({ commit, state }, token = state.token) {
    return await api.GET(Account.getUserByToken, token)
      .then(resp => {
        commit('setUser', resp.data)
        console.log('GET USER BY TOKEN GOOD')
      })
      .catch(err => {
        console.log('GET USER BY TOKEN')
        router.push({ name: "Auth" })
        console.log(err)
      })
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('logout')
      commit('clearLastOrder')
      commit('clearNewOrder')
      localStorage.removeItem('token')
      localStorage.removeItem('last4')
      localStorage.removeItem('paymentIntent')

      resolve()
    })
  },
  async registerFCMToken({ state }, token) {
    await api.PUT(Account.registerFcmToken, '', token, {
      fcmToken: state.deviceToken
    })
      .then(resp => {
        console.log('GUT RegisterFCMToken')
      })
      .catch(err => {
        console.log(`ERROR RegisterFCMToken ${err}`)
      })
  }
}
