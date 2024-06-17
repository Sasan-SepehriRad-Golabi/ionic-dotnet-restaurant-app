<template>
  <ion-content>
    <div class="wrapper" :class="{ iphone }">
      <div
        class="ava-block flex-column"
        :style="`margin-top: ${getIsIphone ? `110px` : `80px`}`"
      ></div>

      <ion-card>
        <div
          class="d-flex text-center headline justify-space-between align-center"
        >
          <span class="ml-3 grey--text">Payment Result </span>
        </div>

        <div v-if="isPaymentSuccess" class="success-box">
          <img
            style="width: 40%; margin: 50px auto"
            :src="require('./../assets/icons/check.png')"
          />
          <div class="text-center">
            <h3>Successful Payment</h3>
            <button
              @click="backtoHome"
              style="
                border: 1.5px solid#f7f7f7;
                padding: 10px;
                border-radius: 6px;
                margin-top: 25px;
              "
              class="btn btn-info"
            >
              Back To Menu
            </button>
          </div>
        </div>
        <div v-else-if="isPaymentSuccess === false" class="faild-box">
          <img
            style="width: 40%; margin: 50px auto"
            :src="require('./../assets/icons/cancel.png')"
          />
          <div class="text-center">
            <h3>Faild Payment</h3>
            <button
              @click="backtoHome"
              style="
                border: 1.5px solid#f7f7f7;
                padding: 10px;
                border-radius: 6px;
                margin-top: 25px;
              "
              class="btn btn-info"
            >
              Back To Menu
            </button>
          </div>
        </div>
        <div v-else class="waiting-box">
          <img
            style="width: 40%; margin: 50px auto"
            :src="require('./../assets/icons/sand-clock.png')"
          />
          <div class="text-center">
            <h3>Checking Payment please wait...</h3>
          </div>
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
import { mainRoute } from "@/service/api.js";

export default {
  name: "PaymentResult",
  data: function () {
    return {
      test: { isSucceed: false },
      loadingPayment: false,
      change: true,
      stripe: "",
      show: false,
      isPaymentSuccess: undefined,
      tokenStripe: {},
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
    ...mapState(["token"]),
  },
  async created() {
    await this.$store.registerModule("stripeModule", stripeModule);
    await this.$store.dispatch("setStripe").then(() => {});
    await this.verifyBancontact();
  },
  mounted() {},
  methods: {
    updateIsSucceed(isSuccess) {
      this.isPaymentSuccess = isSuccess;
    },
    async verifyBancontact() {
      var ps = localStorage.getItem("PaymentSecret");

      var that = this;

      var res = await this.getStripe
        .retrievePaymentIntent(ps)
        .then((response) => {
          if (response.error) {
            // Handle error
            that.isPaymentSuccess = false;
            this.$forceUpdate();
          } else if (
            response.paymentIntent &&
            response.paymentIntent.status === "succeeded"
          ) {
            // Handle successful payment
            that.isPaymentSuccess = true;
            this.$forceUpdate();
          } else {
          }
        });
    },
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
    .headline {
      span {
        font-size: 16px;
        margin-bottom: 16px;
      }
    }
    padding: 20px 15px 25px 15px;
    position: relative;

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
