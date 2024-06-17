<template>
  <div class="login-container">

    <div class="inputs-block">
      <v-text-field label="Email" dark v-model="email"></v-text-field>
    </div>
    <div class="btn-block" @click="postEmail">
      <div>
        <DefaultButton class="mt-5">
          <span v-if="!loading">OK</span>
          <loader v-else />
        </DefaultButton>
      </div>
    </div>

  </div>
</template>

<script>
import api from "@/service/api";
import Loader from "@/components/base/BaseLoader";
import { Account } from "@/service/routes";

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false
    }
  },
  components: {
    Loader,
    DefaultButton: () => import('./buttons/DefaultButton'),
  },
  methods: {
    async postEmail() {
      if (!this.loading) {
        if (this.email) {
          let vm = this
          this.loading = true
          await api.POST(Account.forgotPassword, { "email": this.email }, this.$store.state.token)
            .then(() => {
              alert('We just sent you a new password. Please check your email.')
              vm.$emit('emitAction', 'Login')
            })
            .catch(err => {
              if (err.response) {
                if (err.response.status === 400) {
                  alert('Your email is not correct. Please try again.')
                }
                if (err.response.status === 500) {
                  alert('Upps, problem on the server. Please retry again.')
                }
              }
            })
          this.loading = false
        } else return alert('Please, enter your email')

      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background-color: $color-light-red;
  padding: 5%;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;

  .inputs-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .btn-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    p {
      text-align: center;
      color: #ffffff;
      margin-top: 20px;
    }
  }
}
</style>
