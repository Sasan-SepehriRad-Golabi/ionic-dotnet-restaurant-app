<template>
  <ion-page class="auth">
    <ion-content>
      <div class="wrapper">
        <div class="to-back-block" :class="{ iphone: getIsPhone }" @click="routerAction">
          <img class="to-back" src="../assets/toBackWhite.svg" alt="" />
        </div>
        <div class="logo" :class="{ welcome: currentScreen === 'welcome' }">
          <img src="../assets/logo-welcome.svg" alt="" />
          <p>Ruddy</p>
        </div>
        <component :is="currentScreen" :isOrder="isOrder" @emitAction="btnAction($event)"
          @forgotPassword="btnAction('ForgotPassword')" class="auth-block"></component>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import authModule from "@/store/modules/authModule";
import { mapState } from 'vuex'
export default {
  name: "Auth",
  data() {
    return {
      currentScreen: "welcome",
      textBlock: false,
    };
  },
  computed: {
    ...mapState(['token']),
  },
  props: ["isOrder"],
  components: {
    Login: () => import("../components/Login"),
    Registration: () => import("../components/Registration"),
    Welcome: () => import("../components/Welcome"),
    ForgotPassword: () => import("../components/ForgotPassword"),
  },
  computed: {
    getIsPhone() {
      return this.$store.state.iphone;
    },
  },
  mounted() {
    this.$store.registerModule("authModule", authModule);
  },
  methods: {
    btnAction(val) {
      this.currentScreen = val;
    },
    routerAction() {
      if (this.currentScreen !== "welcome") {
        this.currentScreen = "welcome";
      } else if (this.token) { this.$router.push({ name: "Profile" }) }
      else {
        this.$router.push({ name: "Home" })
      };
    },
  },
  beforeDestroy() {
    this.$store.unregisterModule("authModule");
  },
};
</script>

<style lang="scss" scoped>
.auth {
  background: $color-light-red;
}

ion-toolbar {
  width: 100vw;
  height: 30px;
  background: $color-light-red;
}

.wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: $color-light-red;
  margin: 0;
  display: flex;
  flex-direction: column;

  .to-back-block {
    position: fixed;
    top: 40px;
    left: 30px;
    width: 30px;
    height: 30px;

    &.iphone {
      top: 60px;
    }
  }

  .logo {
    //height: 35vh;
    margin: 40px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    p {
      padding-top: 10px;
      @include fontMontserrat(18px, bold, 28px);
      color: white;
      //z-index: 10;
    }
  }

  .auth-block {
    position: absolute;
    top: 60%;
    width: 100vw;
    transform: translateY(-50%);
  }

  .welcome {
    height: 40vh;
  }
}

@media screen and (max-height: 667px) {
  .logo-bckg {
    max-width: 200px !important;
    top: 50px !important;
  }

  .logo-icon {
    max-width: 100px !important;
    top: 80px !important;
  }

  .text-block {
    top: 220px !important;
  }
}
</style>
