<template>
  <ion-content v-touch="{
    right: () => $router.push({ name: 'Home' })
  }">
    <div class="restaurant" v-if="restaurant">
      <img class="top-image" width="375px" :src="restaurant.background || require('../assets/default43.svg')">
      <div :class="{ scrolling: isAnimation }" v-if="!isScroll" class="restaurant-info">
        <img class="logo" :class="{ openLogo: restaurant.isOpen === 'open', pauseLogo: restaurant.isOpen === 'break' }"
          height="70px" width="70px" :src="restaurant.logo || require('../assets/default11.svg')" alt="">
        <span class="state"
          :class="{ openState: restaurant.isOpen === 'open', pauseState: restaurant.isOpen === 'break' }">{{
            restaurant.isOpen
          }}</span>
        <div class="top-info">
          <div v-if="restaurant.times && restaurant.times.length" class="left">
            <p>Today</p>
            <p>{{ getTodayTime(restaurant.times, 'open') }} - {{ getTodayTime(restaurant.times, 'close') }}</p>
            <p v-if="getTodayTime(restaurant.times, '', 'pause').length">Pauses</p>
            <p v-for="(pause, indexPause) of getTodayTime(restaurant.times, '', 'pause')" :key="indexPause">{{
              pause.start
            }} -
              {{ pause.end }}</p>
          </div>
          <div class="right">
            <p>
              <img src="../assets/icons/navigatorIcon.svg" alt="">
              {{ distance }} km
            </p>
          </div>
        </div>

        <h1 class="restaurant-name">{{ restaurant.name }}</h1>
        <span class="restaurant-type">
          <img
            :src="require(`../assets/rest-category/${categories[restaurant.restaurantCategory].replace(' ', '')}.svg`)">
          {{ categories[restaurant.restaurantCategory] }}
        </span>
        <div class="description">
          <p>{{ restaurant.description }}</p>
        </div>
        <div class="restaurant-contacts">
          <div class="top">
            <div class="image">
              <img src="../assets/icons/www.svg" alt="">
              <p target="_blank" :href="restaurant.website">{{ restaurant.website }}</p>
            </div>
            <div class="image">
              <img src="../assets/icons/oldphone.svg" alt="">
              <p @click="callPhone(restaurant.firstPhoneNumber)" :href="'tel:' + restaurant.firstPhoneNumber">
                +{{ getPhone }}</p>
            </div>
          </div>

          <div class="bot">
            <div class="image">
              <img src="../assets/icons/mapPoint.svg" alt="">
              <p @click="addressHide = !addressHide" :class="{ addressHide: addressHide }" class="address">
                {{ restaurant.address }}</p>
            </div>
            <!--            <a class="button" :href="`${-->
            <!--              iphone ? `http://maps.apple.com/?ll=${this.restaurant.latitude},${this.restaurant.longitude}&z=18&t=m` :-->
            <!--                       `https://www.google.com/maps/search/?api=1&query=${this.restaurant.latitude},${this.restaurant.longitude}`}`" >Get a direction</a>-->
            <a class="button"
              :href="`https://www.google.com/maps/search/?api=1&query=${this.restaurant.latitude},${this.restaurant.longitude}`">Get
              a direction</a>
          </div>

          <div class="links" :class="{ linksAddressHide: addressHide }">
            <div v-if="restaurant.instagram" class="circle instagram"><a
                :href="`https://www.instagram.com/${restaurant.instagram}`"></a></div>
            <div v-if="restaurant.facebook" class="circle facebook"><a
                :href="`https://www.facebook.com/${restaurant.facebook}`"></a></div>
            <div v-if="restaurant.twitter" class="circle twitter"><a
                :href="`https://www.twitter.com/${restaurant.twitter}`"></a></div>
            <div v-if="restaurant.whatsapp" class="circle whatsapp"><a
                :href="`https://www.wa.me/${restaurant.whatsapp}`"></a></div>
          </div>
        </div>

      </div>

      <div v-if="isScroll" class="scrolling-info">
        <img @click="back" class="back" src="../assets/toBack.svg" alt="">
        <img class="logo" height="70px" width="70px" :src="restaurant.logo || require('../assets/default11.svg')" alt="">

        <div class="right">
          <h1 class="restaurant-name">{{ restaurant.name }}</h1>
          <span class="restaurant-type">
            <img class="icon"
              :src="require(`../assets/rest-category/${categories[rest.restaurantCategory].replace(' ', '')}.svg`)">
            {{ categories[rest.restaurantCategory] }}
            <span class="state">close</span>
          </span>
          <div class="location">
            <img src="../assets/iconLocation.svg" alt="">
            <p>{{ distance }} km</p>
          </div>
        </div>

      </div>

      <div class="content">
        <div class="content-buttons">
          <div class="top-content">
            <div class="categories">
              <div class="buttons-category">
                <button class="category-kind" @click="changeCategoryDish(0)" :class="{ active: categoryDish === 0 }">Main
                  Dish
                </button>
                <button class="category-kind" @click="changeCategoryDish(2)" :class="{ active: categoryDish === 2 }">
                  Drinks
                </button>
                <button class="category-kind" @click="changeCategoryDish(1)" :class="{ active: categoryDish === 1 }">
                  Desserts
                </button>
              </div>
            </div>
            <div class="scroll-section">
              <div class="buttons">
                <button v-for="(category, index) of getMenu" :key="index" :class="{ active: category.name == selected }"
                  @click="selected = category.name" class="food-kind">
                  {{ category.name.length > 8 ? category.name.substring(0, 7) + ".." : category.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="content-menu">
          <v-card class="card" v-for="(dish, indish) in filteredDish" :key="indish">
            <div class="flex-row food-item"
              @click="$router.push({ name: 'Dish', params: { dishID: dish.dish.id, isAddByAdmin: restaurant.isAddByAdmin, toIngredients: true, } })">
              <img :src="dish.dish.image || require('../assets/default43.svg')" alt="">
              <span class="food-item-promo" v-show="dish.dish.isPromotional">promo</span>
              <div class="main">
                <p>{{ dish.dish.name }}</p>
                <p class="ckal">{{ getDishCalories(dish.dish) }} kcal</p>
              </div>
              <div class="flex-column price-block">
                <p v-if="dish.dish.isPromotional" class="price-block__old">
                  <strike>€ {{ dish.dish.price }}</strike>
                </p>
                <p class="price-block__new">
                  € {{ dish.dish.isPromotional ? dish.dish.promotionalPrice : dish.dish.price }}
                </p>
              </div>
            </div>
          </v-card>

        </div>
      </div>

    </div>
  </ion-content>
</template>

<script>
import { mapState } from 'vuex'
import restaurantMixin from '@/mixins/restaurantMixin'
import api from '@/service/api'
import { Restaurants } from '@/service/routes'

export default {
  name: 'RestaurantInfo',
  data() {
    return {
      selected: '',
      isScroll: false,
      isAnimation: false,
      scrollImage: false,
      isCanScroll: true,
      categories: [
        'Casual restaurant',
        'Fast food',
        'Fine dining',
        'Bar',
        'Food truck'
      ],
      addressHide: true,
      categoryDish: 0
    }
  },
  props: {
    restaurant: {
      type: Object
    },
    category: {
      type: Number
    }
  },
  computed: {
    filteredDish() {
      const res = []
      this.restaurant.menu && this.restaurant.menu.map(e => {
        e.category === this.categoryDish && (this.selected ? e.name == this.selected : true) && (res.push(...e.dishCategories))
      })

      return res.filter(el => el.dish.isActive)
    },
    currentDay() {
      return new Date().getDay()
    },
    getMenu() {
      if (this.restaurant.menu) {
        return this.restaurant.menu.filter(el => el.category === this.categoryDish)
      } else return []
    },
    getPhone() {
      if (this.restaurant.firstPhoneNumber) {
        const phone = this.restaurant.firstPhoneNumber.split('')
        phone.splice(2, 0, ' ')
        phone.splice(6, 0, ' ')
        phone.splice(9, 0, ' ')
        phone.splice(12, 0, ' ')
        return phone.join('')
      } else return ''
    },
    getCurrentPositionComp() {
      const lat = this.$store.state.geolocationModule.currentPosition.lat
      const lng = this.$store.state.geolocationModule.currentPosition.lng
      if (lat && lng) {
        return { lat, lng }
      } else return { lat: 11, lng: 11 }
    },
    ...mapState(['token'])
  },
  async created() {
    this.restaurant || (this.restaurant = this.$store.state.restaurant)
    this.$store.commit('setRestaurant', this.restaurant)
  },
  mounted() {
    this.getRestaurantMenu()
    this.restaurant.isOpen = this.checkIsOpen(this.restaurant)
    if (this.category) {
      this.categoryDish = this.category
      this.selected = ''
    }
    this.getDistance(this.restaurant.latitude, this.restaurant.longitude)
  },
  mixins: [restaurantMixin],
  methods: {
    changeCategoryDish(cat) {
      this.categoryDish = cat
      this.selected = ''
    },
    callPhone(phone) {
      window.open(`tel:${phone}`, '_system')
    },
    getTodayTime(times, when, type = 'work') {
      let res = '00:01'

      const day = (new Date().getDay() - 1)
      for (const time of times) {
        if ((day === time.day) || (day === -1 && time === 6)) {
          if (type === 'work') {
            const start = time.openingTime.substring(11)
            const end = time.closingTime.substring(11)
            res = when === 'open' ? start.substring(0, 5) : end.substring(0, 5)
          } else {
            res = []
            if (time.pauses.length) {
              for (const pause of time.pauses) {
                const start = pause.pauseStart.substring(11)
                const end = pause.pauseEnd.substring(11)
                res.push({ start: start.substring(0, 5), end: end.substring(0, 5) })
              }
            }
          }
        }
      }
      return res
    },
    getDishCalories(dish) {
      if (dish.categories) return dish.categories
      let res = 0
      for (const comp of dish.components) {
        if (comp.ingredientType === 0) {
          res += (+comp.ingredient.energy_KCal * (comp.weight / 100))
        }
      }
      const groups = []
      for (const ingr of dish.components) {
        if (ingr.ingredientType === 1) {
          groups.push(ingr.substituteGroup)
        }
      }
      const uniq = new Set(groups)
      const uniqArr = [...uniq]

      for (const group of uniqArr) {
        for (const comp of dish.components) {
          if (comp.ingredientType === 1) {
            if (comp.substituteGroup === group) {
              res += (+comp.ingredient.energy_KCal * (comp.weight / 100))
              break
            }
          }
        }
      }

      return res.toFixed()
    },
    async getRestaurantMenu() {
      const vm = this
      await api.GET(`${Restaurants.restaurants}/${this.restaurant.id}`, vm.token)
        .then(resp => {
          vm.restaurant.menu = resp.data
        })
        .catch(err => {
        })
    },
    back() {
      this.isScroll = false
      this.scrollImage = false
      setTimeout(() => {
        this.isCanScroll = true
      }, 1000)
    }
  }

}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
}

img {
  border-radius: 5px;
}

.restaurant {
  // overflow-y: auto;
  background: #f2f2f2;

  .top-image {
    width: 100%;
    left: 0;
    top: 0;
  }

  &-info {
    margin-top: -20px;
    background: white;
    border-radius: 15px 15px 0 0;
    padding-bottom: 20px;
    //height: 360px;
    position: relative;

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

    .logo {
      width: 70px;
      position: absolute;
      left: 50%;
      top: -30px;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 2px solid $color-light-red;
      animation: invertLogo 1s forwards ease-in-out;
    }

    .state {
      position: absolute;
      width: 45px;
      height: 16px;
      right: 50%;
      top: 28px;
      transform: translateX(50%);
      animation: invertState 1s forwards ease-in-out;
      background: $color-light-red;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      @include fontMontserrat(10px, 600, 12px);
    }

    .openLogo {
      border: 2px solid $color-green;
    }

    .openState {
      background: $color-green;
    }

    .pauseLogo {
      border: 2px solid #f5ce00;
    }

    .pauseState {
      background: #f5ce00;
    }

    .top-info,
    .restaurant-name,
    .restaurant-type,
    .restaurant-contacts,
    .links {
      animation: invertDisplayNone .1s forwards ease-in-out;
      filter: opacity(0);
    }

    .top-info {
      display: flex;
      justify-content: space-between;

      p {
        margin: 0;
        margin-bottom: 4px;
        @include fontMontserrat(12px, 600, 15px);
        text-align: center;
        color: $color-strong-grey;
      }

      .left,
      .right {
        width: 120px;
        margin-top: 20px;
      }

      .left {
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      .right {
        position: relative;

        img {
          position: absolute;
          left: 10px;
        }

        p {
          line-height: 18px;
        }
      }
    }

    .restaurant-name {
      display: flex;
      justify-content: center;
      @include fontMontserrat(18px, bold, 22px);
      color: #2F3741;
    }

    .restaurant-type {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      @include fontMontserrat(14px, 600, 17px);
      text-transform: capitalize;
      color: $color-strong-grey;

      img {
        margin-right: 10px;
      }
    }

    .restaurant-contacts {
      margin: 0 auto;
      margin-top: 20px;
      width: 90%;

      p {
        margin: 0;
        margin-left: 10px;
        @include fontMontserrat(13px, 600, 17px);
        text-align: left;
        color: $color-strong-grey;
      }

      button {
        width: 150px;
        height: 44px;
        @include fontMontserrat(13px, 600, 17px);
        text-align: center;
        color: $color-light-red;
        background: $color-red-tab;
      }

      .top,
      .bot {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .image {
          display: flex;
          width: 150px;
          height: 44px;

          .address {
            line-height: 20px;
          }

          .addressHide {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            /* number of lines to show */
            -webkit-box-orient: vertical;
          }
        }
      }

      .top {
        margin-bottom: 10px;

        .image {
          align-items: center;

          &:nth-child(2) {
            justify-content: center;
          }
        }
      }

      .bot {
        p {
          text-align: left;
        }

        img {
          height: 25px;
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
    }

    .links {
      margin: 0 auto;
      margin-top: 60px;
      width: 260px;
      display: flex;
      justify-content: space-around;

      .circle {
        background: $color-red-tab;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: relative;

        a {
          position: absolute;
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        &:after {
          content: '';
          width: 100%;
          height: 100%;
        }

        &.instagram:after {
          background: url(../assets/iconInstagram.svg) center no-repeat;
        }

        &.facebook:after {
          background: url(../assets/iconFacebook.svg) center no-repeat;
        }

        &.twitter:after {
          background: url(../assets/iconTwitter.svg) center no-repeat;
        }

        &.whatsapp:after {
          background: url(../assets/iconTelegram.svg) center no-repeat;
        }
      }
    }

    .linksAddressHide {
      margin-top: 20px;
    }
  }

  .content {
    width: 90%;
    margin: 0 auto;
    margin-top: 20px;

    &-buttons {
      width: 100%;
      height: 100%;

      .top-content {
        width: 100%;
        height: 100%;

        .buttons-category {
          display: flex;
          width: auto;
          margin: 0 7px;
          margin-right: 0;

          .category-kind {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: white;
            @include fontMontserrat(12px, bold, 13px);
            color: #2F3741;
            margin: 7px 0;
            outline: none;
            padding: 20px 0;
            text-transform: uppercase;
          }

          .active {
            background: $color-light-red;
            color: white;
            border-radius: 5px;
          }
        }

        .scroll-section {
          overflow-x: auto;
          width: 100%;
          height: 100%;
          box-sizing: content-box;

          .buttons {
            display: flex;
            width: auto;

            .food-kind {
              width: 100%;
              min-width: 80px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: white;
              @include fontMontserrat(12px, bold, 13px);
              color: #2F3741;
              margin: 7px;
              outline: none;
              padding: 10px;
              border-radius: 5px;
            }

            .active {
              background: $color-light-red;
              color: white;
            }
          }
        }
      }
    }

    &-menu {
      margin-top: 10px;

      .card {
        margin-top: 15px;
        margin-bottom: 25px;
        height: 90px;
        display: flex;
        align-items: center;
        @include fontMontserrat(14px, 600, 17px);

        .food-item {
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;

          &-promo {
            position: absolute;
            width: 45px;
            height: 16px;
            top: 5px;
            left: 5px;
            background: $color-green;
            border-radius: 8px;
            text-align: center;
            color: white;
            @include fontMontserrat(10px, 600, 16px);
          }

          img {
            width: 80px;
            height: 60px;
            margin-right: 15px;
            margin-left: 15px;
            border: 1px solid $color-strong-grey;
            border-radius: 5px;
          }

          p {
            margin: 0;
            margin-top: 20px;
            color: $color-strong-grey;
            font-size: 14px;
          }

          .main {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 50%;
          }

          .price-block {
            width: 30%;
            margin-right: 5px;
            display: flex;
            align-items: center;
            justify-content: center;

            &__old {
              margin: 0 auto;
              margin-top: 8px;
            }

            &__new {
              margin: 0 auto;
              color: black;
              font-size: 16px;
              font-weight: bold;
            }
          }

          .delete-food-item {
            background-clip: $color-light-red;
          }
        }
      }
    }
  }

  .content-menu {
    padding-bottom: 100px;
  }
}

.notOverflow {
  max-height: 100vh;
}
</style>
