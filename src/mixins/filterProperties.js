import { mapState } from 'vuex'

export default {
  computed: mapState('filterModule', ['dietaryTypes', 'dishesCalories', 'dishesTypes', 'promoDishes', 'temporary'])
}
