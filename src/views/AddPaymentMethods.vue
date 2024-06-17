<template>
  <ion-content>
    <div class="add-discount">
      <div class="wrapper" :class="{ iphone }">
        <div class="text-fil">
          <ion-card>
            <div class="form-row">
              <div id="card-element">
                <!-- A Stripe Element will be inserted here. -->
              </div>
            </div>
            <div id="card-errors" role="alert"></div>
          </ion-card>
        </div>
      </div>

      <div class="text-center">
        <v-btn rounded color="#d55951" dark @click="purchase()">
          {{ loadingPayment ? "" : "Submit Payment" }}
          <BaseLoader v-if="loadingPayment" />
        </v-btn>
      </div>
    </div>
  </ion-content>
</template>

<script>
import api from '@/service/api'
import { Account } from '@/service/routes'
import { mapState } from 'vuex'
import stripeModule from '../store/stripeModule'
export default {
  name: 'AddPaymentMethods',
  created () {
    this.$store.registerModule('stripeModule', stripeModule)
    this.$store.dispatch('setStripe').then(() => {
      this.getCardElement.mount('#card-element')
    })
  },
  data () {
    return {
      loadingPayment: false,
      change: true,
      stripe: '',
      show: false,
      card: '',
      tokenStripe: {},
      paymentMethods: [],
      ListCoupons: []
    }
  },
  computed: {
    getPaymentIntent () {
      return this.$store.state.stripeModule.paymentIntent
    },
    getStripe () {
      return this.$store.state.stripeModule.stripe
    },
    getCardElement () {
      return this.$store.state.stripeModule.card
    },
    ...mapState(['token', 'iphone'])
  },
  methods: {
    async purchase () {
      // adding new payment card
      try {
        this.loadingPayment = true
        // 1 - creating stripe token for card
        const result = await this.getStripe.createToken(this.getCardElement)
        // 2 - checking error with card (invalid cvv etc)
        if (!result.error) {
          this.tokenStripe = result.token
          const { data } = await api.GET(
            Account.createPaymentIntent,
            this.token
          )
          this.$store.commit('setPaymentIntent', data)
          if (this.getPaymentIntent && result.token.id) {
            await this.$store.dispatch(
              'refundConfirmationMoney',
              result.token.id
            )
            this.change = false
            await this.$store.dispatch('clearData')
            this.$router.push({ name: 'CardMenu' })
          }
        } else {
          alert(result.error.message)
        }
      } catch (e) {
        console.log(e)
        this.change = true
      } finally {
        this.loadingPayment = false
      }
    }
  },
  beforeDestroy () {
    this.$store.unregisterModule('stripeModule')
  }
}
</script>

<style scoped lang="scss">
.add-discount {
  padding: 1rem;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
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
