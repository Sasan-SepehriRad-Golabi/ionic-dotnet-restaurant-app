<template>
  <section id="prods" ref="prods" class="white-bg2">
    <div id="mydivheader" class="container">
      <div class="block ">
        <div @click="addToFilter(6)" id="prodskosher" class="square">
          <img :src="require(`@/assets/filter/kosher${temporary.dietaryTypes.includes(6) ? 'Red' : ''}.svg`)" alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(6) }">kosher</p>
        </div>
      </div>

      <div class="block ">
        <div @click="addToFilter(0)" id="prodsvegan" class="square">
          <img :src="require(`@/assets/filter/vegan${temporary.dietaryTypes.includes(0) ? 'Red' : ''}.svg`)" alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(0) }">vegan</p>
        </div>
      </div>

      <div class="block ">
        <div @click="addToFilter(4)" id="prodsdairy-free" class="square">
          <img :src="require(`@/assets/filter/dairy-free${temporary.dietaryTypes.includes(4) ? 'Red' : ''}.svg`)"
            alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(4) }">dairy-free</p>
        </div>
      </div>
      <div class="block ">
        <div @click="addToFilter(1)" id="prodsvegetarian" class="square">
          <img class="milk"
            :src="require(`@/assets/filter/vegetarian${temporary.dietaryTypes.includes(1) ? 'Red' : ''}.svg`)" alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(1) }">vegetarian</p>
        </div>
      </div>
      <div class="block ">
        <div @click="addToFilter(2)" id="prodshalal" class="square">
          <img :src="require(`@/assets/filter/halal${temporary.dietaryTypes.includes(2) ? 'Red' : ''}.svg`)" alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(2) }">halal</p>
        </div>
      </div>
      <div class="block ">
        <div @click="setPromoDishes()" id="prodspromo" class="square">
          <img :src="require(`@/assets/filter/promo${temporary.promoDishes ? 'Red' : ''}.svg`)" alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(7) }">promo</p>
        </div>
      </div>
      <div class="block ">
        <div @click="addToFilter(3)" id="prodsgluten-free" class="square">
          <img :src="require(`@/assets/filter/gluten-free${temporary.dietaryTypes.includes(3) ? 'Red' : ''}.svg`)"
            alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(3) }">gluten-free</p>
        </div>
      </div>
      <div class="block ">
        <div @click="addToFilter(5)" id="prodsnut-free" class="square">
          <img :src="require(`@/assets/filter/nut-free${temporary.dietaryTypes.includes(5) ? 'Red' : ''}.svg`)" alt="">
          <p :class="{ active: temporary.dietaryTypes.includes(5) }">nut-free</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import filterProperties from '@/mixins/filterProperties'

export default {
  name: 'Dietary',
  data() {
    return {
      refDietary: null,
      pos1: 0,
      pos2: 0,
      rotateDiet: 0
    }
  },
  computed: {
    getPromoDishes() {
      return this.$store.state.filterModule.promoDishes
    }
  },
  mounted() {
    this.refDietary = this.$refs.prods
    this.dragElement()
  },
  mixins: [filterProperties],
  methods: {
    addToFilter(el) {
      this.$store.commit('filterModule/setDietaryTypes', el)
    },
    setPromoDishes() {
      this.$store.commit('filterModule/setPromoDishes', this.temporary.promoDishes === true ? null : true)
    },
    dragElement() {
      this.refDietary.onmousedown = this.dragMouseDown
      this.refDietary.addEventListener('touchend', this.dragMouseDown)
      this.refDietary.addEventListener('touchmove', this.elementDrag)
    },
    dragMouseDown(e) {
      console.log('elemdar')
      e = e || window.event
      if (e.clientX) {
        this.pos2 = e.clientX * 2
      } else {
        this.pos2 = e.changedTouches[0].clientX
      }
    },
    elementDrag(e) {
      e = e || window.event
      if (e.clientX) {
        this.pos1 = this.pos2 - e.clientX
        this.pos2 = e.clientX
      } else {
        this.pos1 = this.pos2 - e.changedTouches[0].clientX
        this.pos2 = e.changedTouches[0].clientX
      }
      if (this.refDietary?.id === 'prods') {
        if (this.pos1 > 0) {
          if (this.rotateDiet > -89) {
            this.rotateDiet -= 2.5
          }
        } else {
          if (this.rotateDiet < 91) {
            this.rotateDiet += 2.5
          }
        }
        this.refDietary && (this.refDietary.style.transform = 'rotate(' + this.rotateDiet + 'deg)')

        for (let i = 0; i <= 8; i++) {
          let newRotate = 0
          let name = 'promo'
          switch (i) {
            case 8:
              name = 'kosher'

              break
            case 7:
              name = 'vegan'
              break
            case 6:
              name = 'dairy-free'
              break
            case 5:
              name = 'vegetarian'
              break
            case 4:
              name = 'halal'
              break
            case 3:
              name = 'promo'
              break
            case 2:
              name = 'gluten-free'
              break
            case 1:
              name = 'nut-free'
              break
            default:
              break
          }
          newRotate = -(i - 1) * 26 + -4 - this.rotateDiet
          if (this.refDietary) {
            document.getElementById(this.refDietary.id + name).style.transform = 'rotate(' + newRotate + 'deg)'
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../scss/animations';

.white-bg2 {
  z-index: 104;
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

  .container {
    z-index: 9999999;

    .block {
      width: calc(66vw - 10px);
      height: 20px;
      transform-origin: 100% 50%;
      transform: rotate(180deg);
      position: absolute;
      top: 48%;
      left: 10px;

      .square {
        width: 60px;
        height: 60px;
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
          font-size: 9px;
          top: 60px;
          text-transform: uppercase;
        }
      }

      .active {
        color: $color-light-red;
      }
    }

    @for $i from 1 through 8 {
      .block:nth-child(#{$i}) {
        .square {
          transform: rotate(-(180deg - ($i - 1) * 26deg - 13deg + 19deg));
        }

        animation: rot#{$i} both ease-in-out;
        animation-duration: 1300ms;
      }
    }
  }
}
</style>
