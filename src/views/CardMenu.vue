<template>
  <ion-content>
    <div class="wrapper" :class="{ iphone }">
      <div class="d-flex justify-space-between align-center">
        <span class="ml-3 grey--text">Payment Methods</span>
        <v-btn class="ma-2" outlined x-small fab color="grey">
          <v-icon @click="$router.push({ name: 'AddPaymentMethods' })"
            >mdi-plus</v-icon
          >
        </v-btn>
      </div>
      <ion-card
        v-for="(card, index) of paymentMethods"
        :key="index"
        @click="changeShow(index)"
      >
        <span
          class="card-icon"
          :class="[card.brand.replace(/\s/gi, '_')]"
        ></span>

        <ion-item>
          <div class="card-info">
            <p :style="`color: ${card.isDefault ? 'green' : 'black'}`">
              <span>Card **** {{ card.last4 }}</span>
              <span
                >{{
                  card.expMonth.length === 1
                    ? `0${card.expMonth}`
                    : card.expMonth
                }}/{{ card.expYear }}</span
              >
            </p>
            <transition name="push">
              <div class="buttons" v-show="card.show">
                <button
                  @click="setActiveMethod(card.id)"
                  v-show="paymentMethods.length >= 2"
                >
                  Make as active card
                </button>
                <button @click="openConfirmWindow(card.id)">Delete card</button>
              </div>
            </transition>
          </div>
        </ion-item>
      </ion-card>
      <ion-card v-if="paymentMethods.length === 0">
        <v-btn
          class="ma-2"
          outlined
          color="green"
          block
          @click="$router.push({ name: 'AddPaymentMethods' })"
        >
          Add a payment method
        </v-btn>
      </ion-card>
      <div class="d-flex justify-space-between align-center">
        <span class="ml-3 grey--text">Discount codes</span>
        <v-btn class="ma-2" outlined x-small fab color="grey">
          <v-icon @click="$router.push({ name: 'AddDiscount' })"
            >mdi-plus</v-icon
          >
        </v-btn>
      </div>
      <ion-card v-if="ListCoupons.length === 0">
        <v-btn
          class="ma-2"
          outlined
          color="green"
          block
          @click="$router.push({ name: 'AddDiscount' })"
        >
          Add a Discount method
        </v-btn>
      </ion-card>
      <ion-card v-if="ListCoupons.length > 0">
        <div v-for="item in ListCoupons" :key="item">
          <div>
            <p class="nutrit-title font-weight-bold">
              {{ item.couponId }}
            </p>
            <div class="d-flex flex-column">
              <p class="w-100">{{ item.name }}</p>
              <p class="w-100" v-if="item.expireTime !== null">
                (expires: {{ item.expireTime }})
              </p>
            </div>

            <p v-if="item.amountOff !== null">
              AmountOff: {{ item.amountOff * 0.01 }} {{ item.currency }}
            </p>
            <p v-else>PercentOff: {{ item.percentOff }} %</p>
          </div>
          <v-divider></v-divider>
        </div>
      </ion-card>
    </div>
  </ion-content>
</template>

<script>
import { mapState } from "vuex";
import stripeModule from "../store/stripeModule";
import api from "@/service/api";
import { alertController } from "@ionic/core";
import { Account } from "@/service/routes";

