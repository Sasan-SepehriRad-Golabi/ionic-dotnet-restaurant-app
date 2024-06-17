import api from "@/service/api";
import { Account } from "@/service/routes";

export default {
  actions: {
    async register({ commit, dispatch }, user) {
      commit('auth_request')
      return new Promise(async (resolve, reject) => {
        await api.POST(Account.register, user)
          .then(async resp => {
            const token = resp.data.token
            localStorage.setItem('token', token)
            commit('auth_success', token)
            await dispatch('createCustomerAccount', token)
            resolve()
          })
          .catch(err => {
            console.log('register error')
            commit('auth_error', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    async createCustomerAccount({ state }, token) {
      await api.GET(Account.createCustomerAccount, token)
        .then(function () {
          console.log('gut CreateCustomerAccount')
        })
        .catch(function (error) {
          console.log('error CreateCustomerAccount')
          console.log(error);
        })
    },
    async login({ commit, dispatch }, user) {
      commit('auth_request')
      console.log(user);
      return await api.POST(Account.login, user)
        .then(resp => {
          console.log("1111");
          const token = resp.data.token
          localStorage.setItem('token', token)
          commit('auth_success', token)
          dispatch('getLastOrder')
        })
        .catch(err => {
          console.log("22222");
          console.log(err)
          commit('auth_error')
          localStorage.removeItem('token')
        })
    },
  }
}
