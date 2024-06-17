import { loadStripe } from '@stripe/stripe-js'
import api from '@/service/api'
import { Account } from '@/service/routes'

export default {
  state: {
    stripe: null,
    card: null,
    paymentIntent: localStorage.getItem('paymentIntent') || '',
    last4: localStorage.getItem('last4') || ''
  },
  mutations: {
    createStripeElement(state, { stripe, card }) {
      state.stripe = stripe
      state.card = card
    },
    setPaymentIntent(state, id) {
      state.paymentIntent = id
      localStorage.setItem('paymentIntent', id)
    },
    setPaymentSecret(state, id) {
      state.PaymentSecret = id;
      localStorage.setItem('PaymentSecret', id)
    },
    setCard(state, last4) {
      state.last4 = last4
      localStorage.setItem('last4', last4)
    },
    clearCardInformation(state) {
      state.paymentIntent = ''
      state.last4 = ''
    },
    clearData(state) {
      state.card.clear()
    }
  },
  actions: {
    setStripe({ commit, state }) {
      let stripeKey = 'pk_test_51HACLHAXPLh5DUJqIsGQJE7KkL83gnapy8imCqGTMzSvyZgPcfpXLA4uas3FYsrNfLyJzQsPyBHzg9wBjU86ljR400EA3d8Qit'
      //  const stripeKey = 'pk_live_51HACLHAXPLh5DUJqj5B5AjNCdMcovP14VtltcuLYkuGdHfMYsrgeK6ghQp60PLSSouq9GwmuCfdGj8CnMAyAVAq100TYjX9m5F'

      return new Promise(async (resolve, reject) => {
        if (!state.stripe || !state.card) {
          try {
            const stripe = await loadStripe(stripeKey)
            const elements = stripe.elements()
            // Custom styling can be passed to options when creating an Element.
            // (Note that this demo uses a wider set of styles than the guide below.)
            const style = {
              base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '15px',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
              }
            }
            // Create an instance of the card Element.
            const card = elements.create('card', { style })
            const data = {
              stripe, card
            }
            commit('createStripeElement', data)
            resolve()
          } catch (e) {
            console.log(e)
            reject()
          }
        } else resolve()
      })
    },
    async acceptBanContact({ commit, rootState, getters }) {
      await api.GET(`${Account.createPaymentSecret}`, rootState.token)
        .then(async function (response) {
          console.log('purchase RESPONSE')
          commit('setPaymentSecret', response.data)
        })
        .catch(err => {
          console.dir(err)
          alert('Error with payment card')

        })
    },
    clearData({ commit }) {
      commit('clearData')
    }

    ,
    async refundConfirmationMoney({ commit, rootState, getters }, id) {
      await api.GET(`${Account.createPaymentMethod}/${getters.getPaymentIntent}/${id}`, rootState.token)
        .then(async function (response) {
          console.log('purchase RESPONSE')
          commit('setCard', response.data.last4)
        })
        .catch(err => {
          alert('Error with payment card')
          console.dir(err)
        })
    },
    clearData({ commit }) {
      commit('clearData')
    }
  },
  getters: {
    getStripe(s) {
      return s.stripe
    },
    getCardElement(s) {
      return s.card
    },
    getPaymentIntent(s) {
      return s.paymentIntent
    },
    getLast4(s) {
      return s.last4
    }
  }
}
