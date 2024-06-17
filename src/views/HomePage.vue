<template>
  <ion-content>
    <transition name="push">
      <TopBar @closeInfoBar="closeInfoBar" showButton v-if="showTopBar"
        :style="`padding-top: ${iphone ? `50px` : `20px`}`" class="top-bar" :class="{ iphone }">
        <div class="restaurant-info-container flex-row">
          <img @click="$router.push({ name: `Restaurant`, params: { restaurant: rest } })" class="logo"
            :src="rest.logo || require('../assets/default11.jpg')" height="80px" width="80px" alt="">
          <span class="status" :class="{ open: rest.isOpen === 'open', pause: rest.isOpen === 'break' }">
            <p>{{ rest.isOpen }}</p>
          </span>
          <div class="flex-column description"
            @click="$router.push({ name: `Restaurant`, params: { restaurant: rest } })">
            <h6>{{ rest.name }}</h6>
            <span class="flex-row">
              <img class="icon"
                :src="require(`../assets/rest-category/${categories[rest.restaurantCategory].replace(' ', '')}.svg`)">
              <p class="flex-row_title">{{ categories[rest.restaurantCategory] }}</p>
            </span>
            <span class="flex-row">
              <img class="icon" src="../assets/icons/navigatorIcon.svg" alt="">
              <p class="flex-row_title">{{ distance }} km</p>
            </span>
          </div>
        </div>
      </TopBar>
    </transition>

    <div class="wrapper">
      <transition name="fadeInZooming">
        <FoodSlider v-if="showTopBar" :rest="rest" @compare="compare" @closeInfoBar="closeInfoBar" class="slider" />
      </transition>
      <transition name="fadeInZooming">
        <CompareFood v-if="selectedFoods && !showTopBar" :compareFoods="compareFoods" @deleteItem="deleteItem($event)"
          class="compare-foods" :class="{ iphone }" />
      </transition>
      <transition name="push">
        <CompareResult @closeCompareResult="closeCompareResult()" :compareFoods="compareFoods" v-if="showCompareResult"
          class="compare-result" />
      </transition>
      <!-- <Map @close-all="closeAll" @showInfo="showInfo" v-show="!showCompareResult" :restaurants="restaurants"
        class="map" /> -->
      <GoogleMap :restaurants="restaurants" @showInfo="showInfo" v-show="!showCompareResult" @close-all="closeAll" />
    </div>
  </ion-content>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { loadingController } from '@ionic/core'
import restaurantMixin from '@/mixins/restaurantMixin'
import api from '@/service/api'
import { Restaurants } from '@/service/routes'
import GoogleMap from "../components/GoogleMap.vue"

