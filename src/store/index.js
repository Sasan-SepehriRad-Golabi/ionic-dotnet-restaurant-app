import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import dataModule from './dataModule'
import filterModule from '@/store/filterModule'
import orders from '@/store/modules/orders'
import geolocationModule from '@/store/modules/geolocationModule'

import mutations from './mutations'
import actions from './actions'
import state from './state'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    dataModule,
    filterModule,
    orders,
    geolocationModule
  },
  plugins: [createPersistedState({
    paths: [
      'token',
      'isFirstlyEnter',
      'isFirstlyHitFilter'
    ]
  })]
})
