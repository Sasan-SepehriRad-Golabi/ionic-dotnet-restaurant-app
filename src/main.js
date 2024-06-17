import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ionic from '@ionic/vue'
import Vue2TouchEvents from 'vue2-touch-events'
import * as VueGoogleMaps from 'vue2-google-maps'
import vuetify from './plugins/vuetify'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
const requireComponent = require.context(
  './components/base',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})
Vue.config.productionTip = false
Vue.config.ignoredElements = [/^ion-/]
Vue.use(Ionic)
Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400
})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCHVz0YOfasjE_-HZZ6bB7ZTsn6kuWbmAU',
    libraries: 'places'
  }
})
Vue.component('gmap-cluster', VueGoogleMaps.Cluster)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
