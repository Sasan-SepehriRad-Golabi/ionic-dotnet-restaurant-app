<template>
  <div class="all" v-touch="{
    right: () => $emit('back')
  }">
    <ion-header>
      <ion-toolbar>
        <img @click="$emit('back')" class="back" src="../assets/toBack.svg" alt="">
        <h1>Choose ingredients</h1>
      </ion-toolbar>

    </ion-header>

    <h2 v-if="substituteGroups.length">Choose selected ingredients:</h2>
    <div v-for="(group, indexGroup) in substituteGroups" style="padding-bottom: 20px" :key="indexGroup">
      <div class="substitude">
        <div @click="changeSelect(sub, indexGroup)" class="item" v-for="(sub, indexSub) in group" :key="indexSub">
          <p>{{ sub.ingredient.nameEng }}</p>
          <p style="justify-self: center" class="kcal-number">
            {{ selectedGroups[indexGroup].id === sub.id ? `-` : `+` }}{{
              + (sub.ingredient.energy_KCal * sub.weight / 100).toFixed()
            }} kcal</p>
          <button class="radiobox" :class="{ active: selectedGroups[indexGroup].id === sub.id }">
            <img src="../assets/check.svg" alt="">
          </button>
        </div>
      </div>
    </div>

    <h2 v-if="paid.length">Choose additional ingredients:</h2>

    <div class="ingredients">
      <div v-for="(item, index) in paid" :key="index" class="item">
        <p>{{ item.ingredient.nameEng }}</p>
        <p style="justify-self: center">
          <span>{{ `${item.price ? `( ${checkAllPaid(item.id) ? `-` : `+`} €${item.price} )` : ''}` }}</span>
          <span class="kcal-number">{{ checkAllPaid(item.id) ? `-` : `+` }}{{
            + (item.ingredient.energy_KCal * item.weight / 100).toFixed()
          }} kcal</span>
        </p>
        <button :class="{ active: checkAllPaid(item.id) }" @click="addPaidIngredient(item.id)" class="checkbox">
          <img src="../assets/check.svg" alt="">
        </button>
      </div>
    </div>
    <div class="total-calories">
      <p class="digit" v-if="!waiting">{{ totalCalories }} <span style="color: #D55951;font-size: 16px">kcal</span></p>
    </div>
    <div class="count">
      <span class="action" @click="count > 1 ? count-- : false">
        <img src="../assets/minus.svg" alt="">
      </span>
      <span class="digit">{{ count }}</span>
      <span class="action" @click="count++">
        <img src="../assets/minus.svg" alt="">
        <img src="../assets/plus.svg" alt="">
      </span>

    </div>

    <h2>Do you want to add comment?</h2>
    <textarea v-model="comment" placeholder="Your comment..." name="" id="" maxlength="200" rows="4"></textarea>
    <div class="info-text">
      <p>The dietary type and the nutrients of your order changes depending on the selected ingredients.</p>
    </div>
    <div v-if="!keyboard">
      <div class="add">
        <button @click="isAddByAdmin ? !addJournalClicked ? addToJournal(dish.id) : '' : addToBasket()">{{ !isAddByAdmin
          ? !isAddOneMore ? 'Add to basket' : 'Back to basket' :
          !isAddOneMore ?
            'Add to Journal' : 'Back to Journal'
        }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { Plugins } from '@capacitor/core'
import { AddToJournal } from '@/service/routes'
import api from '@/service/api'
import { mapState } from 'vuex'
const { Keyboard } = Plugins
export default {
  name: 'Ingredients',
  props: {
    dish: {
      type: Object,
      required: true
    },
    isAddOneMore: {
      type: Boolean
    },
    isAddByAdmin: {
      type: Boolean
    },
    dishIndex: {
      type: Number
    }
  },
  data() {
    return {
      addJournalClicked: false,
      selectedGroups: [],
      selectedPaidIngredients: [],
      substituteGroups: [],
      count: 1,
      main: [],
      substitude: [],
      additional: [],
      paid: [],
      keyboard: false,
      comment: '',
      waiting: false
    }
  },
  computed: {
    ...mapState(['token']),
    totalCalories() {
      let result = 0
      if (this.main.length) {
        for (const ingr of this.main) {
          result += +(ingr.ingredient.energy_KCal * ingr.weight / 100).toFixed()
        }
      }
      if (this.selectedGroups.length) {
        for (const ingr of this.selectedGroups) {
          result += +(ingr.ingredient.energy_KCal * ingr.weight / 100).toFixed()
        }
      }
      // const ids = this.dish.paidElements ? this.dish.paidElements.map(el => el.id) : []
      for (const ingrId of this.selectedPaidIngredients) {
        const paidIngr = this.paid.find(el => el.id === ingrId)
        if (paidIngr) {
          result += +(paidIngr.ingredient.energy_KCal * paidIngr.weight / 100).toFixed()
        }
      }

      return result * this.count
    },
    ...mapGetters([
      'getNewOrderDishes',
      'isLastOrderNotFinished',
      'getRestaurantId'
    ])
  },
  created() {
    this.waiting = true
  },
  mounted() {
    Keyboard.addListener('keyboardWillShow', () => (this.keyboard = true))

    Keyboard.addListener('keyboardDidHide', () => (this.keyboard = false))

    this.dish?.paidElements || (this.dish.paidElements = [])

    this.getIngredientsType()

    if (this.isAddOneMore) {
      const dish = this.getNewOrderDishes[this.dishIndex]
      this.count = dish.count + 1
    }
  },
  methods: {
    addToBasket() {
      // console.log("hhhhhhhhhh")
      const dish = this.reorganizeDish()
      if (this.isLastOrderNotFinished) {
        alert('Wait for your ongoing order to complete first')
      } else if (this.getRestaurantId !== null && this.getRestaurantId !== this.dish.restaurantId) {
        alert('You can choose dishes only from one restaurant!')
      } else {
        if (this.isAddOneMore) {
          this.getNewOrderDishes.find(el => (el.id === dish.id && el.index === this.dishIndex))
          const { count } = dish
          this.$store.dispatch('increaseDishInNewOrder', {
            count,
            index: this.dishIndex
          })
        } else {
          this.$store.dispatch('setComponentsOfNewOrder', {
            dish,
            restId: this.dish.restaurantId
          })
        }
        this.$router.push('/bucket')
      }
    },
    async addToJournal(dishID) {
      if (this.addJournalClicked == false) {
        if (this.token) {
          this.addJournalClicked = true;
          try {
            var res = await api.POST(AddToJournal.saveToJournal, { dishId: dishID }, this.token);
            console.log(res);
          }
          catch {
            this.$router.push({ name: "Auth" })
          }

        }
        else {
          this.$router.push({ name: "Auth" })
        }
      }
      if (res.data == "Done Successfully") {
        this.addJournalClicked = false;
        this.$router.push('profile');
      }
    },
    getIngredientsType() {
      this.dish?.components.forEach(e => {
        e.ingredientType === 0 && this.main.push(e)
        e.ingredientType === 1 && this.substitude.push(e)
        e.ingredientType === 2 && this.paid.push(e)
        e.ingredientType === 3 && this.paid.push(e)
      })
      this.substitude.sort(function (a, b) {
        if (a.substituteGroup > b.substituteGroup) {
          return 1
        }
        if (a.substituteGroup < b.substituteGroup) {
          return -1
        }
        // a должно быть равным b
        return 0
      })
      this.substitude.length && this.filterSubGroups()
    },
    checkAllPaid(id) {
      return this.selectedPaidIngredients.includes(id)
    },
    addPaidIngredient(id) {
      const index = this.selectedPaidIngredients.findIndex(el => el === id)
      if (index >= 0) {
        this.selectedPaidIngredients.splice(index, 1)
        this.dish.paidElements = this.dish.paidElements.filter(el => el.id !== id)
      } else {
        this.selectedPaidIngredients.push(id)
        this.dish.paidElements.push(this.dish.components.find(el => el.id === id))
      }
    },
    filterSubGroups() {
      const groups = []

      for (const ingr of this.substitude) {
        if (ingr.ingredientType === 1) {
          groups.push(ingr.substituteGroup)
        }
      }

      const uniq = new Set(groups)
      const uniqArr = [...uniq]
      this.substituteGroups = uniqArr.map(el => {
        const group = []
        for (const ingr of this.substitude) {
          if (ingr.substituteGroup === el) group.push(ingr)
        }
        return group
      })

      for (let i = 0; i < this.substituteGroups.length; i++) {
        this.selectedGroups[i] = this.substituteGroups[i][0]
      }
      this.waiting = false
    },
    changeSelect(sub, indexGroup) {
      this.selectedGroups.splice(indexGroup, 1, sub)
    },
    reorganizeDish() {
      return {
        id: this.dish.id,
        name: this.dish.name,
        image: this.dish.image,
        count: this.count,
        comment: this.comment,
        isPromotional: this.dish.isPromotional,
        dishType: this.dish.dishType,
        dishComponentsIds: [...this.selectedPaidIngredients, ...this.selectedGroups.map(el => el.id)],
        price: (this.dish.price + this.paid.reduce((acc, curr) => {
          if (this.selectedPaidIngredients.includes(curr.id)) {
            return acc + curr.price
          } else {
            return acc
          }
        }, 0)),
        promotionalPrice: this.count * (this.dish.promotionalPrice + this.paid.reduce((acc, curr) => {
          if (this.selectedPaidIngredients.includes(curr.id)) {
            return acc + curr.price
          } else {
            return acc
          }
        }, 0))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  //overflow-x: hidden;
}

.all {
  position: absolute;
  overflow-y: auto;
  background: #f2f2f2;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding-bottom: 220px;
  align-items: center;

  .kcal-number {
    font-size: 12px;
  }

  .header {
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    z-index: 10;

    img {
      position: absolute;
      top: 16px;
      left: 35px;
    }

    h1 {
      @include fontMontserrat(16px, bold, 22px);
      color: #2F3741;
      margin: 0;
    }
  }

  ion-header {
    background: white;
    width: 100vw;
    z-index: 10;

    ion-toolbar {
      position: relative;

      img {
        position: absolute;
        top: 16px;
        left: 35px;
      }

      h1 {
        @include fontMontserrat(16px, bold, 22px);
        color: #2F3741;
        margin: 0;
        text-align: center;
      }
    }

  }

  h2 {
    text-align: center;
    margin: 0;
    padding: 12px 0;
    @include fontMontserrat(15px, bold, 20px);
    color: #2F3741;
  }

  .item {
    white-space: nowrap;

    p {
      text-overflow: ellipsis;
      max-width: 80%;
      margin: 0;
    }
  }

  .substitude {
    position: relative;

    .item {
      background: white;
      border-bottom: 1px solid rgba(137, 137, 137, 0.1);
      height: 100%;
      width: 100vw;
      padding-left: 20px;
      padding-right: 17px;
      @include fontMontserrat(14px, bold, 18px);
      color: $color-strong-grey;
      white-space: initial;
      min-height: 50px;

      display: grid;
      grid-template-columns: 51vw 29vw 8vw;

      align-items: center;

      p {
        max-width: 95%;
      }

      .radiobox {
        justify-self: center;
        outline: none;
        background: #DCDFE1;
        height: 22px;
        width: 22px;
        position: relative;
        border-radius: 50%;

        img {
          z-index: 90;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .active {
        background: $color-light-red;
      }
    }

    .check {
      z-index: 100;
      background: $color-light-red;
      height: 22px;
      width: 22px;
      border-radius: 3px;
      position: absolute;
      right: 17px;
      top: 25%;
      transform: translateY(-50%);
      animation: toWhite .5s forwards ease-in-out;
    }

    .toBlack {
      animation: toBlack .5s forwards ease-in-out;
    }
  }

  .ingredients {
    .item {
      background: white;
      border-bottom: 1px solid rgba(137, 137, 137, 0.1);
      min-height: 50px;
      width: 100vw;
      padding-left: 20px;
      padding-right: 17px;
      overflow: hidden;
      @include fontMontserrat(14px, bold, 18px);
      color: $color-strong-grey;
      white-space: initial;
      align-items: center;
      display: grid;
      grid-template-columns: 51vw 29vw 8vw;

      p {
        justify-self: start;
        max-width: 95%;

        span {
          display: block;
          padding: 5px;
          text-align: center;
        }
      }

      span {
        justify-self: start;
      }

      .checkbox {
        justify-self: center;
        outline: none;
        background: #DCDFE1;
        border-radius: 3px;
        height: 22px;
        width: 22px;
        position: relative;

        img {
          z-index: 10;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .active {
        background: $color-light-red;
      }
    }
  }

  .count {
    margin-top: 15px;
    background: white;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
    width: 100vw;

    .action {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: $color-red-button;

      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .digit {
      margin: 0 32px;
      @include fontMontserrat(22px, bold, 27px);
      color: #2F3741;
      line-height: 60px;
    }
  }

  .total-calories {
    margin-top: 15px;
    background: white;
    height: 60px;
    text-align: center;
    padding: 5px 0;
    width: 100vw;

    .digit {
      margin: 0 32px;
      @include fontMontserrat(22px, bold, 27px);
      color: #2F3741;
      line-height: 60px;
    }
  }

  .info-text {
    margin-top: 15px;
    background: white;
    padding: 15px 20px;
    width: 100vw;
    color: #666;
    text-align: center;
    @include fontMontserrat(14px, 400, 16px);

    p {
      margin: 0;
    }
  }

  textarea {
    padding: 5px;
    width: 90vw;
    height: 60px;
    background: white;
    @include fontMontserrat(12px, 600, 15px);
    color: $color-strong-grey;
    resize: none;
  }

  .add {
    bottom: 0;
    left: 0;
    overflow: hidden;
    background: white;
    height: 200px;
    width: 100vw;
    position: fixed;
    z-index: 999;

    button {
      position: relative;
      left: 50%;
      top: 25%;
      transform: translate(-50%, -50%);
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
  }
}
</style>
