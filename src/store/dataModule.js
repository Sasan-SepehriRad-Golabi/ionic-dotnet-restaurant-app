const state = {
  actionMessage: false,
  profilePhoto: false,
  isFirstlyHitFilter: false
}

const getters = {
  getActionMessage(state) {
    return state.actionMessage
  },
  getProfilePhoto(state) {
    return state.profilePhoto
  },
  getIsFirstlyHitFilter(state) {
    return state.isFirstlyHitFilter
  },
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
}

const mutations = {
  setActionMessage(state, val) {
    state.actionMessage = val
  },
  setProfilePhoto(state, val) {
    state.profilePhoto = val
  },
  setFirstlyHitFilter(state, val) {
    console.log("22222");
    state.isFirstlyHitFilter = val
    console.log(state);
  }
}

const actions = {
  setActionMessage({ commit }, val) {
    commit('setActionMessage', val)
  },
  setProfilePhoto({ commit }, val) {
    commit('setProfilePhoto', val)
  },
  setFirstlyHitFilter({ commit }, val) {
    commit('setFirstlyHitFilter', val)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
