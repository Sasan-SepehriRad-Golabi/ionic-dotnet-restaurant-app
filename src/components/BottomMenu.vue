<template>
  <div>
    <transition name="filter-bot">
      <div v-if="!isActiveFilter && !hideBottomMenu" class="menu-container">
        <div class="icon-wrapper flex-row">
          <span @click="pushRoute('Home')">
            <img class="Home" :src="getHomeIcon" alt="" />
          </span>
          <span @click="pushRoute('Bucket')" class="bucket-span" :data-count="getNewOrderDishesCount">
            <img :class="{ addToBasket: addNew }" class="Bucket" :src="getBucketIcon" alt="" />
          </span>
          <span @click="pushRoute('Profile')">
            <img class="Profile" :src="getProfileIcon" alt="" />
          </span>
          <span @click="pushRoute('MainSettings')">
            <img class="Settings" :src="getSettingsIcon" alt="" />
          </span>
        </div>

        <img class="menu-bckg " src="../assets/bottomMenu.svg" alt="" />
        <img height="55px" width="55px" @click="openFilter()" class="filter-btn centered"
          src="../assets/icons/newFilterIcon.svg" alt="" />
        <img v-if="!showGuid" height="55px" width="55px" style="bottom:95px;" class="filter-btn centered blink"
          src="../assets/icons/taphere-down.png" alt="" />
      </div>
    </transition>

    <transition name="filter">
      <FilterMenu :class="{ fade: this.filterClose }" @close="closeFilter" class="filter-menu" v-if="isActiveFilter">
      </FilterMenu>
    </transition>
  </div>
</template>

<script>
import home from "../assets/icons/iconHome.svg";
import homeActive from "../assets/icons/activeHome.svg";
import bucket from "../assets/icons/iconNewBucket.svg";
import bucketActive from "../assets/icons/activeNewBucket.svg";
import profile from "../assets/icons/iconProfile.svg";
import profileActive from "../assets/icons/activeProfile.svg";
import settings from "../assets/icons/iconSettings.svg";
import settingsActive from "../assets/icons/activeSettings.svg";

import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "BottomMenu",
  components: {
    FilterMenu: () => import("./FilterMenu.vue"),
  },
  data() {
    return {
      isActiveFilter: false,
      filterClose: false,
      addNew: false
    };
  },
  computed: {
    getCurrentRoute() {
      return this.$route.name;
    },
    getSettingsIcon() {
      return this.getCurrentRoute === "MainSettings" ||
        this.getCurrentRoute === "Settings" ||
        this.getCurrentRoute === "CardMenu"
        ? settingsActive
        : settings;
    },
    getBucketIcon() {
      return this.getCurrentRoute === "Bucket" ? bucketActive : bucket;
    },
    getProfileIcon() {
      return this.getCurrentRoute === "Profile" ? profileActive : profile;
    },
    getHomeIcon() {
      return this.getCurrentRoute === "Home" ? homeActive : home;
    },
    ...mapGetters(["getNewOrderDishesCount"]),
    ...mapState(["hideBottomMenu", "isFirstlyHitFilter"]),
    showGuid() {
      console.log("lllll");
      console.log(this.$store.state.isFirstlyHitFilter);
      return this.$store.state.isFirstlyHitFilter
    }
  },
  watch: {
    isFirstlyHitFilter(newVal) {
      console.log("ffff")
      this.showGuid = newVal
    }
  },
  methods: {
    ...mapMutations("filterModule", ["setFilter"]),
    openFilter() {
      this.setFilter(true);
      this.$store.commit("setFirstlyHitFilter", true);
      if (!this.isActiveFilter) {
        this.pushRoute("Home");
        setTimeout(() => {
          this.isActiveFilter = true;
        }, 200);
      }
    },
    closeFilter() {
      this.setFilter(false);
      setTimeout(() => {
        this.filterClose = true;
        setTimeout(() => {
          this.isActiveFilter = false;
          setTimeout(() => {
            this.filterClose = false;
          }, 1000);
        }, 200);
        this.pushRoute("Home");
      }, 500);
    },
    pushRoute(name) {
      if (this.getCurrentRoute !== name) {
        this.$router.push({ name });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/variables.scss";

.menu-container {
  position: relative;
  z-index: 9999;
  height: 30px;

  .menu-bckg {
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .blink {
    animation-name: blink-animation;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: 5;
  }

  @keyframes blink-animation {
    0% {
      opacity: 0;
    }

    50% {
      opacity: .5;
    }

    100% {
      opacity: 1;
    }
  }

  .filter-btn {
    position: absolute;
    bottom: 55px;
  }

  .icon-wrapper {
    justify-content: space-around;
    position: absolute;
    width: 100%;
    bottom: 10px;
    z-index: 100;

    span {
      height: 35px;
      width: 35px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.bucket-span {
        position: relative;
        text-align: center;

        &:after {
          @include fontMontserrat(14px, 400, 20px);
          content: attr(data-count);
          position: absolute;
          color: #d55951;
          top: 1px;
          right: 2px;
          width: 20px;
          height: 20px;
        }
      }
    }

    img {
      height: 25px;
      width: 100%;
    }

    .addToBasket {
      animation: add-to-basket 0.4s linear forwards;
      transform: scale(1);
    }

    @keyframes add-to-basket {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.4);
      }

      100% {
        transform: scale(1);
      }
    }
  }
}

.filter-menu {
  z-index: 9999999;
  position: absolute;
  bottom: 20px;
  width: 100%;
  left: -28%;
}

.fade {
  animation: fadeOut 0.7s forwards ease-in-out;
}
</style>
