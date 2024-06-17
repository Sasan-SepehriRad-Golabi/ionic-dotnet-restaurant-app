<template>
  <div :style="`top: ${getIsPhone ? `20px` : `0`}`">
    <v-card class="card" v-for="(dish, index) of getCurrentOrders" :key="index">
      <div class="ion-list" :class="{ step2: isLastOrderNotFinished }">
        <ion-item-sliding :disabled="isLastOrderNotFinished">
          <ion-item lines="none">
            <ion-list>
              <div class="flex-row dish-item">
                <img @click="toDish(dish)" :src="dish.image || require('../assets/default43.svg')" alt="" />
                <p class="dish-name">{{ dish.name }}</p>
                <div class="flex-column price-block">
                  <p v-if="dish.isPromotional" class="price-block__old">
                    <strike> € {{ dish.price.toFixed(2) }} </strike>
                  </p>
                  <p class="price-block__new">
                    €
                    {{
                      dish.isPromotional
                      ? dish.promotionalPrice.toFixed(2)
                      : dish.price.toFixed(2)
                    }}
                  </p>
                </div>
              </div>
            </ion-list>
          </ion-item>
          <ion-item-options side="end" @ionSwipe="deleteItem(index)">
            <ion-item-option color="danger">
              <ion-icon slot="icon-only" :icon="iosTrash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </div>

      <div class="absolute count" v-if="dish.count">x{{ dish.count }}</div>
    </v-card>

    <div v-if="!getCurrentOrders.length" class="notOrders">
      <h2>You have no ongoing orders.</h2>
      <h2>Are you hungry? &#128523;</h2>
    </div>

    <!-- <div v-if="!getCurrentOrders.length && checkCoupons" class="notOrders">
      <h2>
        Order now and get
        {{
          coupons.amountOff === null
            ? coupons.percentOff + "%"
            : coupons.amountOff * 0.01
        }}€ on
      </h2>
      <h2>your order &#127873;</h2>
    </div> -->
    <transition name="fade">
      <v-card class="card next-step-total" v-if="isLastOrderNotFinished && getCurrentOrders.length">
        <div class="fee">
          <p>Fee:</p>
          <div class="fee__description flex-row">
            <p>€</p>
            <p>{{ fee }}</p>
          </div>
        </div>
        <div class="fee" v-if="checkCoupons">
          <p>Discount:</p>
          <div class="fee__description flex-row">
            <p>-€</p>
            <p>
              {{
                coupons.amountOff === null
                ? ((+totalOrderCost + fee) * coupons.percentOff) / 100
                : coupons.amountOff * 0.01
              }}
            </p>
          </div>
        </div>
        <div class="price">
          <p>Total:</p>
          <div class="total__description flex-row">
            <p>€</p>
            <p v-if="!checkCoupons">{{ (+totalOrderCost + fee).toFixed(2) }}</p>
            <p v-else>
              {{
                checkTotalPrice(
                  coupons.amountOff !== null
                    ? (
                      +totalOrderCost +
                      fee -
                      coupons.amountOff * 0.01
                    ).toFixed(2)
                    : (
                      +totalOrderCost +
                      fee -
                      ((+totalOrderCost + fee) * coupons.percentOff) / 100
                    ).toFixed(2)
                )
              }}
            </p>
          </div>
        </div>
      </v-card>
    </transition>
    <div v-if="getCurrentOrders.length && isNewOrderInProgress" @click="clearOrder" class="cancel">
      <h2>Cancel Order</h2>
    </div>
    <div v-if="
      getCurrentOrders.length &&
      isLastOrderNotFinished &&
      getOrderStatusForCancel
    " @click="confirmCancelOrder" class="cancel">
      <h2>Cancel Order</h2>
    </div>
    <div class="margin"></div>

    <v-card class="bot" :style="`bottom: ${getIsPhone ? `25px` : `0`}; height: ${isLastOrderNotFinished ? '240px' : '315px'
      }`" v-if="getCurrentOrders.length">
      <transition name="slide-fade">
        <div v-if="!isLastOrderNotFinished">
          <div :class="{ notOrder: !getCurrentOrders.length }" class="total">
            <div class="fee">
              <p>Fee :</p>
              <div class="fee__description flex-row">
                <p>€</p>
                <p>{{ fee }}</p>
              </div>
            </div>
            <div class="fee" v-if="checkCoupons">
              <p>coupon:</p>
              <div class="fee__description flex-row">
                <p>{{ coupons.couponId }}</p>
              </div>
            </div>
            <div class="fee" v-if="checkCoupons">
              <p>Discount:</p>
              <div class="fee__description flex-row">
                <p>-€</p>
                <p>
                  {{
                    coupons.amountOff === null
                    ? ((+totalOrderCost + fee) * coupons.percentOff) / 100
                    : coupons.amountOff * 0.01
                  }}
                </p>
              </div>
            </div>
            <div class="fee" v-if="checkCoupons">
              <p style="font-size: 14px">
                Discount valid for {{ leftDaysOfCoupons }} days or
                {{ coupons.redemptionsCount }} orders
              </p>
            </div>

            <div class="price">
              <p>Total:</p>
              <div class="total__description flex-row">
                <p>€</p>
                <p v-if="!checkCoupons">
                  {{ checkTotalPrice(totalOrderCost + fee) }}
                </p>
                <p v-else>
                  {{
                    checkTotalPrice(
                      coupons.amountOff !== null
                        ? (
                          +totalOrderCost +
                          fee -
                          coupons.amountOff * 0.01
                        ).toFixed(2)
                        : (
                          +totalOrderCost +
                          fee -
                          ((+totalOrderCost + fee) * coupons.percentOff) / 100
                        ).toFixed(2)
                    )
                  }}
                </p>
              </div>
            </div>

            <Button style="margin: 0 auto" buttonOrder>
              <div class="total__button" @click="checkAllInformation" :class="{ invalid: !checkMinPrice }">
                <BaseLoader v-if="loading" />
                <p v-else>Pay Now</p>
              </div>
            </Button>
          </div>
        </div>
      </transition>

      <transition name="slide-fade2">
        <OrderStatus v-if="isLastOrderNotFinished" />
      </transition>
    </v-card>

    <div class="all-screen" v-show="windowsAdding">
      <div class="add-other">
        <div class="add">
          <div @click="closeWindow" class="cancel">
            <img src="../assets/cancel.svg" alt="" />
          </div>
          <h1>
            Do you want to add {{ windowsStep === 1 ? "desserts" : "drinks" }}?
          </h1>
          <img v-show="windowsStep === 2" src="../assets/drink.svg" alt="" />
          <img v-show="windowsStep === 1" src="../assets/dessert.svg" alt="" />
          <div class="buttons">
            <button @click="setDrinksAndDessertsInNewOrder" class="no">
              No, thanks
            </button>
            <button @click="toRest" class="yes">Add drinks</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import stripeModule from "../store/stripeModule";
import { iosTrash } from "ionicons/icons";
import api from "@/service/api";
import { alertController, loadingController } from "@ionic/core";
import OrderStatus from "@/components/currentOrder/OrderStatus";
import BaseLoader from "@/components/base/BaseLoader";
import { Account, Restaurants, Orders } from "@/service/routes";

export default {
  name: "CurrentOrder",
  data() {
    return {
      currOrders: [],
      fee: 0,
      coupons: null,
      userHasPaymentCards: false,
      windowsAdding: false,
      windowsStep: 0,
      loading: false,
      waitingSendingOrder: {},
      iosTrash,
    };
  },
  components: {
    Button: () => import("./buttons/DefaultButton"),
    OrderStatus,
    BaseLoader,
  },
  async created() {
    if (this.token) {
      this.loading = true;
      await this.$store.dispatch("getLastOrder");
      await this.getInfoAboutCoupons();
      await this.getPaymentMethods();
    }
  },
  computed: {
    ...mapGetters([
      "getLastOrder",
      "isLastOrderNotFinished",
      "getNewOrder",
      "isNewOrderInProgress",
      "getDessertsInNewOrder",
      "getDrinksInNewOrder",
      "getRestaurantId",
      "getDrinks",
      "getDesserts",
    ]),
    ...mapState(["token"]),
    getOrderStatusForCancel() {
      return this.getLastOrder.orderStatus === 0;
    },
    totalOrderCost() {
      const total = this.getCurrentOrders.reduce((acc, el) => {
        if (el.isPromotional) {
          return acc + el.promotionalPrice * el.count;
        } else {
          return acc + el.price * el.count;
        }
      }, 0);
      return +total.toFixed(2);
    }, // true
    getCurrentOrders() {
      if (this.isLastOrderNotFinished) {
        const order = this.getLastOrder.orderedItems;
        for (const dishes of order) {
          dishes.promotionalPrice && (dishes.isPromotional = true);
        }
        return order;
      } else if (this.getNewOrder.dishesIdCount.length) {
        return this.getNewOrder.dishesIdCount;
      } else {
        return [];
      }
    }, // true
    checkCoupons() {
      if (this.coupons) {
        console.log("chekck copun");
        return (
          new Date(this.coupons.expireTime) > new Date() &&
          this.coupons.redemptionsCount > 0
        );
      } else {
        return false;
      }
    }, // true
    leftDaysOfCoupons() {
      if (this.coupons) {
        return Math.round(
          (new Date(this.coupons.expireTime) - new Date()) / (1000 * 3600 * 24)
        );
      } else {
        return 0;
      }
    }, // true
    getIsPhone() {
      return this.$store.state.iphone;
    }, // true
    checkMinPrice() {
      if (this.checkCoupons) {
        if (this.coupons.amountOff !== null) {
          return (
            (
              +this.totalOrderCost +
              this.fee -
              this.coupons.amountOff * 0.01
            ).toFixed(2) >= 1
          );
        } else {
          return (
            (
              +this.totalOrderCost +
              this.fee -
              ((+this.totalOrderCost + this.fee) * this.coupons.percentOff) /
              100
            ).toFixed(2) >= 1
          );
        }
      } else {
        return (+this.totalOrderCost + this.fee).toFixed(2) >= 1;
      }
    }, // true
  },
  mounted() {
    this.$store.registerModule("stripeModule", stripeModule);
  },
  methods: {
    ...mapActions([
      "setDrinks",
      "setDesserts",
      "postOrder",
      "clearNewOrder",
      "deleteFoodItem",
    ]),
    async openLoading() {
      this.waitingSendingOrder = await loadingController.create({
        message: "Please wait...",
      });
      await this.waitingSendingOrder.present();
    },
    closeWindow() {
      this.windowsAdding = false;
      this.windowsStep = 0;
      this.$store.commit("setHideBottomMenu", false);
    },
    async getPaymentMethods() {
      try {
        const { data } = await api.GET(Account.paymentMethods, this.token);
        if (data?.length) {
          this.userHasPaymentCards = true;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    }, // true
    async toRest() {
      const val = this.windowsStep;
      if (this.windowsStep === 2) {
        this.setDrinks(false);
      } else if (this.windowsStep === 1) {
        this.setDesserts(false);
      }
      try {
        const { data } = await api.GET(
          `${Restaurants.allRestaurants}/${this.getRestaurantId}`,
          this.token
        );
        await this.$router.push({
          name: "Restaurant",
          params: {
            restaurant: data,
            category: val,
          },
        });
      } catch (e) {
        console.log(e);
      }
      this.windowsStep--;
    },
    deleteItem(index) {
      if (!this.isLastOrderNotFinished) {
        this.deleteFoodItem(index);
      }
    }, // true
    async getInfoAboutCoupons() {
      try {
        const { data } = await api.GET(Account.coupons, this.token);
        this.coupons = data;
      } catch (e) {
        this.coupons = null;
        console.log(e);
      }
    }, // true
    clearOrder() {
      this.setDrinks(true);
      this.setDesserts(true);
      this.windowsStep = 0;
      this.windowsAdding = false;
      this.clearNewOrder();
    }, // true
    setDrinksAndDessertsInNewOrder() {
      if (this.windowsStep === 2) {
        this.setDrinks(false);
        if (this.getDessertsInNewOrder) {
          this.windowsStep = 0;
          this.windowsAdding = false;
          this.testPostOrder();
        } else {
          this.windowsStep = 1;
        }
      } else if (this.windowsStep === 1) {
        this.setDesserts(false);
        this.windowsStep = 0;
        this.windowsAdding = false;
        this.testPostOrder();
      }
    },
    checkAllInformation() {
      if (this.loading) return;
      if (this.checkMinPrice === false) {
        return alert("Sorry, but minimal price is 0.50€");
      }
      if (!this.token) {
        alert("Log in or Sign up firstly");
        this.$router.push({
          name: "Auth",
          params: { isOrder: true },
        });
        return;
      }
      this.$router.push({ name: "PaymentMethods" });
      return;
      if (!this.userHasPaymentCards) {
        alert("you must fill payment info!");
        this.$router.push({ name: "CardMenu" });
        return;
      }
      this.$store.commit("setHideBottomMenu", true);
      if (!this.getDessertsInNewOrder && this.getDesserts) {
        this.windowsAdding = true;
        this.windowsStep = 1;
      } else {
        this.setDesserts(false);
      }
      if (!this.getDrinksInNewOrder && this.getDrinks) {
        this.windowsAdding = true;
        this.windowsStep = 2;
      } else {
        this.setDrinks(false);
      }
      if (!this.windowsStep) {
        this.testPostOrder();
      }
    },
    async confirmCancelOrder() {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Confirm!",
        message: "Do you want to cancel order?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Okay",
            handler: this.rejectOrder,
          },
        ],
      });
      return alert.present();
    },
    async testPostOrder() {
      await this.openLoading();
      this.$store.commit("setHideBottomMenu", false);
      await this.setDrinks(true);
      await this.setDesserts(true);
      this.windowsStep = 0;
      this.windowsAdding = false;
      await this.postOrder();
      await this.waitingSendingOrder.dismiss();
    },
    toDish(dish) {
      if (!this.isLastOrderNotFinished) {
        this.$router.push({
          name: "Dish",
          params: {
            dishID: dish.id,
            isAddOneMore: true,
            dishIndex: dish.index,
          },
        });
      }
    }, // more less
    async rejectOrder() {
      await this.openLoading();
      const orderID = this.getLastOrder.id;
      try {
        await api.PATCH(
          `${Orders.orders}/${orderID}/Status?status=5`,
          "",
          this.$store.state.token
        );
        await this.$store.dispatch("getLastOrder");
      } catch (e) {
        console.log(e);
      } finally {
        await this.waitingSendingOrder.dismiss();
      }
    },
    checkTotalPrice(price) {
      if (price < 0) {
        return 0;
      } else {
        return price;
      }
    }, 
  },
  beforeDestroy() {
    this.$store.unregisterModule("stripeModule");
  },
};
</script>

<style lang="scss" scoped>
.card {
  margin: 0 10px;
  width: calc(100vw * 345 / 375);

  .absolute {
    position: absolute;
    color: $color-light-red;
    right: 5px;
  }

  .delete {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(45deg);
    font-size: 25px;
  }

  .count {
    bottom: 5px;
    font-weight: 600;
  }
}

.margin {
  margin-top: 100px;
}

ion-list {
  padding: 15px 0;
  margin-bottom: 0;
}

.ion-list {
  margin-bottom: -10px;
  animation: step1 1s forwards;
}

.step2 {
  margin-bottom: 10px;
  animation: step2 1s forwards;
}

ion-item {
  border-radius: 5px;
}

ion-item-options,
ion-item-option {
  background-color: $color-light-red;
  border-radius: 5px;
}

.next-step-total {
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
      color: #2f3741;
    }
  }
}

.dish-item {
  position: relative;
  align-items: center;
  width: calc(100vw * 300 / 375);

  img {
    width: 90px;
    height: 70px;
    border-radius: 5px;
    margin-right: 10px;
  }

  p {
    color: $color-strong-grey;
    font-size: 14px;
  }

  .dish-name {
    max-width: 140px;
  }

  .price-block {
    position: absolute;
    right: 0;

    &__old {
      margin-top: 1px;
    }

    &__new {
      margin: 0;
      color: black;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .delete-dish-item {
    background-clip: $color-light-red;
  }
}

.editing {
  position: absolute;
  left: 35%;
  top: 50px;

  p,
  .minus,
  .plus {
    margin: 0 15px;
    display: inline-block;
    @include fontMontserrat(22px, bold, 27px);
    color: #2f3741;
  }

  .minus,
  .plus {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: rgba(245, 199, 177, 0.2);
    color: $color-light-red;
    text-align: center;
    cursor: pointer;
  }
}

.notOrders {
  width: 100vw;
  text-align: center;
  transform: translateX(-5px);

  h2 {
    margin-top: 100px;
    @include fontMontserrat(16px, bold, 20px);
    color: #2f3741;

    &+h2 {
      margin-top: 10px;
    }
  }
}

.bot {
  padding: 0;
  margin-left: -5px;
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 315px;
  z-index: 999;

  .total {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    width: 315px;

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
        padding-top: 5px;
      }
    }

    .price {
      margin-top: 15px;

      p {
        @include fontMontserrat(18px, bold, 22px);
        color: #2f3741;
      }
    }

    .total__button {
      z-index: 1002;
      margin: 0;
      margin-top: 17px;
      max-width: 315px;
      height: 50px;
      background: $color-green;
      box-shadow: 0px 4px 4px rgba(26, 157, 199, 0.25);
      border-radius: 5px;
      text-align: center;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.invalid {
        background: grey;
      }

      p {
        @include fontMontserrat(18px, bold, 22px);
        color: #ffffff;
        width: 315px;
      }
    }
  }

  .notOrder {
    .price {
      p {
        color: $color-strong-grey;
      }
    }

    .total__button {
      background: #c5c5c5;
      box-shadow: none;
    }
  }
}

.not-order {
  text-align: center;
}

.cancel {
  float: right;
  margin-right: 25px;

  h2 {
    @include fontMontserrat(14px, bold, 17px);
    color: $color-light-red;
    margin-top: 10px;
  }
}

.all-screen {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  align-items: flex-end;

  .add-other {
    width: 100vw;
    height: 320px;
    background: #ffffff;
    border-radius: 5px 5px 0 0;
    z-index: 99999;

    .add {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 99999;

      .cancel {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        position: absolute;
        background: #dce0e1;
        margin: 0;
        top: 21px;
        right: 24px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          margin: 0;
        }
      }

      h1 {
        margin-top: 50px;
        @include fontMontserrat(16px, bold, 20px);
        color: #2f3741;
      }

      img {
        margin-top: 24px;
      }

      .buttons {
        margin-top: 55px;
        display: flex;
        width: 100vw;
        justify-content: space-around;

        button {
          height: 40px;
          width: 45vw;
          min-width: 80px;
          @include fontMontserrat(12px, bold, 15px);
          border-radius: 3px;
        }

        .no {
          background: $color-red-button;
          color: $color-light-red;
          //margin-right: 11px;
        }

        .yes {
          background: $color-light-red;
          color: #ffffff;
          filter: drop-shadow(0px 3.90566px 3.90566px rgba(255, 50, 50, 0.25));
        }
      }
    }
  }
}
</style>
