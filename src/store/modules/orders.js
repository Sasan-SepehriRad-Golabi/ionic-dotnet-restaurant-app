import api from '@/service/api'
import { Orders } from '@/service/routes'

const state = {
  lastOrder: null,
  newOrder: {
    dishesIdCount: [],
    restarauntId: null
  },
  drinks: true,
  desserts: true
}

const getters = {
  getNewOrderDishes (state) {
    return state.newOrder.dishesIdCount
  },
  isLastOrderNotFinished (state) {
    if (!state.lastOrder) {
      return false
    } else return (state.lastOrder.orderStatus !== 5 && state.lastOrder.orderStatus !== 4)
  },
  isNewOrderInProgress (state) {
    return !!state.newOrder.dishesIdCount.length
  },
  getRestaurantId (state) {
    return state.newOrder.restarauntId
  },
  getLastOrder (state) {
    return state.lastOrder
  },
  getNewOrder (state) {
    return state.newOrder
  },
  getNewOrderDishesCount (state, getters) {
    if (getters.isLastOrderNotFinished) {
      return state.lastOrder.orderedItems.length
    } else return state.newOrder.dishesIdCount.length
  },
  getDessertsInNewOrder (state) {
    let result = false
    for (const dish of state.newOrder.dishesIdCount) {
      if (dish.dishType === 1) {
        result = true
        break
      }
    }
    return result
  },
  getDrinksInNewOrder (state) {
    let result = false
    for (const dish of state.newOrder.dishesIdCount) {
      if (dish.dishType === 2) {
        result = true
        break
      }
    }
    return result
  },
  getDrinks (state) {
    return state.drinks
  },
  getDesserts (state) {
    return state.desserts
  }
}

const mutations = {
  setLastOrder (state, data) {
    state.lastOrder = data
  },
  increaseDishInNewOrder (state, { count, index }) {
    state.newOrder.dishesIdCount[index].count = count
  },
  setDishInNewOrder (state, dish) {
    state.newOrder.dishesIdCount.push({ ...dish, index: state.newOrder.dishesIdCount.length })
  },
  setRestaurantId (state, id) {
    state.newOrder.restarauntId = id
  },
  clearNewOrder (state) {
    state.newOrder = {
      dishesIdCount: [],
      restarauntId: null
    }
  },
  clearLastOrder () {
    state.lastOrder = null
  },
  deleteFoodItem (state, index) {
    state.newOrder.dishesIdCount.splice(index, 1)
  },
  setDrinks (state, status) {
    state.drinks = status
  },
  setDesserts (state, status) {
    state.desserts = status
  }
}

const actions = {
  async getLastOrder ({ commit, rootState }) {
    try {
      const { data } = await api.GET(Orders.last, rootState.token)
      commit('setLastOrder', data)
    } catch (e) {
      console.log(e)
    }
  },
  increaseDishInNewOrder ({ commit }, data) {
    commit('increaseDishInNewOrder', data)
  },
  setComponentsOfNewOrder ({ commit, state }, { dish, restId }) {
    if (state.newOrder.restarauntId === null) {
      commit('setRestaurantId', restId)
    }
    commit('setDishInNewOrder', dish)
  },
  clearNewOrder ({ commit }) {
    commit('clearNewOrder')
  },
  deleteFoodItem ({ commit }, index) {
    commit('deleteFoodItem', index)
  },
  setDrinks ({ commit }, status) {
    commit('setDrinks', status)
  },
  setDesserts ({ commit }, status) {
    commit('setDesserts', status)
  },
  async postOrder ({ state, dispatch, rootState }) {
    const dishesIdCount = state.newOrder.dishesIdCount.map(el => {
      const { id, count, comment, dishComponentsIds } = el
      return { id, count, comment, dishComponentsIds }
    })
    const order = { ...state.newOrder, dishesIdCount }
    try {
      await api.POST(Orders.orders, order, rootState.token)
      dispatch('clearNewOrder')
      dispatch('getLastOrder')
    } catch (e) {
      console.log(e)
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
