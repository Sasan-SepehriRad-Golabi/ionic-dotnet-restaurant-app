<template>
  <div id="calor" ref="calor" class="white-bg3" @touchstart="dragElement($refs.calor)">
    <div class="container">
      <div class="block" v-for="(calor, indCalor) in calories" :key="indCalor">
        <div class="calories">
          <p :class="{ activeCalor: temporary.dishesCalories == calor }" @touchstart.self.stop="dragElement('stop')"
            :id="indCalor">
            {{ calor }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterProperties from '@/mixins/filterProperties'

export default {
  name: 'Calories',
  data() {
    return {
      pointsCaloriesObj: [
        { val: 1500, pos: 112 },
        { val: 1450, pos: 97 },
        { val: 1350, pos: 82 },
        { val: 1250, pos: 67 },
        { val: 1150, pos: 52 },
        { val: 1050, pos: 37 },
        { val: 950, pos: 22 },
        { val: 850, pos: 7 },
        { val: 750, pos: -8 },
        { val: 650, pos: -23 },
        { val: 550, pos: -38 },
        { val: 450, pos: -53 },
        { val: 350, pos: -68 },
        { val: 250, pos: -83 },
        { val: 150, pos: -98 },
        { val: 50, pos: -113 }
      ],
      calories: [
        1500
      ],
      elmnt: null,
      pos1: 0,
      pos2: 0,
      rotateCalor: 0
    }
  },
  created() {
    this.fillCalories()
  },
  mounted() {
    this.elmnt = this.$refs.calor
    this.dragElement(this.elmnt)
  },
  mixins: [filterProperties],
  methods: {
    dragElement(elmnt) {
      if (elmnt === 'stop') {
        this.elmnt = null
        this.$store.commit('filterModule/setDishesCalories', null)
      } else {
        this.setListeners()
      }
    },
    setListeners() {
      this.elmnt = this.$refs.calor
      this.elmnt.onmousedown = this.dragMouseDown
      this.elmnt.addEventListener('touchmove', this.elementDrag)
      this.elmnt?.addEventListener('touchend', this.closeDragElement)
      this.elmnt?.addEventListener('touchcancel', this.closeDragElement)
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
      if (this.pos1 > 0) {
        if (this.rotateCalor > -112) {
          this.rotateCalor -= 2
        }
      } else {
        if (this.rotateCalor < 112) {
          this.rotateCalor += 2
        }
      }
      if (this.elmnt?.style) {
        this.elmnt.style.transform = 'rotate(' + this.rotateCalor + 'deg)'
      }
    },
    fillCalories() {
      let val = 1450
      while (val > 0) {
        this.calories.push(val)
        val -= 100
      }
    },
    changeFilterDishCalories(val, event) {
      this.rotateCaloriesById(event)
      this.$store.commit('filterModule/setDishesCalories', val)
    },
    rotateCaloriesById(val) {
      let res = -113 + (val * 15)
      let value = res - this.rotateCalor
      let sign = value > 0
      let arr = []

      for (let i = 0; i < Math.abs(value); i++) {
        arr.push(i)
      }

      for (let i of arr) {
        sign ? this.rotateCalor++ : this.rotateCalor--
        this.$refs.calor.style.transform = 'rotate(' + this.rotateCalor + 'deg)'
      }
    },
    findNearCalories() {
      let dif = []
      for (let pos of this.pointsCaloriesObj) {
        if (this.rotateCalor >= pos.pos) {
          dif.unshift(Math.abs(this.rotateCalor - pos.pos))
        } else {
          dif.unshift(Math.abs(pos.pos - this.rotateCalor))
        }
      }
      let min = Math.min(...dif)
      let index = dif.indexOf(min)
      this.changeFilterDishCalories(this.pointsCaloriesObj[index].val, index)
    },
    closeDragElement() {
      if (this.elmnt?.id === 'calor') {
        setTimeout(() => this.findNearCalories(), 500)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../scss/animations';

.white-bg3 {
  z-index: 105;
  width: 124vw;
  height: 124vw;
  border-radius: 50%;
  position: absolute;
  left: 16vw;
  bottom: calc(1px - (32vh + 100vw / 6));
  background: white;
  border: 1px solid #C8C8C8;
  display: flex;
  justify-content: center;

  .container {
    z-index: 9999999;
    left: 0;

    .block {
      width: calc(62vw - 20px);
      height: 20px;
      transform-origin: 100% 26px;
      transform: rotate(180deg);
      position: absolute;
      top: 45%;
      left: 20px;

      .calories {
        width: 84px;
        height: 84px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        margin-bottom: -50px;

        p {
          margin: 0;
          text-transform: uppercase;
          margin-bottom: calc(33px);
        }

        .activeCalor {
          color: $color-light-red
        }
      }

      .active {
        width: calc(80px + 1vw);
        height: calc(80px + 1vw);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column-reverse;

        p {
          @include fontMontserrat(18px, 600, 24px);
          color: #3A3A3A;
          margin: 0;
          text-transform: uppercase;
          margin-bottom: calc(33px);
        }

        .mini {
          font-size: 10px;
        }

        .left {
          margin-top: -22px;
          ;
        }

        .center {
          margin-right: 20px;
        }

        .right {
          margin-bottom: 10px;
        }
      }
    }

    @for $i from 1 through 16 {
      .block:nth-child(#{$i}) {
        .calories {
          p {
            transform: rotate(-90deg);
          }
        }

        animation: rot2#{$i} both ease-in-out;
        animation-duration: 1400ms;
      }
    }
  }

}
</style>
