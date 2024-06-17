export default {
  namespaced: true,
  state: {
    dietaryTypes: [],
    dishesTypes: null,
    dishesCalories: null,
    promoDishes: null,
    openFilter: false,
    submitFilter: false,
    temporary: {
      dietaryTypes: [],
      dishesTypes: null,
      dishesCalories: null,
      promoDishes: null
    },
    filter: false
  },
  mutations: {
    setFilter(state, val) {
      state.filter = val
    },
    setDietaryTypes(state, val) {
      const index = state.temporary.dietaryTypes.indexOf(val)
      if (index >= 0) {
        state.temporary.dietaryTypes.splice(index, 1)
      } else {
        state.temporary.dietaryTypes.push(val)
      }
    },
    setDishesTypes(state, val) {
      if (state.temporary.dishesTypes === val) {
        state.temporary.dishesTypes = null
      } else {
        state.temporary.dishesTypes = val
      }
    },
    setDishesCalories(state, val) {
      state.temporary.dishesCalories = val
    },
    setPromoDishes(state, val) {
      state.temporary.promoDishes = val
    },
    clearAllFilter(state) {
      state.temporary.dietaryTypes = []
      state.temporary.dishesTypes = null
      state.temporary.dishesCalories = null
      state.temporary.promoDishes = null
    },
    closeFilter(state) {
      for (const prop in state.temporary) {
        state.temporary[prop] = state[prop]
      }
    },
    submitTemporaryValues(state) {
      state.dietaryTypes = [...state.temporary.dietaryTypes]
      state.dishesTypes = state.temporary.dishesTypes
      state.dishesCalories = state.temporary.dishesCalories
      state.promoDishes = state.temporary.promoDishes
    },
    setOpenFilter(state, val) {
      state.openFilter = val
    },
    setSubmitFilter(state, val) {
      state.submitFilter = val
    }
  },
  getters: {
    getDietaryTypes(state) {
      return state.dietaryTypes
    },
    getDishesTypes(state) {
      return state.dishesTypes
    },
    getDishesCalories(state) {
      return state.dishesCalories
    },
    getPromoDishes(state) {
      return state.promoDishes
    },
    getOpenFilter(state) {
      return state.openFilter
    },
    getSubmitFilter(state) {
      return state.submitFilter
    },
    getSubmit(state) {
      return {
        dishType: state.dishesTypes,
        calories: state.dishesCalories,
        dietaries: state.dietaryTypes,
        IsPromo: state.promoDishes
      }
    }
  }
}
