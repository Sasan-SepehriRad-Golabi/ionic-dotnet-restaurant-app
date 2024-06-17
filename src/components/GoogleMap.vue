<template>
    <div class="all">

        <GmapMap @click.self="$emit('close-all')" :center='getCenterComp' :zoom='15' style="width:100%;height:100vh"
            map-type-id="terrain" :options="{
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                disableDefaultUI: false,
                styles: styles
            }">
            <!-- <gmap-cluster> -->
            <!-- </gmap-cluster>
            <gmap-cluster> -->
            <div v-for="(rest, index) in filteredRestautants">
                <gmapMarker style="display:block !important;position:absolute !important;z-index:10 !important" zIndex: 10
                    :icon="{
                        url: rest.logo || require('../assets/default11.jpg'), size: { width: 28, height: 29, f: 'px', b: 'px' }, scaledSize: {
                            width: 28, height:
                                29, f: 'px', b: 'px',
                        }, anchor: new google.maps.Point(17, 81),
                    }" @click="showInfo(rest)" :position="{ lat: rest.latitude, lng: rest.longitude }">
                </gmapMarker>
                <gmapMarker zIndex: 200,
                    style="position: absolute !important;z-index:200 !important;display: block !important;border-radius: 50% !important;"
                    :icon="{
                        url: require('../assets/icon1.png'),
                    }" @click="showInfo(rest)" :key="index" :position="{ lat: rest.latitude, lng: rest.longitude }">
                </gmapMarker>
            </div>
            <!-- </gmap-cluster> -->
        </GmapMap>
        <base-loader v-if="getPreloadingForRestaurant" class="loader" />
    </div>
</template>
  
<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker';
import { mapGetters } from 'vuex'
import api from '@/service/api'
import { Restaurants } from '@/service/routes'
import { styles } from '@/helpers/mapStyles'
import { gmapApi } from 'vue2-google-maps'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import { format } from 'path';
const BaseLoader = () => import('@/components/base/BaseLoader')
export default {
    name: 'GoogleMap',
    data() {
        return {
            restUrls: [],
            myMarkers: [],
            zoom: 16,
            styles,
            loading: false,
            center: { lat: 34.098907, lng: -118.327759 },
            currentPlace: null,
            markers: [],
            places: [],
        }
    },
    computed: {
        google: gmapApi,
        ...mapGetters(['getRestaurantId', 'isNewOrderInProgress']),
        filteredRestautants() {
            var dd = [...this.restaurants];
            const rr = [];
            for (let i = 0; i < dd.length; i++) {
                if (this.isNewOrderInProgress) {
                    if (this.getRestaurantId === dd[i].id) {
                        rr.push(dd[i]);
                    }
                }
                else {
                    rr.push(dd[i]);
                }
            }
            return rr;
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
                    lat: 34.098907,
                    lng: -118.327759
                }
            }
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
                    lat: 34.098907,
                    lng: -118.327759
                }
            }
        },
        getPreloadingForRestaurant() {
            return this.$store.state.preloadingForRestaurant
        },

    },
    components: {
        GmapCustomMarker,
        GmapCluster,
        BaseLoader
    },
    props: {
        restaurants: {
            type: Array
        }
    },
    async activated() {
        this.zoom = 14
        await this.$store.dispatch('getCurrentPosition').then(() => this.zoom = 16)
    },
    watch: {

    },
    methods: {
        async showInfo(rest) {
            if (!this.getPreloadingForRestaurant) {
                this.$store.commit('setPreloadingForRestaurant', true)
                await api.GET(`${Restaurants.restaurants}/${rest.id}`, this.$store.state.token)
                    .then(res => {
                        rest.menu = res.data
                        this.$store.commit('setRestaurant', rest)
                        this.$emit('showInfo', rest)
                    })
                    .catch(err => {
                        this.$store.commit('setPreloadingForRestaurant', false)
                    })
            }
        },
        setPlace(place) {
            this.currentPlace = place;
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                };
                this.markers.push({ position: marker });
                this.places.push(this.currentPlace);
                this.center = marker;
                this.currentPlace = null;
            }
        },
        geolocate: function () {
            navigator.geolocation.getCurrentPosition(position => {
                // console.log(position.coords.latitude);
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        },
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
</style>