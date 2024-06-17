<template>
  <ion-page>
    <ion-content>
      <div class="header">
        <p style="left: 30px">Ruddy</p>
        <p style="right: 30px" @click="routeToNext" :class="{ 'active-btn-txt': isActive }">
          Skip
          <v-icon class="skip-icon" :class="{ 'active-btn-arrow': isActive }">mdi-chevron-right</v-icon>
        </p>
      </div>
      <ion-slides pager="true" :options="slideOpts">
        <ion-slide>
          <img class="first-image" src="../assets/initial/New folder (2)/1.png" alt="" />
          <div class="text-block flex-column first-slide">
            <p style="padding-bottom: 10px">Welcome to Ruddy</p>
            <span>find healthy meals</span>
            <span>everywhere you go</span>
          </div>
        </ion-slide>
        <ion-slide>
          <img src="../assets/initial/New folder (2)/2.png" alt="" />
          <div class="text-block flex-column">
            <p>Here are the restaurants</p>
            <span style="color: white;">dicover the nutrition, diet and</span>
            <span style="color: white;">allergies of their menus</span>
          </div>
        </ion-slide>
        <ion-slide>
          <img src="../assets/initial/New folder (2)/3.png" alt="" />
          <div class="text-block flex-column">
            <p>Use the filter</p>
            <span style="color: white;">to find your ideal meal</span>
          </div>
        </ion-slide>
        <ion-slide>
          <img src="../assets/initial/New folder (2)/4.png" alt="" />
          <div class="text-block flex-column">
            <p>Compare meals</p>
            <span style="color: white;">and choose what's best for you</span>
          </div>
        </ion-slide>
        <ion-slide>
          <img src="../assets/initial/New folder (2)/5.png" alt="" />
          <div class="text-block flex-column">
            <p>Log everything</p>
            <span style="color: white;">fast and easy in your health</span>
            <span style="color: white;">journal</span>
          </div>
        </ion-slide>
        <ion-slide v-touch="{
          left: () => routeToNext(),
        }">
          <div class="text-block flex-column" style="top: 250px">
            <p>We want to help you</p>
            <p>easily control your diet</p>
            <p>when you eat out</p>
          </div>
          <!-- <img src="../assets/initial/logo.png" alt="" style="width: 40%" /> -->
          <div class="text-block flex-column" style="bottom: 180px;color: white;">
            <span>let us know what you think about</span>
            <span>our new app on instagram</span>
            <span>@ruddy.app</span>
          </div>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>
// import { AddToJournal } from '@/service/routes'
// import api from '@/service/api'
import { mapState } from 'vuex'
export default {
  name: "InitialSlider",
  data() {
    return {
      slideOpts: {
        initialSlide: 1,
        speed: 400,
        slideShadows: true,
      },
      isActive: false,
    };
  },
  async created() {
    //   console.log("created");
    //   var res = await api.POST(AddToJournal.checkIfUserSignedIn, { CheckOrNot: 'check' }, this.token);
    //   console.log(res);
    //   if (res.data == "Ok") {
    //     this.$router.push('/home');
    //   }
  },
  async mounted() {
    console.log("mounted");
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    routeToNext() {
      this.isActive = true;
      this.$store.commit("setFirstlyEnter", true);
      setTimeout(() => {
        this.$router.push("/home");
      }, 600);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  z-index: 10;
  position: absolute;
  top: 40px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;

  p {
    @include fontMontserrat(18px, 600, 18px);
    text-transform: uppercase;
    color: #fff;
    text-shadow: none;
    text-align: center;
    position: absolute;
    width: 100px;
  }

  .active-btn-txt {
    transition: all 25s ease-in-out;
    transform: scale(0.9);
  }

  .active-btn-arrow {
    transition: all 0.8s ease-in-out;
    margin-right: -30px;
  }

  .skip-icon {
    color: #ce2b26;
    margin-bottom: 2px;
  }
}

ion-slides {
  height: 100vh;
  background-color: $color-light-red;

  ion-slide {
    position: relative;
    display: flex;

    img {
      width: 80%;
      height: 62vh;
      max-width: 350px;
      max-height: 480px;
      margin-bottom: 60px;
      position: absolute;
    }

    .text-block {
      position: absolute;
      bottom: 50px;

      p {
        @include fontMontserrat(22px, 800, 22px);
        color: #fff;
        text-shadow: 1.5px 1.5px 3px #5e5858;
        margin-bottom: 5px;
      }
    }

    .first-image {
      width: 35%;
    }

    .first-slide {
      bottom: 130px;

      span {
        width: 282px;
        height: 30px;
        @include fontMontserrat(16px, 500, 16px);
        color: #fff;
        text-shadow: 1px 1px 3px #5e5858;
      }
    }
  }
}

.continue-button {
  width: 120px;

  p {
    margin-bottom: -30px;
  }
}
</style>
