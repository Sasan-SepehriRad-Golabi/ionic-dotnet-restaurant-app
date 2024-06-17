<template>
  <ion-content v-touch="{
    right: () => $router.back()
  }">
    <div v-show="dish">
      <transition name="slide-fade">
        <div class="dish" v-show="!isIngredients">
          <img class="fixed-image" :src="dish.image || require('../assets/default43.svg')">
          <div class="info-restaurant" v-if="dish.restaurantId">
            <div class="rest">
              <img @click="restaurant && $router.push({ name: 'Restaurant', params: { restaurant: restaurant } })"
                class="logo" :src="restaurant.logo || require('../assets/default11.svg')" alt="">
              <div class="state">
                <h4>{{ restaurant.name }}</h4>
                <span class="open" v-if="getTodayTime">open</span>
                <span v-else>close</span>
              </div>
              <p>{{ distance }} km</p>
            </div>
            <a class="button"
              :href="`https://www.google.com/maps/search/?api=1&query=${this.restaurant.latitude},${this.restaurant.longitude}`">Get
              a direction</a>
          </div>
          <div class="info-dish">
            <div class="main-info">
              <h2>{{ dish.name }}</h2>
              <div class="scroll-section">
                <div class="filters">
                  <img v-for="(type, indtype) in dish.dietaryType" :key="indtype"
                    :src="require(`../assets/filter/${dietaryTypes[type.dietary]}.svg`)">
                </div>
              </div>
              <div class="chart-wrapper flex-row">
                <div class="pie-wrapper">
                  <PieChart class="chart" :chart-data="chartData1" :options="options" />
                  <p>{{ composition.Calories.count }}</p>
                  <span>kcal</span>
                </div>
                <div class="pie-wrapper">
                  <PieChart class="chart" :chart-data="chartData2" :options="options" />
                  <p>{{ composition.Carbs.count }}</p>
                  <span>carb</span>
                </div>
                <div class="pie-wrapper">
                  <PieChart class="chart" :chart-data="chartData3" :options="options" />
                  <p>{{ composition.Protein.count }}</p>
                  <span>prot</span>
                </div>
                <div class="pie-wrapper">
                  <PieChart class="chart" :chart-data="chartData4" :options="options" />
                  <p>{{ composition.Fat.count }}</p>
                  <span>fat</span>
                </div>
              </div>

              <p class="new-price">
                € {{ dish.isPromotional ? dish.promotionalPrice : dish.price }}
              </p>
              <p v-if="dish.isPromotional" class="old-price">
                € {{ dish.price.toFixed(2) }}
              </p>
              <p @click="compare()" class="compare">
                Compare
              </p>
            </div>
            <button @click="getTodayTime ? isIngredients = true : ''" class="add"
              :class="{ buttonUnactive: !getTodayTime }">
              {{ !isAddByAdmin ? isAddOneMore ?
                'Add one more' : 'Add to basket' :
                isAddOneMore ? 'Add one more' : 'Add to Journal'
              }}
            </button>
            <div class="description">
              <p>{{ dish.description }}</p>
            </div>
            <div class="composition">
              <Composition v-for="(comp, name, index) in composition" :elem="name" :count="comp.count" :unit="comp.unit"
                :key="index">
              </Composition>
              <Composition v-for="(comp, name, index) in additionalCompositions" :elem="name" :count="comp.count"
                :unit="comp.unit" :key="index">
              </Composition>
            </div>
          </div>

        </div>
      </transition>

      <transition name="slide-fade2">
        <Ingredients @back="back" v-if="isIngredients" :dish="dish" :isAddOneMore="isAddOneMore"
          :isAddByAdmin="isAddByAdmin" :dishIndex="dishIndex">
        </Ingredients>
      </transition>

    </div>
  </ion-content>
</template>

<script>
import restaurantMixin from '../mixins/restaurantMixin'
import api from '@/service/api'
import { Restaurants, Dishes } from '@/service/routes'

