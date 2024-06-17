<template>
  <ion-app id="main-container">
    <v-app>
      <transition name="push">
        <v-alert v-if="showNotification" class="notification" prominent tile elevation="3" color="#D55951">
          <camera-component @disable-show-notification="showNotification = false" />
        </v-alert>
      </transition>

      <transition name="push">
        <TopBar :showButton="showButton" v-if="showTopBar" class="top-bar">
          <div class="profile-slot-container" v-if="showTopBar">
            <span v-if="getSettingsIcon" @click="$router.back()" class="arrow-back"
              :style="`top: ${iphone ? '50px' : '20px'}`"></span>
            <div class="flex-row center">
              <ion-avatar class="flex-row prev-ava">
                <img :class="{ 'ava-placeholder': !user.profileImage }" :src="profileImage" />
              </ion-avatar>
              <p>Hi, {{ user.firstName || "User" }}</p>
            </div>
          </div>
        </TopBar>
      </transition>
      <transition name="COMPONENTS" mode="out-in">
        <keep-alive include="HomePage">
          <router-view :style="{
            pointerEvents: `${this['filterModule/filter'] ? 'none' : 'auto'}`,
          }"></router-view>
        </keep-alive>
      </transition>
      <transition name="showingMenu">
        <BottomMenu v-if="!hideShowMenu && !drinks" class="menu" :class="{ iphone }" />
      </transition>
    </v-app>
  </ion-app>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";

import { Plugins } from "@capacitor/core";


// import { FCM } from "@capacitor-community/fcm";

import userAva from "./assets/userAva.svg";

const { App } = Plugins;

// const fcm = new FCM();

