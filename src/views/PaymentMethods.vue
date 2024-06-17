<template>
  <ion-content>
    <div class="wrapper" :class="{ iphone }">
      <div class="ava-block flex-column" :style="`margin-top: ${getIsIphone ? `110px` : `80px`}`"></div>

      <ion-card>
        <div class="d-flex headline justify-space-between align-center">
          <span class="ml-3 grey--text">Payment Methods</span>
        </div>
        <v-btn class="ma-2 pay-option" outlined color="green" block @click="handleBancontact" :disabled="isDisabled">
          <img :src="require('./../assets/icons/cards/bancontact.png')" />
          BanContact
        </v-btn>

        <v-btn class="ma-2 pay-option" outlined color="green" block @click="checkAllInformation">
          <img :src="require('./../assets/icons/cards/mastercard.png')" />
          Card
        </v-btn>
      </ion-card>
    </div>
    <ion-card>
      <div class="add-discount-card">
        <div class="text-fil">
          <v-text-field label="Discount codes" v-model="discountcode" type="text" color="#d55951"></v-text-field>
        </div>
        <div class="text-center">
          <v-btn rounded color="#d55951" dark @click="addDiscount"> add </v-btn>
        </div>
      </div>
    </ion-card>
  </ion-content>
</template>
 


<script>
import { mapState } from "vuex";
import stripeModule from "../store/stripeModule";
import api from "@/service/api";
import { alertController } from "@ionic/core";
import { Account } from "@/service/routes";
import { mainRoute } from "@/service/api.js";

export default {
  name: "PaymentMethods",
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
      isDisabled: false,
      user,
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
    this.$store.dispatch("setStripe").then(() => { });
    this.getPaymentMethods();
  },
  mounted() {
    this.GetDiscount();
  },
  methods: {
    async addDiscount() {
      console.log(Account.ListCoupons);
      try {
        const body = {
          couponId: this.discountcode,
          enable: true,
        };
        await api.POST(Account.AddCoupons, body, this.token);
        this.$router.push({ name: "CardMenu" });
      } catch (e) {
        alert(`No such coupon: ${this.discountcode}`);
      }
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
    async GetDiscount() {
      try {
        const { data } = await api.GET(Account.ListCoupons, this.token);
        this.ListCoupons = data;
      } catch (e) {
      }
    },
    async checkAllInformation() {
      if (this.loading) return;

      if (!this.userHasPaymentCards) {
        alert("you must fill payment info!");
        this.$router.push({ name: "CardMenu" });
        return;
      }
    },
    async handleBancontact() {
      this.isDisabled = true;
      await this.$store.dispatch("acceptBanContact");
      var ps = localStorage.getItem("PaymentSecret");
      var res = await this.getStripe.confirmBancontactPayment(ps, {
        payment_method: {
          billing_details: {
            //load user.CustomerAccountId
            email: "generatedSepaDebitIntentsSucceed@example.com",
            name: "cus_LNybsoNfdcnCHc",
          },
        },
        return_url:
          window.location.protocol +
          "//" +
          window.location.hostname +
          "/paymentresult",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/variables.scss";
@import "../scss/animations.scss";

.add-discount-card {
  padding: 1rem;
  height: 100%;
  display: flex !important;
  align-items: center !important;
  justify-content: space-around !important;
}

.wrapper {
  margin-bottom: 120px;
  margin-top: 100px;
  position: relative;

  &.iphone {
    margin-top: 120px;
  }

  ion-card {
    .headline {
      span {
        font-size: 16px;
        margin-bottom: 16px;
      }
    }

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

    .pay-option img {
      width: 10% !important;
    }

    .sc-ion-card-md-h {
      box-shadow: 0px 15px 50px -25px rgb(0 0 0 / 10%) !important;
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