export default {
  name: 'CurrentDish',
  props: {
    isAddOneMore: {
      type: Boolean
    },
    toIngredients: {
      type: Boolean
    },
    isAddByAdmin: {
      type: Boolean
    },
    dishID: {
      type: Number
    },
    dishIndex: {
      type: Number
    }
  },
  data() {
    return {
      restaurant: {},
      counter1: 0,
      counter2: 0,
      counter3: 0,
      counter4: 0,
      chartData1: null,
      chartData2: null,
      chartData3: null,
      chartData4: null,
      options: {
        type: 'doughnut',
        cutoutPercentage: 70
      },
      isIngredients: false,
      ckal: 0,
      carb: 0,
      prot: 0,
      fat: 0,
      dietaryTypes: [
        'vegan',
        'vegetarian',
        'halal',
        'gluten-free',
        'dairy-free',
        'nut-free',
        'kosher'
      ],
      composition: {
        Calories: {
          count: 0,
          unit: 'kcal',
          bold: true
        },
        Carbs: {
          count: 0,
          unit: 'g',
          bold: true
        },
        Fat: {
          count: 0,
          unit: 'g',
          bold: true
        },
        Protein: {
          count: 0,
          unit: 'g',
          bold: true
        }
      },
      additionalCompositions: {
        'Saturated Fat': {
          count: 0,
          unit: 'g',
          bold: false
        },
        'Trans Fat': {
          count: 0,
          unit: 'g',
          bold: false
        },
        'Monounsaturated Fat': {
          count: 0,
          unit: 'g',
          bold: false
        },
        'Polyunsaturated Fat': {
          count: 0,
          unit: 'g',
          bold: false
        },
        'Omega 3 Fat': {
          count: 0,
          unit: 'g',
          bold: false
        },
        Cholesterol: {
          count: 0,
          unit: 'mg',
          bold: true
        },
        Sodium: {
          count: 0,
          unit: 'mg',
          bold: true
        },
        'Dietary Fiber': {
          count: 0,
          unit: 'g',
          bold: false
        },
        Sugar: {
          count: 0,
          unit: 'g',
          bold: false
        },
        Calcium: {
          count: 0,
          unit: 'mg',
          bold: false
        },
        Potassium: {
          count: 0,
          unit: 'mg',
          bold: true
        },
        Magnesium: {
          count: 0,
          unit: 'mg',
          bold: false
        },
        Iron: {
          count: 0,
          unit: 'mg',
          bold: false
        },
        Zinc: {
          count: 0,
          unit: 'mg',
          bold: false
        },
        'Vitamin A': {
          count: 0,
          unit: 'μg',
          bold: false
        },
        'Vitamin C': {
          count: 0,
          unit: 'mg',
          bold: false
        }
      },
      dish: {}
    }
  },
  components: {
    PieChart: () => import('../js/PieChart'),
    Composition: () => import('../components/Composition.vue'),
    Ingredients: () => import('../components/Ingredients.vue')
  },
  computed: {
    getTodayTime() {
      try {
        let day = (new Date().getDay() - 1)
        let hour = new Date().toLocaleTimeString('en-GB')
        for (let time of this.restaurant.times) {
          if ((day === time.day) || (day === -1 && time.day === 6)) {
            if (time?.pauses?.length) {
              for (let pause of time.pauses) {
                let start = pause.pauseStart.substring(11)
                let end = pause.pauseEnd.substring(11)
                if (hour > start && hour < end) {
                  return 'break'
                }
              }
            }
            let start = time.openingTime.substring(11)
            let end = time.closingTime.substring(11)
            if (hour > start && hour < end) {
              return true
            }
          }
        }
        return false
      }
      catch (e) {
        return false
      }
      // console.log("ggg");
      // console.log(this.restaurant);
      // console.log(this.restaurant.times);
      // if (this.restaurant.times) {
      //   let open = false
      //   const day = (new Date().getDay() - 1)
      //   const hour = new Date().toLocaleString([], { hour12: false }).substring(11, 19)
      //   for (const time of this.restaurant.times) {
      //     if ((day === time.day) || (day === -1 && time === 6)) {
      //       const start = time.openingTime.substring(11, 19)
      //       const end = time.closingTime.substring(11, 19)
      //       console.log(start); console.log(end); console.log(hour);
      //       if (hour.trim() > start.trim() && hour.trim() < end.trim()) {
      //         console.log("is open");
      //         open = true
      //       }
      //     }
      //   }
      //   return open
      // }
      // return false
    },
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
          lat: 50.8476,
          lng: 4.3501
        }
      }
    },
  },
  mixins: [restaurantMixin],
  async created() {
    console.log("oooooooooo")
    try {
      const { data } = await api.GET(`${Dishes.dishes}/${this.dishID}`)
      this.dish = data
    } catch (e) {
      console.log(e)
    }
    this.toIngredients && (this.isIngredients = true)
    await this.setRestaurant()
    await this.dish.components.length && this.setComposition()
    setTimeout(() => {
      this.setAllData()
    }, 300)
  },
  methods: {
    async setRestaurant() {
      try {
        const { data } = await api.GET(`${Restaurants.allRestaurants}/${this.dish.restaurantId}`, this.$store.state.token)
        console.log(data);
        this.restaurant = data
      } catch (e) {
        console.log(e)
      }
      console.log("lllllllllll")
      console.log(this.restaurant.latitude)
      console.log(this.restaurant.longitude)
      this.getDistance(this.restaurant.latitude, this.restaurant.longitude)
    },
    setComposition() {
      this.dish.components.map(el => {
        console.log("kkkkkk");
        console.log(this.dish);
        if (el.ingredientType === 0) {
          this.composition.Calories.count += +(el.ingredient.energy_KCal * (el.weight / 100)).toFixed()
          this.composition.Carbs.count += +(el.ingredient.carbohydrates_G * (el.weight / 100)).toFixed()
          this.composition.Fat.count += +(el.ingredient.fat_G * (el.weight / 100)).toFixed()
          this.composition.Protein.count += +(el.ingredient.proteins_G * (el.weight / 100)).toFixed()

          this.additionalCompositions.Sodium.count += Math.round(el.ingredient.sodium_MG * el.weight / 100)
          this.additionalCompositions['Dietary Fiber'].count += Math.round(el.ingredient.fibresSum_G * el.weight / 100)
          this.additionalCompositions.Sugar.count += Math.round(el.ingredient.sugars_G * el.weight / 100)
          this.additionalCompositions.Potassium.count += Math.round(el.ingredient.potassium_MG * el.weight / 100)
          this.additionalCompositions.Cholesterol.count += Math.round(el.ingredient.cholesterol_MG * el.weight / 100)
          this.additionalCompositions['Omega 3 Fat'].count += Math.round(el.ingredient.fA_omega_3_sum_G * el.weight / 100)
          this.additionalCompositions.Calcium.count += Math.round(el.ingredient.calcium_MG * el.weight / 100)
          this.additionalCompositions.Magnesium.count += Math.round(el.ingredient.magnesium_MG * el.weight / 100)
          this.additionalCompositions.Iron.count += Math.round(el.ingredient.iron_MG * el.weight / 100)
          this.additionalCompositions.Zinc.count += Math.round(el.ingredient.zinc_MG * el.weight / 100)
          this.additionalCompositions['Vitamin A'].count += Math.round(el.ingredient.vitA_Activity_MCG * el.weight / 100)
          this.additionalCompositions['Vitamin C'].count += Math.round(el.ingredient.vitC_MG * el.weight / 100)
          this.additionalCompositions['Monounsaturated Fat'].count += Math.round(el.ingredient.fA_monounsat_sum_G * el.weight / 100)
          this.additionalCompositions['Polyunsaturated Fat'].count += Math.round(el.ingredient.fA_polyunsat_sum_G * el.weight / 100)
          this.additionalCompositions['Trans Fat'].count += Math.round(el.ingredient.fA_trans_sum_G * el.weight / 100)
          this.additionalCompositions['Saturated Fat'].count += Math.round(el.ingredient.fattyAcidsSaturated_G * el.weight / 100)
        }
      })

      const groups = []
      for (const ingr of this.dish.components) {
        if (ingr.ingredientType === 1) {
          groups.push(ingr.substituteGroup)
        }
      }
      const uniq = new Set(groups)
      const uniqArr = [...uniq]

      for (const group of uniqArr) {
        for (const el of this.dish.components) {
          if (el.ingredientType === 1) {
            if (el.substituteGroup === group) {
              this.composition.Calories.count += +(el.ingredient.energy_KCal * (el.weight / 100)).toFixed()
              this.composition.Carbs.count += +(el.ingredient.carbohydrates_G * (el.weight / 100)).toFixed()
              this.composition.Fat.count += +(el.ingredient.fat_G * (el.weight / 100)).toFixed()
              this.composition.Protein.count += +(el.ingredient.proteins_G * (el.weight / 100)).toFixed()

              this.additionalCompositions.Sodium.count += Math.round(el.ingredient.sodium_MG * el.weight / 100)
              this.additionalCompositions['Dietary Fiber'].count += Math.round(el.ingredient.fibresSum_G * el.weight / 100)
              this.additionalCompositions.Sugar.count += Math.round(el.ingredient.sugars_G * el.weight / 100)
              this.additionalCompositions.Potassium.count += Math.round(el.ingredient.potassium_MG * el.weight / 100)
              this.additionalCompositions.Cholesterol.count += Math.round(el.ingredient.cholesterol_MG * el.weight / 100)
              this.additionalCompositions['Omega 3 Fat'].count += Math.round(el.ingredient.fA_omega_3_sum_G * el.weight / 100)
              this.additionalCompositions.Calcium.count += Math.round(el.ingredient.calcium_MG * el.weight / 100)
              this.additionalCompositions.Magnesium.count += Math.round(el.ingredient.magnesium_MG * el.weight / 100)
              this.additionalCompositions.Iron.count += Math.round(el.ingredient.iron_MG * el.weight / 100)
              this.additionalCompositions.Zinc.count += Math.round(el.ingredient.zinc_MG * el.weight / 100)
              this.additionalCompositions['Vitamin A'].count += Math.round(el.ingredient.vitA_Activity_MCG * el.weight / 100)
              this.additionalCompositions['Vitamin C'].count += Math.round(el.ingredient.vitC_MG * el.weight / 100)
              this.additionalCompositions['Monounsaturated Fat'].count += Math.round(el.ingredient.fA_monounsat_sum_G * el.weight / 100)
              this.additionalCompositions['Polyunsaturated Fat'].count += Math.round(el.ingredient.fA_polyunsat_sum_G * el.weight / 100)
              this.additionalCompositions['Trans Fat'].count += Math.round(el.ingredient.fA_trans_sum_G * el.weight / 100)
              this.additionalCompositions['Saturated Fat'].count += Math.round(el.ingredient.fattyAcidsSaturated_G * el.weight / 100)
              break
            }
          }
        }
      }
    },
    setAllData() {
      this.chartData1 = {
        datasets: [{
          data: [this.composition.Calories.count, 0],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
      this.chartData2 = {
        datasets: [{
          data: [this.composition.Carbs.count, (this.composition.Calories.count - this.composition.Carbs.count * 4)],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
      this.chartData3 = {
        datasets: [{
          data: [this.composition.Protein.count, (this.composition.Calories.count - this.composition.Protein.count * 4)],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
      this.chartData4 = {
        datasets: [{
          data: [this.composition.Fat.count, (this.composition.Calories.count - this.composition.Fat.count * 9)],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
    },
    back() {
      this.isIngredients = false
    },
    compare() {
      this.$router.push({
        name: 'Home',
        params: { compareDish: this.dish }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/animations.scss';

* {
  margin: 0;
}

.dish {
  position: absolute;
  overflow-y: auto;
  height: 100vh;
  padding-bottom: 100px;

  .fixed-image {
    width: 100vw;
  }

  .info-restaurant {
    background: white;
    width: 90vw;
    margin: 0 auto;
    height: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rest {
      height: 50px;
      display: flex;
      align-items: center;

      .logo {
        border-radius: 50%;
        height: 48px;
        width: 48px;
      }

      .state {
        margin-left: 12px;

        h4 {
          @include fontMontserrat(11px, 600, 15px);
          text-transform: capitalize;
          color: $color-strong-grey;
          transform: translateY(-5%);
        }

        span {
          @include fontMontserrat(10px, 600, 12px);
          width: 45px;
          height: 16px;
          background: $color-light-red;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          transform: translateY(5%);
        }

        .open {
          background-color: $color-green;
        }
      }

      p {
        margin: 0;
        @include fontMontserrat(11px, 600, 15px);
        text-transform: capitalize;
        color: $color-strong-grey;
        margin-left: 20px;
        transform: translateY(-58%);
      }
    }

    button {
      width: 144px;
      height: 44px;
      @include fontMontserrat(13px, 600, 17px);
      text-align: center;
      color: $color-light-red;
      background: $color-red-tab;
      // transform: translateX(3vw);
    }

    .button {
      width: 150px;
      height: 44px;
      border-radius: 10px;
      @include fontMontserrat(13px, 700, 44px);
      text-align: center;
      text-decoration: none;
      color: $color-light-red;
      background: $color-red-tab;
    }
  }

  .info-dish {
    .description {
      padding: 20px 0;

      p {
        @include fontMontserrat(14px, 600, 24px);
        letter-spacing: 0.9px;
        color: $color-strong-grey;
        width: 80vw;
        margin: 0 auto;
        text-align: justify;
      }
    }

    .main-info {
      h2 {
        display: flex;
        justify-content: center;
        @include fontMontserrat(18px, bold, 22px);
        margin-bottom: 20px;
        color: #2F3741;
      }

      .scroll-section {
        overflow-x: scroll;
        width: 80vw;
        margin: 0 auto;

        .filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;

          img {
            width: 30px;
            margin: 4px 8px;
          }

          .active {
            background: $color-light-red;
            color: white;
          }
        }
      }

      .chart-wrapper {
        justify-content: space-around;
        width: 80vw;
        margin: 0 auto;

        .pie-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            position: absolute;
            font-size: 10px;
            top: 40px;
          }

          .chart {
            width: 70px;
          }

          p {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            margin: 0;
            text-align: center;
            font-weight: 600;
            color: black;
            font-size: 12px;
          }
        }
      }

      .new-price {
        display: inline-block;
        margin: 25px 17px 17px 35px;
        @include fontMontserrat(22px, bold, 27px);
        color: #2F3741;
      }

      .old-price {
        @include fontMontserrat(14px, 500, 17px);
        color: $color-strong-grey;
        display: inline-block;
        text-decoration: line-through;
      }

      .compare {
        float: right;
        margin-top: 25px;
        margin-right: 35px;
        transform: translateY(25%);
        @include fontMontserrat(14px, bold, 17px);
        color: $color-light-red;
      }
    }

    .add {
      margin: 0 auto;
      margin-bottom: 25px;
      display: flex;
      width: 85vw;
      height: 48px;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      @include fontMontserrat(14px, bold, 17px);
      color: #FFFFFF;
      background: $color-light-red;
    }

    .buttonUnactive {
      background-color: $color-strong-grey;
    }
  }
}
</style>
