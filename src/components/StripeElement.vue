<template>
  <div>
    <div class="form-row">
      <div v-show="change" id="card-element">
        <!-- A Stripe Element will be inserted here. -->
      </div>
      <span v-show="!change">
                      Card **** **** **** {{ getLast4 }} is installed
                    </span>
    </div>

    <div id="card-errors" role="alert"></div>
    <ion-item v-show="change">
      <button class="submit-payment" @click="purchase()">
        {{ loadingPayment ? '' : 'Submit Payment' }}
        <BaseLoader v-if="loadingPayment"/>
      </button>
    </ion-item>
    <ion-item v-show="!change">
      <button class="submit-payment" @click="changeCardInfo">
        Change card information
      </button>
    </ion-item>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import stripeModule from '../store/stripeModule'
import api from "@/service/api";
import {Account} from "@/service/routes";
const BaseLoader = () => import('@/components/base/BaseLoader')


export default {
  name: "StripeElement",
  data() {
    return {
      change: false,
      loadingPayment: false,
      // stripe: '',
      // card: '',
      token: {}
    }
  },
  components: {
    BaseLoader
  },
  computed: {
    getPaymentIntent() {
      return this.$store.state.stripeModule.paymentIntent
    },
    getStripe() {
      return this.$store.state.stripeModule.stripe
    },
    getCardElement() {
      return this.$store.state.stripeModule.card
    },
    getLast4() {
      return this.$store.state.stripeModule.last4
    },
    ...mapState(['token'])
  },
  methods: {
    changeCardInfo() {
      this.change = true
    },
    async purchase() {
      let vm = this
      this.loadingPayment = true
      await this.getStripe.createToken(this.getCardElement)
        .then(async (result) => {
          if (!result.error) {
            console.log('purchase RESULT TOKEN')
            vm.token = result.token
            await api.GET(Account.createPaymentIntent, vm.token)
              .then(function (response) {
                console.log('gut CreatePaymentIntent')
                vm.$store.commit('setPaymentIntent', response.data)
              })
              .catch(function (error) {
                console.log('error CreatePaymentIntent')
                console.log(error);
              })

            if (vm.getPaymentIntent && result.token.id) {
              await vm.$store.dispatch('refundConfirmationMoney', result.token.id)
                .then(() => {
                  vm.change = false
                })
                .catch((err) => {
                  console.log('purchase ERROR')
                  console.dir(err)
                  alert('Failed')
                  vm.change = true
                })
            }
          } else {
            alert(result.error.message)
          }
          vm.loadingPayment = false
        })
        .catch(err => {
          console.log('ERROR')
          console.log(err)
        })

    },
  },

  created () {
    this.$store.registerModule('stripeModule', stripeModule);
  },
  async mounted() {
      await this.$store.dispatch('setStripe').then(() => {
        this.getCardElement.mount('#card-element')
      })

    if (!this.getLast4) {
      this.change = true
    }
  },
  beforeDestroy () {
    this.$store.unregisterModule('stripeModule')
  }
}
</script>

<style scoped lang="scss">
.form-row {
  padding: 10px 0;
  margin-left: 16px;
  border-bottom: 1px solid #c8c7cc;
}

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
</style>