export default {
  name: "CardMenu",
  data() {
    return {
      loadingPayment: false,
      change: true,
      stripe: "",
      show: false,
      card: "",
      tokenStripe: {},
      paymentMethods: [],
      ListCoupons: [],
    };
  },
  computed: {
    getPaymentIntent() {
      return this.$store.state.stripeModule.paymentIntent;
    },
    getStripe() {
      return this.$store.state.stripeModule.stripe;
    },
    getCardElement() {
      return this.$store.state.stripeModule.card;
    },
    ...mapState(["token", "iphone"]),
  },
  created() {
    this.$store.registerModule("stripeModule", stripeModule);
    this.$store.dispatch("setStripe").then(() => {
      // this.getCardElement.mount('#card-element')
    });
    this.getPaymentMethods();
  },
  mounted() {
    this.GetDiscount();
  },
  methods: {
    changeCardInfo() {
      this.change = true;
    },
    sortMethods() {
      this.paymentMethods.sort(function (a, b) {
        if (a.isDefault > b.isDefault) {
          return -1;
        }
        if (a.isDefault < b.isDefault) {
          return 1;
        }
        return 0;
      });
    },
    changeShow(index) {
      this.paymentMethods[index].show = !this.paymentMethods[index].show;
      this.sortMethods();
    },
    async purchase() {
      // adding new payment card
      try {
        this.loadingPayment = true;
        // 1 - creating stripe token for card
        const result = await this.getStripe.createToken(this.getCardElement);
        // 2 - checking error with card (invalid cvv etc)
        if (!result.error) {
          this.tokenStripe = result.token;
          const { data } = await api.GET(
            Account.createPaymentIntent,
            this.token
          );
          this.$store.commit("setPaymentIntent", data);
          if (this.getPaymentIntent && result.token.id) {
            await this.$store.dispatch(
              "refundConfirmationMoney",
              result.token.id
            );
            this.change = false;
            await this.getPaymentMethods();
            await this.$store.dispatch("clearData");
          }
        } else {
          alert(result.error.message);
        }
      } catch (e) {
        console.log(e);
        this.change = true;
      } finally {
        this.loadingPayment = false;
      }
    },
    async getPaymentMethods() {
      try {
        const { data } = await api.GET(Account.paymentMethods, this.token);
        console.log("get methods");
        this.paymentMethods = data;
      } catch (e) {
        console.log("error get methods");
        console.log(e);
      }
      if (this.paymentMethods.length) {
        for (const method of this.paymentMethods) {
          method.show = false;
        }
      }
      this.sortMethods();
    },
    async setActiveMethod(id) {
      try {
        await api.PUT(`${Account.defaultPaymentMethod}/${id}`, "", this.token);
        await this.getPaymentMethods();
      } catch (e) {
        console.log(e);
      }
    },
    async openConfirmWindow(id) {
      const alert = await alertController.create({
        header: "Do you confirm the deletion?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Okay",
            handler: () => this.deletePaymentMethod(id),
          },
        ],
      });
      return alert.present();
    },
    async deletePaymentMethod(id) {
      try {
        await api.DELETE(`${Account.paymentMethods}/${id}`, this.token);
        await this.getPaymentMethods();
      } catch (e) {
        console.log(e);
      }
    },
    async GetDiscount() {
      try {
        const { data } = await api.GET(Account.ListCoupons, this.token);
        this.ListCoupons = data;
      } catch (e) {
        console.log("error get methods");
        console.log(e);
      }
    },
  },
  beforeDestroy() {
    this.$store.unregisterModule("stripeModule");
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/variables.scss";
@import "../scss/animations.scss";

.wrapper {
  margin-bottom: 120px;
  margin-top: 100px;
  position: relative;

  &.iphone {
    margin-top: 120px;
  }

  ion-card {
    padding: 20px 15px 25px 15px;
    position: relative;

    .card-icon {
      display: block;
      width: 49px;
      height: 100%;
      position: absolute;
      top: 10px;
      right: 18px;
      z-index: 5;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url("../assets/icons/cards/unknown.png");

      &.visa {
        background-image: url("../assets/icons/cards/visa.png");
      }

      &.diners_club {
        background-image: url("../assets/icons/cards/diners_club.png");
      }

      &.discover {
        background-image: url("../assets/icons/cards/discover.png");
      }

      &.jcb {
        background-image: url("../assets/icons/cards/jcb.png");
      }

      &.mastercard {
        background-image: url("../assets/icons/cards/mastercard.png");
      }

      &.unionpay {
        background-image: url("../assets/icons/cards/unionpay.png");
      }
    }

    ion-item {
      .submit-payment {
        right: 0;
        @include fontMontserrat(12px, 500, 15px);
        position: absolute;
        // background: $color-red-tab;
        width: 135px;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $color-light-red;
        padding: 0 15px;
        height: 40px;
        border-radius: 5px;
      }

      .card-info {
        display: flex;
        flex-direction: column;
        width: 100%;

        .push-enter-active {
          animation: show 0.5s 0.1s both;
        }

        .push-leave-active {
          animation: show 0.5s both reverse;
        }

        @keyframes show {
          0% {
            height: 0;
          }
          100% {
            height: 100%;
          }
        }

        p {
          display: flex;
          justify-content: space-around;
          padding-right: 45px;
        }

        .buttons {
          display: flex;
          flex-direction: column;

          button {
            border: 1px solid black;
            border-radius: 10px;
            margin: 10px auto;
            padding: 10px 0;
            color: $color-light-red;
            width: 100%;
            //min-width: 250px;
          }
        }
      }
    }

    .form-row {
      padding: 10px 0;
      margin-left: 16px;
      border-bottom: 1px solid #c8c7cc;
    }

    ion-label {
      font-weight: 600;
      text-align: center;
    }

    ion-text {
      width: 100%;
      font-size: 14px;
      justify-content: space-between;
      margin-top: 15px;
    }
  }
}
</style>
