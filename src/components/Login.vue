<template>
  <div class="login-container">
    <div class="inputs-block">
      <v-text-field label="Email" dark v-model="email"></v-text-field>
      <v-text-field label="Password" dark v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
    </div>
    <div class="btn-block">
      <div @click="routeTo">
        <DefaultButton class="login mt-5">
          {{ loading ? "" : "Log In" }}
          <BaseLoader v-if="loading" />
        </DefaultButton>
      </div>
      <p @click="forgotPassword">Forgot password?</p>
    </div>
  </div>
</template>

<script>
import DefaultButton from "./buttons/DefaultButton";
import { mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loading: false,
    };
  },
  components: {
    DefaultButton,
  },
  computed: mapState(["token"]),
  props: ["isOrder"],
  methods: {
    async routeTo() {
      if (this.email && this.password) {
        this.loading = true;
        let data = {
          email: this.email.trim(),
          password: this.password.trim(),
        };
        await this.$store.dispatch("login", data);
        this.loading = false;
        let token = this.$store.state.token
        console.log("3333")
        console.log(this.token)
        if (this.token) {
          this.$store.commit('setUser', data)
          await this.$store.dispatch("getUser", this.token);
          this.isOrder
            ? this.$router.push("/bucket")
            : this.$router.push("/home");
          await this.$store.dispatch("registerFCMToken", this.token);
        } else {
          this.loading = false;
          alert(
            "Your email or password is not correct. Please try again."
          );
        }
      } else {
        alert("Please insert email and password");
      }
    },
    forgotPassword() {
      this.$emit("forgotPassword");
    },
  },
};
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

    .login {
      margin-top: 20px;
    }
  }
}
</style>
