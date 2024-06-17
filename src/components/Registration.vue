<template>
  <div class="login-container">
    <div class="inputs-block">
      <v-text-field label="Email" dark :rules="isValidEmail ? [] : [rules.emailMatch]" v-model="email" color="#ffff"
        class="mb-4"></v-text-field>
      <v-text-field label="Password" dark :rules="isValidPassword ? [] : [rules.passwordMatch]" v-model="password"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword" class="mb-4"></v-text-field>
      <v-text-field label="Phone number" dark filled v-model="phone" type="tel"></v-text-field>
    </div>
    <div class="checkbox">
      <button :class="{ active: agree }" @click="agree = !agree">
        <img v-show="agree" src="../assets/checkRed.svg" alt="" />
      </button>
      <span>I agree with
        <a href="https://ruddy.app/signup-termsconditions/" target="_blank">Terms & Condition</a></span>
    </div>
    <div class="btn-block">
      <div @click="getRegister">
        <DefaultButton class="mt-5">
          {{ loading ? "" : "Register" }}
          <BaseLoader v-if="loading" />
        </DefaultButton>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultButton from './buttons/DefaultButton'
import { mapState } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      phone: '+32',
      showPassword: false,
      loading: false,
      agree: false,
      testEmail:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //eslint-disable-line
      testPass:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@.,#\$%\^&\*])(?=.{8,})/, // eslint-disable-line,
      rules: {
        passwordMatch: () =>
          'Password must include, min 8 characters, Uppercase letters, Numbers and Special characters.',
        emailMatch: () => 'Invalid email'
      }
    }
  },
  computed: {
    isValidEmail() {
      return this.testEmail.test(String(this.email.trim()))
    },
    isValidPassword() {
      return this.testPass.test(String(this.password.trim()))
    },
    ...mapState(['token'])
  },
  components: {
    DefaultButton
  },
  props: ['isOrder'],
  methods: {
    async getRegister() {
      this.checkPhoneNumber()
      if (!this.isValidEmail) {
        return alert('Email is not valid')
      }
      if (!this.isValidPassword) {
        return alert(
          'Password must be contain digits, letters, symbols (min 8 characters)'
        )
      }
      if (!this.phone) {
        return alert('Phone number is required')
      }
      if (!this.agree) {
        return alert('Please agree with Terms & Condition')
      }

      try {
        this.loading = true
        const data = {
          email: this.email.trim(),
          password: this.password.trim(),
          phoneNumber: this.phone
        }
        await this.$store.dispatch('register', data)
        if (this.token) {
          await this.$store.dispatch('getUser', this.token)
          this.isOrder
            ? this.$router.push('/bucket')
            : this.$router.push('/home')
        }
      } catch (e) {
        alert(e.response.data[0])
      } finally {
        this.loading = false
      }
    },
    checkPhoneNumber() {
      this.phone = this.phone.replace(/\D/g, '')
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

  .checkbox {
    display: flex;
    align-items: center;

    button {
      justify-self: center;
      outline: none;
      //background: #DCDFE1;
      background: $color-light-red;
      border: 1px solid #dcdfe1;
      height: 22px;
      width: 22px;
      position: relative;
      border-radius: 3px;
      margin: 0 10px;

      &.active {
        background: #dcdfe1;
      }

      img {
        z-index: 1000;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(1.5);
      }
    }

    span {
      @include fontMontserrat(14px, 400, 28px);
      color: #fff;

      a {
        text-decoration: none;
        //color: #fff;
      }
    }
  }

  .inputs-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 2rem;
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

  .v-messages__message {
    color: #fff !important;

  }
}
</style>
<style lang="scss">
.login-container {
  .v-messages__message {
    line-height: 20px;
  }

  .error--text {
    color: #fff !important;
    font-size: 0.85rem;
  }

  .v-text-field__slot {
    .v-label {
      padding: 4px;
    }
  }
}
</style>
