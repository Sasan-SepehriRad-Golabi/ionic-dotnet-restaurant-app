<template>
  <div>
    <ion-slides pager="true" ref="slides" @ionSlideDidChange="ionSlideDidChange" v-show="true">

      <ion-slide v-for="(dish, index) in filteredDishes" :key="index">
        <ion-card v-if="(currentSlide === index) || (currentSlide + 1 === index) || (currentSlide - 1 === index)">
          <ion-card-content>
            <div class="flex-row ">
              <div class="flex-column left-column img-with-price">
                <img
                  @click="$router.push({ name: 'Dish', params: { dishID: dish.id, restIsOpen: rest.isOpen, isAddByAdmin: rest.isAddByAdmin } })"
                  :src="dish.image || require('../assets/default11.svg')">
                <div class="price">
                  <p class="price-new">
                    € {{ dish.isPromotional ? dish.promotionalPrice.toFixed(2) : dish.price.toFixed(2) }}
                  </p>
                  <p v-if="dish.isPromotional" class="price-old">
                    € {{ dish.price.toFixed(2) }}
                  </p>
                </div>
              </div>

              <div class="flex-column right-column">
                <ion-label>
                  {{ dish.name }}
                </ion-label>
                <span class="flex-row foods-type">
                  <img v-for="(type, indtype) in onlyFourDietary(dish.dietaryType)" :key="indtype"
                    :src="require(`../assets/filter/${dietaryTypesTemplate[type.dietary]}.svg`)">
                  <span v-if="dish.dietaryType.length > onlyFourDietary(dish.dietaryType).length">
                    ...
                  </span>
                </span>
                <div class="chart-wrapper flex-row">
                  <div class="pie-wrapper">
                    <PieChart class="chart" :chart-data="chartData1" :options="options" />
                    <p>{{ getCounter('energy_KCal', dish.components) }}</p>
                    <span>kcal</span>
                  </div>
                  <div class="pie-wrapper">
                    <PieChart class="chart" :chart-data="chartData2" :options="options" />
                    <p>{{ getCounter('carbohydrates_G', dish.components) }}</p>
                    <span>carb</span>
                  </div>
                  <div class="pie-wrapper">
                    <PieChart class="chart" :chart-data="chartData3" :options="options" />
                    <p>{{ getCounter('proteins_G', dish.components) }}</p>
                    <span>prot</span>
                  </div>
                  <div class="pie-wrapper">
                    <PieChart class="chart" :chart-data="chartData4" :options="options" />
                    <p>{{ getCounter('fat_G', dish.components) }}</p>
                    <span>fat</span>
                  </div>
                </div>
                <!-- <div
                  @click="rest.isOpen === 'open' ? $router.push({name: 'Dish',  params:{dishID: dish.id, toIngredients: true}}) : ''">
                  <Button class="button" :class="{buttonUnactive: rest.isOpen !== 'open'}">
                    Add to basket
                  </Button>
                </div> -->
                <div v-if="!rest.isAddByAdmin">
                  <div
                    @click="rest.isOpen === 'open' ? $router.push({ name: 'Dish', params: { dishID: dish.id, toIngredients: true, isAddByAdmin: false } }) : $router.push({ name: 'Dish' })">
                    <Button class="button" :class="{ buttonUnactive: rest.isOpen !== 'open' }">
                      Add to basket
                    </Button>
                  </div>
                </div>
                <div v-if="rest.isAddByAdmin">
                  <div @click="AddToJournal(dish)">
                    <Button class="button" :class="{ buttonUnactive: rest.isOpen !== 'open' }">
                      Add to Journal
                    </Button>
                  </div>
                  <!-- <div @click="rest.isOpen === 'open' ? !addJournalClicked ? addToJournal(dish.id) : '' : ''">
                    <Button class="button" :class="{ buttonUnactive: rest.isOpen !== 'open' }">
                      Add to Journal
                    </Button>
                  </div> -->
                </div>
                <!-- <div
                  @click="rest.isOpen === 'open' && !rest.isAddByAdmin ? $router.push({ name: 'Dish', params: { dishID: dish.id, toIngredients: true } }) : ''">
                  <Button class="button" :class="{ buttonUnactive: rest.isOpen !== 'open' || rest.isAddByAdmin }">
                    Add to basket
                  </Button>
                </div> -->
                <p @click="compare(dish)" class="compare-btn">Compare</p>

              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-slide>
    </ion-slides>
    <div style="padding-top: 20px" v-show="!filteredDishes.length">
      <ion-card>
        <ion-card-content>
          <div class="flex-row no-dishes">
            <span class="close" @click="closeModal()">+</span>
            <div class="content">
              <img src="../assets/no-dishes.svg" alt="">
              <p>There are no suitable dishes in this restaurant</p>
              <p>Try choose other restaurant</p>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</template>

