<template>
  <div>
    <div class="background" @click="clickMe">
    </div>
    <div class="white-bg1">
      <div class="kind-dish">
        <div :class="{ active: temporary.dishesTypes === 2 }" data-circle="drinks" class="drink circle"
          @click="changeFilterDishType(2)">
          <img src="../assets/filter/drinks.svg" alt="">
        </div>
        <div :class="{ active: temporary.dishesTypes === 0 }" data-circle="main dish" class="main circle"
          @click="changeFilterDishType(0)">
          <img class="main-img" src="../assets/filter/main.svg" alt="">
        </div>
        <div :class="{ active: temporary.dishesTypes === 1 }" data-circle="desserts" class="dessert circle"
          @click="changeFilterDishType(1)">
          <img src="../assets/filter/desserts.svg" alt="">
        </div>
      </div>
      <h1 @click="clearAllFilter()" :class="{ clearFilter: isFilledFilter }">
        {{ isFilledFilter ? 'clear all' : 'filter' }}
      </h1>
    </div>
    <dietary />
    <calories />
    <div class="white-bg4">

    </div>

    <div @click="submitFilter()" :class="{ clickRed: clickRed }" class="red-button">
      <h1>OK</h1>
      <div v-if="clickRed" class="bg"></div>
    </div>

  </div>
</template>

<script>
import filterProperties from '@/mixins/filterProperties'

export default {
  name: 'FilterMenu',
  data() {
    return {
      clickRed: false
    }
  },
  components: {
    Calories: () => import('./NewFilterMenu/Calories'),
    Dietary: () => import('./NewFilterMenu/Dietary')
  },
  created() {
    this.$store.commit('filterModule/setOpenFilter', true)
  },
  computed: {
    isFilledFilter() {
      return this.temporary.dietaryTypes.length || this.temporary.dishesCalories || (this.temporary.dishesTypes !== null) || (this.temporary.promoDishes !== null)
    }
  },
  mixins: [filterProperties],
  methods: {
    clickMe() {
      this.$emit('close')
      // this.$store.commit('filterModule/closeFilter')
    },
    clearAllFilter() {
      this.$store.commit('filterModule/clearAllFilter')
    },
    changeFilterDishType(val) {
      this.$store.commit('filterModule/setDishesTypes', val)
    },
    async submitFilter() {
      const vm = this
      this.$store.commit('filterModule/submitTemporaryValues')
      this.$store.commit('filterModule/setSubmitFilter', true)

      this.clickRed = true

      this.$emit('close')
      setTimeout(() => {
        vm.$emit('close')
        setTimeout(() => {
          vm.clickRed = false
        }, 1000)
      }, 700)
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  animation: colored .5s 1.2s forwards linear;
}

@keyframes colored {
  0% {
    background: rgba(0, 0, 0, 0);
  }

  100% {
    background: rgba(0, 0, 0, 0.5);
  }
}

.white-bg1 {
  z-index: 103;
  width: 174vw;
  height: 174vw;
  border-radius: 85%;
  position: absolute;
  left: -8vw;
  bottom: calc(1px - (33vh + 100vw / 6));
  background: white;
  display: flex;
  justify-content: center;

  h1 {
    @include fontMontserrat(12px, 600, 16px);
    color: $color-strong-grey;
    text-transform: uppercase;
  }

  .clearFilter {
    color: $color-light-red !important;
  }

  .kind-dish {
    position: absolute;
    top: -75px;
    display: flex;

    .circle {
      height: 55px;
      border-radius: 50%;
      width: 55px;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 22px;
      text-transform: uppercase;

      &:after {
        content: attr(data-circle);
        position: absolute;
        top: calc(100% + 10px);
        color: white;
        @include fontMontserrat(10px, 600, 15px);
        white-space: nowrap;
      }

      img {
        filter: invert(1);
      }
    }

    .main {
      transform: translateY(-25px);
    }

    .active {
      background: $color-light-red;

      img {
        filter: invert(0);
      }
    }
  }
}

.white-bg4 {
  z-index: 106;
  width: 66vw;
  height: 71vw;
  border-radius: 50%;
  position: absolute;
  left: 45vw;
  bottom: calc(1px - (15vh + 100vw / 5));
  background: white;
  border: 1px solid #C8C8C8;

  &::after {
    content: '';
    background: $color-red;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    position: absolute;
    top: -5px;
    left: calc(50% - 5px);

  }

  &::before {
    content: 'CALORIES';
    @include fontMontserrat(9px, bold, 12px);
    color: $color-strong-grey;
    position: absolute;
    top: -20px;
    left: calc(50%);
    transform: translateX(-50%);

  }
}

.red-button {
  z-index: 107;
  position: absolute;
  height: 40vw;
  width: 40vw;
  border-radius: 50%;
  background: $color-red;
  left: 58vw;
  bottom: calc(1px - (4vh + 100vw / 5));
  //display: flex;
  //justify-content: center;
  text-align: center;

  h1 {
    font-family: 'Comfortaa', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    color: #FFFFFF;

  }
}

.clickRed {
  animation: clickRed 1.6s forwards ease-in-out;
  z-index: 9999999;

  .bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: url(../assets/bg.svg);
    animation: animBg .5s .5s forwards ease-in-out;
    filter: opacity(0);
  }
}

@keyframes clickRed {
  0% {
    height: 40vw;
    width: 40vw;
    left: 58vw;
  }

  67% {
    height: 400vw;
    width: 400vw;
    left: -118vw;
  }

  100% {
    height: 400vw;
    width: 400vw;
    left: -118vw;
  }
}

@keyframes animBg {
  0% {
    filter: opacity(0);
  }

  100% {
    filter: opacity(1);
  }
}

@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 2) {
  .white-bg2 {
    z-index: -2;
    width: 132vw;
    height: 132vw;
    border-radius: 50%;
    position: absolute;
    left: 12vw;
    bottom: calc(1px - (20vh + 100vw / 6));
    background: white;
    border: 1px solid #C8C8C8;
    display: flex;
    justify-content: center;

    // transform: rotate(10deg);
    .container {
      z-index: 9999999;
      margin-top: 220px;
      transform: rotate(0deg);
      display: flex;
      margin-left: -200px;

      .block {
        width: 240px;
        height: 50px;
        transform-origin: 100% 26px;
        transform: rotate(180deg);
        position: absolute;

        .square {
          width: calc(55px + 1vw);
          height: calc(55px + 1vw);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 45px;
          }

          p {
            position: absolute;
            margin: 0;
            font-size: 10px;
            top: 60px;
            text-transform: uppercase;
          }
        }
      }
    }

  }
}

/* ----------- Galaxy S4, S5 and Note 3 ----------- */
/* Portrait and Landscape */
@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) {}

/* ----------- Galaxy S6 ----------- */
/* Portrait and Landscape */
@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) {}
</style>
