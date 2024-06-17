<template>
  <div class="orders">
    <div class="info-order">
      <div class="spent">
        <p>Money spent</p>
        <p>€ {{ totalSpent }}</p>
      </div>
      <div class="saved">
        <p>Money saved with the discount</p>
        <p>€ {{ totalSaved }}</p>
      </div>
      <div class="buttons">
        <button @click="update('month')" :class="{active: period==='month'}" class="month">Month</button>
        <button @click="update('week')" :class="{active: period==='week'}" class="week">Week</button>
        <button @click="update('day')" :class="{active: period==='day'}" class="day">Day</button>
      </div>
    </div>

    <div v-if="filteredOrders.length">
      <v-card class="blockWithOrders" v-for="(order,indexAll) of filteredOrders" :key="indexAll">
        <div class="width">
          <v-card @click="openOrder(order.id)" class="card order-num order">
            <span>order #{{ order.id }}</span>
            <span>{{ new Intl.DateTimeFormat('en-GB').format(new Date(order.creationDate)) }}</span>
          </v-card>
          <v-card :class="{hiddenOrder: activeOrder!==order.id}" class="card" v-for="(dish,index) in order.orderedItems"
                  :key="index">
            <ion-list>
              <div>
                <ion-item lines="none">
                  <div class="flex-row food-item">
                    <img :src="dish.image || require('../assets/default43.svg')" alt="">
                    <p>{{ dish.name }}</p>
                    <div class="flex-column price-block">
                      <p v-if="dish.promotionalPrice" class="price-block__old">
                        <span class="text-decoration-line-through">€ {{ dish.price }}</span>
                      </p>
                      <p class="price-block__new">
                        € {{ `${dish.promotionalPrice ? dish.promotionalPrice : dish.price} x ${dish.count}` }}
                      </p>
                    </div>
                  </div>
                </ion-item>
              </div>
            </ion-list>
          </v-card>
          <v-card v-if="activeOrder===order.id" class="card total">
            <div class="fee">
              <p>Fee:</p>
              <div class="fee__description flex-row">
                <p>€</p>
                <p>{{ fee }}</p>
              </div>
            </div>

            <div class="price">
              <p>Total:</p>
              <div class="total__description flex-row">
                <p>€</p>
                <p>{{ order.promotionalOrderPrice ? order.promotionalOrderPrice : order.orderPrice }}</p>
              </div>
            </div>
          </v-card>
        </div>
      </v-card>

    </div>
    <div v-else>
      <v-card class="card order-num">
        you have not orders
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/service/api'
import { Orders } from '@/service/routes'

export default {
  name: 'HistoryOrder',
  data () {
    return {
      fee: 0,
      period: 'month',
      filteredOrders: [],
      activeOrder: '',
      orders: []
    }
  },
  computed: {
    totalSpent () {
      return this.filteredOrders.reduce((acc, el) => el.promotionalOrderPrice ? (acc + el.promotionalOrderPrice) : (acc + el.orderPrice), 0)
    },
    totalSaved () {
      return this.filteredOrders.reduce((acc, el) => el.promotionalOrderPrice ? (acc + (el.orderPrice - el.promotionalOrderPrice)) : acc, 0)
    },
    ...mapState(['token'])
  },
  async created () {
    await this.getOrders()
    this.update('month')
  },
  methods: {
    async getOrders () {
      try {
        const { data } = await api.GET(Orders.orders, this.token)
        this.orders = data.filter(el => el.orderStatus === 4)
      } catch (e) {
        console.log(e)
      }
    },
    openOrder (id) {
      this.activeOrder = this.activeOrder === id ? '' : id
    },
    update (status) {
      this.period = status
      this.activeOrder = ''

      const lastMonth = new Date(new Date() - 31 * 24 * 3600 * 1000)
      const lastWeek = new Date(new Date() - 7 * 24 * 3600 * 1000)
      const lastDay = new Date(new Date() - 24 * 3600 * 1000)

      if (status === 'day') {
        this.filteredOrders = this.orders.filter(el => (new Date(el.creationDate) > lastDay))
      } else if (status === 'month') {
        this.filteredOrders = this.orders.filter(el => (new Date(el.creationDate) > lastMonth))
      } else {
        this.filteredOrders = this.orders.filter(el => (new Date(el.creationDate) > lastWeek))
      }

      this.filteredOrders.sort((a, b) => {
        if (a.id > b.id) {
          return -1
        }
        if (a.id < b.id) {
          return 1
        }
        return 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.orders {
  //margin-top: 500px;
  //margin-bottom: -500px;
}

.info-order {
  margin-top: 20px;
  height: 150px;
  width: calc(100vw - 10px);
  background: #f8f8f8;
  padding: 0 30px;

  div {
    display: flex;
    justify-content: space-between;
  }

  p {
    display: inline;
    @include fontMontserrat(14px, bold, 20px);
  }

  .spent {
    p {
      color: #898989;
    }
  }

  .saved {
    p {
      color: #3D8F45;
    }
  }

  .buttons {
    button {
      outline: none;
      width: 28%;
      height: 40px;
      @include fontMontserrat(13px, bold, 17px);
      background: white;
      color: #2F3741;
      border-radius: 5px;
      font-size: 13px;
    }

    .active {
      background: $color-red-tab;
      color: $color-light-red;
    }
  }
}

.blockWithOrders {
  margin-top: 10px;

}

.order-num {
  z-index: 100;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.hiddenOrder {
  position: absolute;
  display: none;
}

.total {
  margin-top: -10px;
  padding: 16px;

  div {
    display: flex;
    justify-content: space-between;

    p {
      margin: 0;
    }
  }

  .fee {
    p {
      @include fontMontserrat(15px, 600, 17px);
      color: $color-strong-grey;
    }
  }

  .price {
    margin-top: 15px;

    p {
      @include fontMontserrat(18px, bold, 22px);
      color: #2F3741;
    }
  }
}

.card-order {
  margin: 0 10px;
}

ion-list {
  padding: 16px 15px 22px 0;
  margin-bottom: 0;
}

ion-item-options, ion-item-option {
  background-color: $color-light-red;
}

.food-item {
  position: relative;
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;

  img {
    width: 90px;
    height: 70px;
    border-radius: 5px;
    margin-right: 10px;
  }

  p {
    color: $color-strong-grey;
    font-size: 12px;
  }

  .price-block {
    &__old {
      margin-top: 1px;
    }

    &__new {
      margin-top: -10px;
      color: black;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .delete-food-item {
    background-clip: $color-light-red;
  }
}
</style>