export default {
  name: 'HomePage',
  components: {
    GoogleMap,
    Map: () => import('../components/Map'),
    TopBar: () => import('../components/TopBar'),
    FoodSlider: () => import('../components/FoodSlider'),
    CompareFood: () => import('../components/CompareFood'),
    CompareResult: () => import('../components/CompareResult')
  },
  data() {
    return {
      showTopBar: false,
      compareFoods: [],
      selectedFoods: false,
      showCompareResult: false,
      restaurants: [],
      rest: null,
      categories: [
        'Casual restaurant',
        'Fast food',
        'Fine dining',
        'Bar',
        'Food truck'
      ],
      unwatchFilter: null,
      unwatchSubmit: null,
      watchHitFilter: null,
      waitingSendingOrder: {}
    }
  },
  props: {
    compareDish: {
      type: Object,
      required: false
    }
  },
  mounted() {
  },
  mixins: [restaurantMixin],
  async created() {
    this.$store.commit('setPreloadingForRestaurant', false)
    await this.getAllRestaurants()

  },
  computed: {
    getCurrentPositionComp() {
      const lat = this.$store.state.geolocationModule.currentPosition.lat
      const lng = this.$store.state.geolocationModule.currentPosition.lng
      if (lat && lng) {
        return {
          lat,
          lng
        }
      } else {
        return {
          lat: 11,
          lng: 11
        }
      }
    },
    ...mapGetters('filterModule', ['getSubmit']),
    ...mapState(['token', 'iphone']),
    ...mapState('filterModule', ['openFilter', 'submitFilter'])
  },
  methods: {
    ...mapMutations('filterModule', ['setSubmitFilter', 'setOpenFilter']),
    async openLoading() {
      this.waitingSendingOrder = await loadingController
        .create({
          message: 'Please wait...'
        })
      await this.waitingSendingOrder.present()
    },
    closeCompareResult() {
      this.showCompareResult = !this.showCompareResult
      this.compareFoods = []
    },
    showInfo(val) {
      this.rest = val
      this.showTopBar = true
      this.getDistance(this.rest.latitude, this.rest.longitude)
    },
    checkAllRestaurants(rests) {
      rests.map(rest => {
        rest.isOpen = this.checkIsOpen(rest)
      })
    },
    closeAll() {
      this.showTopBar = false
      this.showCompareResult = false
      this.$store.commit('setPreloadingForRestaurant', false)
    },
    closeInfoBar() {
      this.showTopBar = false
      this.$store.commit('setPreloadingForRestaurant', false)
    },
    compare(dish) {
      this.$store.commit('setPreloadingForRestaurant', false)
      this.showTopBar = false
      this.compareFoods.length > 1 && (this.compareFoods = [])
      this.compareFoods.push(dish)
      this.compareFoods.length > 1
        ? this.compareResult()
        : setTimeout(() => {
          this.selectedFoods = true
        }, 300)
    },
    compareResult() {
      this.showCompareResult = true
      this.selectedFoods = false
    },
    deleteItem(val) {
      this.compareFoods.splice(val, 1)
      if (this.compareFoods.length === 0) {
        this.selectedFoods = false
      }
    },
    async setParamsForRestaurants(data) {
      let str = ''
      const strArr = []

      data.dishType !== null && (strArr.push(`dishType=${data.dishType}`))
      if (data.dietaries.length) {
        data.dietaries.map(el => {
          strArr.push(`dietaries=${el}`)
        })
      }
      data.calories !== null && (strArr.push(`calories=${data.calories}`))
      data.IsPromo !== null && (strArr.push(`IsPromo=${data.IsPromo}`))
      if (strArr.length) {
        str = '?'
        strArr.map(e => {
          str += (e + '&')
        })
        str = str.slice(0, -1)
      }
      await this.searchRestaurants(str)
    },
    async searchRestaurants(str = '') {
      await this.openLoading()
      try {
        const { data } = await api.GET(Restaurants.search + str, this.token)
        this.restaurants = data
        this.checkAllRestaurants(this.restaurants)
        this.waitingSendingOrder.dismiss()
      } catch (e) {
        this.waitingSendingOrder.dismiss()
      }
    },
    async getAllRestaurants() {
      try {
        const { data } = await api.GET(Restaurants.restaurants)
        this.restaurants = data
        // console.log(this.restaurants)
        this.checkAllRestaurants(this.restaurants)
      } catch (e) {
      }
    }
  },
  activated() {
    this.$route.params.compareDish && this.compare(this.$route.params.compareDish)
    this.unwatchFilter = this.$watch('openFilter', (newVal) => {
      if (newVal) {
        this.showTopBar = false
        this.$store.commit('setPreloadingForRestaurant', false)
        this.selectedFoods = false
        this.showCompareResult = false
        this.setOpenFilter(false)
      }
    })
    this.$watch('isFirstlyHitFilter', (newVal) => {
    })

    this.unwatchSubmit = this.$watch('submitFilter', (newVal) => {
      if (newVal) {
        this.setParamsForRestaurants(this.getSubmit)
        this.setSubmitFilter(false)
      }
    })
  },
  deactivated() {
    this.unwatchFilter && this.unwatchFilter()
    this.unwatchSubmit && this.unwatchSubmit()
    this.showTopBar = false
    this.$store.commit('setPreloadingForRestaurant', false)
  }
}
</script>

<style lang="scss" scoped>
.iphone {
  padding-top: 40px;
}

.wrapper {
  margin-bottom: 120px;
  margin-top: 0;

  .map {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
  }

  .slider {
    width: 100%;
    position: fixed !important;
    z-index: 999;
    top: 150px !important;
    height: 320px;
  }
}

.compare-foods,
.compare-result {
  position: absolute;
  width: 100%;
  z-index: 999;
  top: 0;
}

.compare-result {
  width: 100%;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

.restaurant-info-container {
  width: 100%;
  margin-left: 20px;
  margin-top: -30px;
  position: relative;

  img {
    border-radius: 5px;
    margin-top: 18px;

    &.logo {
      position: relative;

    }
  }

  h6 {
    font-weight: 600;
  }

  .status {
    background-color: $color-light-red;
    height: 20px;
    padding: 0 5px;
    border-radius: 18px;
    position: absolute;
    bottom: 15px;
    left: 20px;

    p {
      font-size: 12px;
      color: #ffffff;
    }

    &.open {
      background-color: $color-green;
    }

    &.pause {
      background-color: #f5ce00;
    }
  }

  .description {
    margin-left: 20px;

    .icon {
      margin: -15px 5px 0 0;
    }

    .flex-row_title {
      line-height: 18px;
      padding: 3px 0;
    }
  }
}
</style>