<script>
import filterProperties from '@/mixins/filterProperties'
import api from '@/service/api'
import { mapState } from 'vuex'
export default {
  name: 'FoodSlider',
  props: ['rest'],
  data() {
    return {
      slideOpts: {
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          dynamicBullets: true
        }
      },
      chartData1: null,
      chartData2: null,
      chartData3: null,
      chartData4: null,
      options: {
        type: 'doughnut',
        cutoutPercentage: 70
      },
      itemToBasket: false,
      currentSlide: 0,
      dietaryTypesTemplate: [
        'vegan',
        'vegetarian',
        'halal',
        'gluten-free',
        'dairy-free',
        'nut-free',
        'kosher'
      ]
    }
  },
  components: {
    PieChart: () => import('../js/PieChart'),
    Button: () => import('../components/buttons/DefaultButton')
  },
  async mounted() {
    setTimeout(() => {
      this.setAllData()
    }, 300)
    try {
      this.$refs.slides.options = this.slideOpts
    } catch (e) {
      // console.log(e)
    }
    // this.$store.commit('setPreloadingForRestaurant', false)
  },
  computed: {
    ...mapState(['token']),
    dishes() {
      const res = []
      this.rest.menu.map(menu => {
        menu.dishCategories.map(sub => {
          if (sub.dish.isActive) res.push(sub.dish)
        })
      })
      return res
    },
    filteredDishesDietary() {
      console.log(this.dishes);
      return this.dishes.filter(dish => {
        let res = false
        this.dietaryTypes.length
          ? dish.dietaryType.map(type => {
            this.dietaryTypes.includes(type.dietary) && (res = true)
          }) : res = true
        this.dietaryTypes.includes(7) && dish.isPromotional && (res = true)
        return res
      })
    },
    filteredPromoDishes() {
      console.log(this.filteredDishesDietary);
      return this.filteredDishesDietary.filter(dish => {
        let res = false
        // console.log(this.promoDishes == null);
        this.promoDishes == null
          ? res = true
          : dish.isPromotional === this.promoDishes && (res = true)
        return res
      })
    },
    filteredDishesType() {
      console.log(this.filteredPromoDishes)
      // console.log(this.dishesTypes)
      return this.filteredPromoDishes.filter(dish => {
        // console.log(dish.dishType)
        let res = false
        this.dishesTypes === null
          ? res = true
          : dish.dishType === this.dishesTypes && (res = true)
        return res
      })
    },
    filteredDishesCalories() {
      console.log(this.filteredDishesType)
      const dishes = [...this.filteredDishesType]
      // console.log(dishes);
      dishes.map(dish => {
        let res = 0
        dish.components.map(c => {
          c.ingredientType === 0 && (res += Math.round(c.ingredient.energy_KCal * c.weight / 100))
        })
        // const groups = []
        // for (const ingr of dish.components) {
        //   if (ingr.ingredientType === 1) {
        //     groups.push(ingr.substituteGroup)
        //   }
        // }
        // const uniq = new Set(groups)
        // const uniqArr = [...uniq]

        // for (const group of uniqArr) {
        //   for (const c of dish.components) {
        //     if (c.ingredientType === 1) {
        //       if (c.substituteGroup === group) {
        //         (res += Math.round(c.ingredient.energy_KCal * c.weight / 100))
        //         break
        //       }
        //     }
        //   }
        // }

        dish.calories = res
        return dish
      })
      // console.log(this.dishesCalories);
      // console.log(dishes);
      return dishes.filter((dish) => {
        let res = true
        if (this.dishesCalories) {
          if (this.dishesCalories === 1500) {
            dish.calories < 1500 && (res = false)
          } else {
            dish.calories < this.dishesCalories - 50 && (res = false)
            dish.calories > this.dishesCalories + 50 && (res = false)
          }
        }
        return res
      })
    },
    filteredDishes() {
      console.log("final level");
      console.log(this.filteredDishesCalories)
      var d = [...this.filteredDishesCalories]
      return d
    },
    allCalories() {
      return this.getCounter('energy_KCal', this.currentComponents)
    },
    currentComponents() {
      return this.filteredDishes.length ? this.filteredDishes[this.currentSlide].components : 0
    }
  },
  mixins: [filterProperties],
  methods: {
    AddToJournal(dish) {
      if (this.rest.isOpen === 'open') {
        if (this.token) {
          this.$router.push({ name: 'Dish', params: { dishID: dish.id, toIngredients: true, isAddByAdmin: true } })
        }
        else {
          this.$router.push({ name: "Auth" })
        }
      }
      else {

      }
    },
    onlyFourDietary(arr) {
      return [...arr].slice(0, 4)
    },
    closeModal() {
      this.$emit('closeInfoBar')
    },
    ionSlideDidChange() {
      const vm = this
      this.$refs.slides.getActiveIndex()
        .then(res => {
          vm.currentSlide = res
        })
    },
    getCounter(el, all) {
      let res = 0
      if (all) {
        // console.log("k1111")
        all.map(e => {
          // console.log(e.ingredient[el])
          if (Number(e.ingredient[el])) {
            e.ingredientType === 0 && (res += Math.round(e.ingredient[el] * e.weight / 100))
          }
        })
        // console.log("k2222")
        // console.log(res)
        const groups = []
        for (const ingr of all) {
          if (ingr.ingredientType === 1) {
            groups.push(ingr.substituteGroup)
          }
        }
        // console.log("k2222")
        const uniq = new Set(groups)
        const uniqArr = [...uniq]
        // console.log("k33333")
        for (const group of uniqArr) {
          for (const e of all) {
            if (e.ingredientType === 1) {
              if (e.substituteGroup === group) {
                eval(`res += Math.round(e.ingredient.${el} * e.weight / 100)`)
                break
              }
            }
          }
        }
      }
      // console.log("hhhh")
      return Number(res).toFixed(0)
    },
    setAllData() {
      this.chartData1 = {
        datasets: [{
          data: [this.allCalories, 0],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
      this.chartData2 = {
        datasets: [{
          dataentry: null,
          datalabel: null,
          data: [this.getCounter('carbohydrates_G', this.currentComponents), (this.allCalories - this.getCounter('carbohydrates_G', this.currentComponents) * 4)],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
      this.chartData3 = {
        datasets: [{
          dataentry: null,
          datalabel: null,
          data: [this.getCounter('proteins_G', this.currentComponents), (this.allCalories - this.getCounter('proteins_G', this.currentComponents) * 4)],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
      this.chartData4 = {
        datasets: [{
          dataentry: null,
          datalabel: null,
          data: [this.getCounter('fat_G', this.currentComponents), (this.allCalories - this.getCounter('fat_G', this.currentComponents) * 9)],
          backgroundColor: ['rgba(206,43,38,0.93)', '#D4D4D4']
        }]
      }
    },
    compare(dish) {
      this.$emit('compare', dish)
    }
  }
}
</script>

<style lang="scss" scoped>
ion-slides {
  --bullet-background-active: #CE2B26;
  --bullet-background: #CE2B26;
  padding-top: 20px;
  padding-bottom: 15px;

  ion-card-content {
    padding: 12px;
    height: 250px;
    width: 94vw;
  }
}

ion-card {
  border-radius: 15px;
  background-color: #ffffff;

  ion-label {
    color: black;
  }

  .img-with-price {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    img,
    ion-img {
      height: 120px;
      //width: 120px;
      object-fit: cover;
      border-radius: 10px;
      overflow: hidden;

      img {
        height: 120px;
        width: auto;
      }
    }

    .price {
      margin-bottom: 10px;

      &-new {
        @include fontMontserrat(18px, bold, 27px);
        color: #2F3741;
      }

      &-old {
        margin-top: -10px;
        @include fontMontserrat(14px, 500, 17px);
        color: $color-strong-grey;
        text-decoration: line-through;
      }
    }
  }

  .foods-type {
    height: 40px;
    max-width: 160px;
    margin: 0 auto;
    // justify-content: center;
    overflow: hidden;

    // overflow-y: auto;
    // @include overflowHide;
    img {
      margin: 0 3px;
      width: 30px;
    }

    span {
      align-self: flex-end;
      font-size: 25px;
    }
  }

  .chart-wrapper {
    justify-content: center;

    // padding:0 10px;
    .pie-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      width: 14vw;
      max-width: 50px;

      span {
        position: absolute;
        font-size: 10px;
        bottom: -14px;
      }

      .chart {
        width: 50px !important;
      }

      p {
        top: 30px;
        transform: translateY(-50%);
        margin: 0;
        position: absolute;
        text-align: center;
        font-weight: 600;
        color: black;
        font-size: 12px;
      }
    }
  }

  .button {
    // margin: 5px 0 0 5px;
    margin-left: 50%;
    transform: translateX(-50%);
    height: 45px;
    margin-top: 20px;
    width: 90%;
    color: #ffffff;
    background-color: $color-light-red;
  }

  .buttonUnactive {
    background-color: $color-strong-grey;
  }

  .compare-btn {
    margin-top: 15px;
    color: $color-light-red;
    font-weight: 600;
  }
}

.left-column {
  width: 35%;
  height: 225px;
}

.right-column {
  width: 65%;
  height: 225px;

  ion-label {
    text-align: left;
    padding-left: 15px;
    @include fontMontserrat(13px, bold, 16px);
    color: #2F3741;

    white-space: nowrap;
    overflow: hidden;
    max-width: calc(100% - 30px);
    text-overflow: ellipsis;
  }
}

img,
ion-img {
  z-index: 100;
}

.toBasket {
  z-index: 90;
  position: absolute;
  width: 83px;
  left: 20px;
  top: 20px;
  filter: opacity(0);
}

.activeToBasket {
  animation: toBasket 1.2s forwards ease-in-out;
}

.no-dishes {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  .close {
    position: absolute;
    right: 10px;
    top: -5px;
    color: $color-grey;
    // color: $color-light-red;
    transform: rotate(45deg);
    cursor: pointer;
    font-size: 35px;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    img {
      height: 80px;
      margin: 20px 0;
    }

    p {
      @include fontMontserrat(12px, bold, 15px);
      // color: $color-grey;
      color: $color-light-red;
      max-width: 80%;
    }
  }
}
</style>