export default {
  name: "App",
  data() {
    return {
      hideMenu: false,
      showNotification: false,
    };
  },
  components: {
    BottomMenu: () => import("./components/BottomMenu"),
    TopBar: () => import("./components/TopBar"),
    CameraComponent: () => import("./components/CameraComponent"),
  },
  computed: {
    ...mapGetters("dataModule", ["getActionMessage", "getProfilePhoto"]),
    ...mapState([
      "token",
      "user",
      "drinks",
      "filterModule/filter",
      "iphone",
      "isFirstlyEnter",
    ]),
    profileImage() {
      if (this.user.profileImage) {
        return this.user.profileImage;
      } else return userAva;
    },
    getCurrentRoute() {
      return this.$route.name;
    },
    getSettingsIcon() {
      return (
        this.getCurrentRoute === "Settings" ||
        this.getCurrentRoute === "CardMenu" ||
        this.getCurrentRoute === "FAQ" ||
        this.getCurrentRoute === "AddDiscount" ||
        this.getCurrentRoute === "AddPaymentMethods"
      );
    },
    showTopBar() {
      return (
        this.getCurrentRoute === "Profile" ||
        this.getCurrentRoute === "Settings" ||
        this.getCurrentRoute === "MainSettings" ||
        this.getCurrentRoute === "CardMenu" ||
        this.getCurrentRoute === "FAQ" ||
        this.getCurrentRoute === "AddDiscount" ||
        this.getCurrentRoute === "AddPaymentMethods" ||
        this.getCurrentRoute === "PaymentMethods" ||
        this.getCurrentRoute === "PaymentResult"
      );
    },
    showButton() {
      return (
        this.getCurrentRoute === "Auth" ||
        this.getCurrentRoute === "Home" ||
        this.getCurrentRoute === "Bucket"
      );
    },
    hideShowMenu() {
      return (
        this.getCurrentRoute === "Auth" ||
        this.getCurrentRoute === "InitialSlider" ||
        this.hideMenu
      );
    },
  },
  async created() {
    window.addEventListener("keyboardDidShow", (e) => {
      this.hideMenu = true;
    });
    window.addEventListener("keyboardWillHide", (e) => {
      this.hideMenu = false;
    });

    // await this.pushInit();
  },
  async mounted() {
    if (window.innerHeight > 700) {
      this.setIsPhone(true);
    }
    this.isFirstlyEnter &&
      // !window.location.toString().include("paymentresult") &&
      this.$router.push({ name: "Home" });

    App.addListener("appStateChange", () => this.token && this.getLastOrder());

    if (this.token) {
      console.log(this.token);
      await this.getUser(this.token);
      await this.getLastOrder();
      // await this.registerFCMToken(this.token);
    }
  },
  watch: {
    getActionMessage(val) {
      if (val) {
        this.showNotification = true;
        // setTimeout(() => {
        this.showNotification = false;
        this.setActionMessage(false);
        // }, 3000);
      }
    },
  },
  methods: {
    ...mapActions("dataModule", ["setActionMessage"]),
    ...mapActions(["getUser", "registerFCMToken", "getLastOrder"]),
    ...mapMutations(["setDeviceToken", "setIsPhone"]),
    // async pushInit() {
    //   const vm = this;

    //   // РЕГИСТРАЦИЯ НОТИФИКАЦИЙ
    //   // await PushNotifications.requestPermission().then(async (result) => {
    //   //   if (result.granted) {
    //   //     console.log("register push");
    //   //     // Register with Apple / Google to receive push via APNS/FCM
    //   //     await PushNotifications.register();
    //   //   } else {
    //   //     console.log("error with register");
    //   //     // Show some error
    //   //   }
    //   // });
    //   try {
    //     console.log("lllll");
    //     // const { token } = await fcm.getToken();
    //     console.log(token);
    //     this.setDeviceToken(token);
    //   } catch (e) {
    //     console.log(e);
    //   }

    //   console.log("GUT GETTING TOKEN DEVICE");

    //   // try {
    //   //   // CЛУШАТЕЛЬ ОШИБОК РЕГИСТРАЦИИ
    //   //   PushNotifications.addListener("registrationError", (error) => {
    //   //     alert("Error on registration: " + JSON.stringify(error));
    //   //   });
    //   //   // СЛУШАТЬ ПОЛУЧЕНИЯ УВЕДОМЛЕНИЙ В FOREGROUND
    //   //   PushNotifications.addListener(
    //   //     "pushNotificationReceived",
    //   //     async (notification) => {
    //   //       alert(notification.data.status);
    //   //       if (notification.data.orderId) {
    //   //         let status = "";
    //   //         switch (notification.data.status) {
    //   //           case "PaymentSuccessfull":
    //   //             status = "Your payment is successful";
    //   //             break;
    //   //           case "BeingPrepared":
    //   //             status = "Your order is being prepared";
    //   //             break;
    //   //           case "RuddyForPickup":
    //   //             status = "Your order is Ruddy. Go pick it up ;)";
    //   //             break;
    //   //           case "Success":
    //   //             status =
    //   //               "Enjoy your meal :). Check out your health journal to know more about what you just ate.";
    //   //         }
    //   //         status && alert(status);
    //   //         try {
    //   //           if (this.$router.history.current.name !== "Bucket") {
    //   //             this.$router.push("Bucket");
    //   //           }
    //   //         } catch (err) {
    //   //           console.log("error with redirect to bucket");
    //   //           console.log(err);
    //   //         }
    //   //       }
    //   //       // ПРИ ПОЛУЧЕНИИ, ОБНОВИТЬ ДАННЫЕ
    //   //       if (vm.token) {
    //   //         await this.getLastOrder();
    //   //       }
    //   //     }
    //   //   );
    //   //   // СЛУШАТЬ ПОЛУЧЕНИЯ УВЕДОМЛЕНИЙ В BACKGROUND
    //   //   PushNotifications.addListener(
    //   //     "pushNotificationActionPerformed",
    //   //     async (notification) => {
    //   //       alert(notification.notification.data.status);
    //   //       if (notification.notification.data.orderId) {
    //   //         let status = "";
    //   //         switch (notification.notification.data.status) {
    //   //           case "PaymentSuccessfull":
    //   //             status = "Your payment is successful";
    //   //             break;
    //   //           case "BeingPrepared":
    //   //             status = "Your order is being prepared";
    //   //             break;
    //   //           case "RuddyForPickup":
    //   //             status = "Your order is Ruddy. Go pick it up ;)";
    //   //             break;
    //   //           case "Success":
    //   //             status =
    //   //               "Enjoy your meal :). Check out your health journal to know more about what you just ate.";
    //   //         }
    //   //         status && alert(status);
    //   //         try {
    //   //           if (this.$router.history.current.name !== "Bucket") {
    //   //             this.$router.push("Bucket");
    //   //           }
    //   //         } catch (err) {
    //   //           console.log("error with redirect to bucket");
    //   //           console.log(err);
    //   //         }
    //   //       }
    //   //       // ПРИ ПОЛУЧЕНИИ, ОБНОВИТЬ ДАННЫЕ
    //   //       if (vm.token) {
    //   //         await this.getLastOrder();
    //   //       }
    //   //     }
    //   //   );
    //   // } catch (e) {
    //   //   console.log("ERROR GETTING TOKEN DEVICE");
    //   //   console.log(e);
    //   // }
    // },
  },
};
</script>

