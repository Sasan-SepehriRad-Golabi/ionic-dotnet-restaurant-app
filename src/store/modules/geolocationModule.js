import {
  Plugins
} from '@capacitor/core';

const { Geolocation } = Plugins;

export default {
  state: {
    currentPosition: {
      lat: 0,
      lng: 0
    },
    center: {
      lat: 0,
      lng: 0
    },
  },
  mutations: {
    setPosition(state, val) {
      state.currentPosition = val
    },
    setCenter(state, val) {
      state.center = val
    },
  },
  actions: {
    async getCurrentPosition({ commit }) {
      let coordinates = {}
      let currPosition = {}
      let center = {}
      try {
        coordinates = await Geolocation.getCurrentPosition();
        await Promise.resolve()
      } catch (e) {
        console.error(e)
        coordinates = {
          coords: {
            latitude: 34.098907,
            longitude: -118.327759
          }
        }
      } finally {
        currPosition = {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude
        }
        center = {
          lat: currPosition.lat,
          lng: currPosition.lng
        }
        commit('setPosition', currPosition)
        commit('setCenter', center)
      }
    }
  },
  getters: {
    getCurrentPosition(s) {
      return s.currentPosition
    },
    getCenter(s) {
      return s.center
    },
  }
}
