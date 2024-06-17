<template>
  <div class="all">
    <gmap-map @click.self="$emit('close-all')" :center="getCenterComp" :zoom=zoom map-type-id="terrain"
      style="width: 100%; height: 100%" :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUI: false,
        styles: styles
      }">
      <GmapInfoWindow style="display: none" />
      <!--      <cluster>-->
      <div v-for="(rest, index) in filteredRestautants" :key="index">
        <gmap-custom-marker class="mark-rest" :marker="{ lat: rest.latitude, lng: rest.longitude }">
          <img @click="showInfo(rest)" src="../assets/point.svg" alt="">
          <img @click="showInfo(rest)" class="logo" :src="rest.logo || require('../assets/default11.svg')" alt="">
        </gmap-custom-marker>
      </div>
      <!--      </cluster>-->

      <gmap-custom-marker v-if="getCurrentPositionComp"
        :marker="{ lat: getCurrentPositionComp.lat, lng: getCurrentPositionComp.lng }">
        <div class="white-center">
          <span class="center-button"></span>
        </div>
      </gmap-custom-marker>
    </gmap-map>
    <base-loader v-if="getPreloadingForRestaurant" class="loader" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/service/api'
import { Restaurants } from '@/service/routes'
import { styles } from '@/helpers/mapStyles'

const GmapCustomMarker = () => import('vue2-gmap-custom-marker')
const GmapInfoWindow = () => import('vue2-google-maps')
const BaseLoader = () => import('@/components/base/BaseLoader')

export default {
  name: 'Map',
  components: {
    GmapCustomMarker,
    GmapInfoWindow,
    BaseLoader
  },
  props: {
    restaurants: {
      type: Array
    }
  },
  data() {
    return {
      zoom: 16,
      styles,
      loading: false
    }
  },
  async created() {
    await this.$store.dispatch('getCurrentPosition')
  },
  computed: {
    ...mapGetters(['getRestaurantId', 'isNewOrderInProgress']),
    filteredRestautants() {
      return [...this.restaurants].filter(rest => {
        let res = false
        this.isNewOrderInProgress
          ? this.getRestaurantId === rest.id && (res = true)
          : res = true
        return res
      })
    },
    getCenterComp() {
      const lat = this.$store.state.geolocationModule.center.lat
      const lng = this.$store.state.geolocationModule.center.lng
      if (lat && lng) {
        return {
          lat,
          lng
        }
      } else {
        return {
          lat: 50.8476,
          lng: 4.3501
        }
      }
    },
    getCurrentPositionComp() {
      const lat = this.$store.state.geolocationModule.currentPosition.lat
      const lng = this.$store.state.geolocationModule.currentPosition.lng
      if (lat && lng) {
        return {
          lat,
          lng
        }
      } else {
        return {
          lat: 50.8476,
          lng: 4.3501
        }
      }
    },
    getPreloadingForRestaurant() {
      return this.$store.state.preloadingForRestaurant
    }
  },
  methods: {
    async showInfo(rest) {
      if (!this.getPreloadingForRestaurant) {
        this.$store.commit('setPreloadingForRestaurant', true)
        await api.GET(`${Restaurants.restaurants}/${rest.id}`, this.$store.state.token)
          .then(res => {
            rest.menu = res.data
            this.$store.commit('setRestaurant', rest)
            console.log("11111");
            this.$emit('showInfo', rest)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  async activated() {
    this.zoom = 14
    await this.$store.dispatch('getCurrentPosition').then(() => this.zoom = 16)
  }
}
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
}

.white-center {
  width: 25px;
  height: 25px;
  transform: translateY(25px);
  cursor: pointer;
  background: white;
  border-radius: 50%;
  border: 0.5px solid $color-strong-grey;
  //position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-button {
  width: 13px;
  height: 13px;
  background: $color-light-red;
  border-radius: 50%;
  animation: blinking 4s infinite linear;
}

@keyframes blinking {
  from {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1);
  }

  to {
    transform: scale(1.3);
  }
}

.current-location {
  position: fixed;
  width: 50px;
  border-radius: 50%;
  height: 50px;
  right: 10px;
  bottom: 100px;
  background: url(../assets/icons/navigatorIcon_old.svg) no-repeat, white;
  border-bottom: 1px solid $color-strong-grey;
  background-size: 60%;
  background-position: 12px 9px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.loading {
    background: white !important;
  }
}

.mark-rest {
  img {
    z-index: 998;
  }

  .logo {
    position: absolute;
    left: 50%;
    top: 3px;
    transform: translateX(-50%);
    border-radius: 50%;
    height: 38px;
    width: 38px;
  }
}

.mark-center {
  z-index: 1;
  pointer-events: none;
}
</style>