<style lang="scss">
@import "./scss/variables.scss";
@import "./scss/animations.scss";

* {
  padding: 0;
  margin: 0;
  font-family: "Montserrat", sans-serif !important;
}

#main-container {
  height: 100vh;
}

.wrapper {
  margin-bottom: 120px;
  margin-top: 60px;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.centered {
  margin-left: 50%;
  transform: translateX(-50%);
}

.menu {
  position: fixed !important;
  z-index: 999 !important;
  bottom: 0 !important;
  width: 100% !important;

  &.iphone {
    padding-bottom: 20px !important;
    background: white;
  }
}

.top-bar {
  position: fixed !important;
  z-index: 997 !important;
  top: 0 !important;
  width: 100% !important;
  //padding-top: 30px;
  box-shadow: 0px 15px 50px -25px rgba(0, 0, 0, 0.1);

  .profile-slot-container {
    padding-top: 30px;
    text-align: center;

    .arrow-back {
      position: fixed;
      display: block;
      //top: 20px;
      left: 20px;
      background: url("./assets/icons/chevron-back-outline.svg") no-repeat center;
      background-size: 35px;
      width: 35px;
      height: 35px;
      z-index: 10;
    }

    p {
      font-weight: 600;
    }

    div {
      justify-content: center;

      .prev-ava {
        background-color: $color-grey;
        height: 38px;
        width: 38px;
        justify-content: center;
        align-items: center;

        .ava-placeholder {
          width: 30px;
          height: 30px;
        }
      }

      p {
        margin: 5px 0 0 10px;
      }
    }

    .center {
      transform: translateY(-35%);
    }
  }
}

.notification {
  position: absolute !important;
  z-index: 999;
  width: 100vw;

  .take-photo-popup {
    width: 100%;
    margin-left: 50%;
    transform: translateX(-50%);

    p,
    h6 {
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      color: white;
      font-weight: 600;
    }

    .take-new-photo-link {
      width: 30px;
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .title-take-photo {
      font-size: 16px;
    }
  }
}

.showingMenu-enter-active {
  animation: slideInDown 0.7s both;
}

.push-enter-active {
  animation: slideInUp 0.5s 0.1s both;
}

.push-leave-active {
  animation: slideInUp 0.5s both reverse;
}

.COMPONENTS-enter-active {
  animation: ANIM_TEST_IN 0.45s ease-out;
}

.COMPONENTS-leave-active {
  animation: ANIM_TEST_OUT 0.45s ease-out;
}

.fadeInZooming-enter-active {
  animation: fadeInZooming 0.5s 0.1s both reverse ease-in-out;
}

.fadeInZooming-leave-active {
  animation: fadeInZooming 0.4s both ease-in-out;
}

.item-inner {
  border: 1px solid #fff;
}
</style>
