import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

const Auth = () => import('../views/Auth')
const InitialSlider = () => import('../views/InitialSlider')
const Settings = () => import('../views/Settings')
const Profile = () => import('../views/Profile')
const HomePage = () => import('../views/HomePage')
const Bucket = () => import('../views/Bucket')
const RestaurantInfo = () => import('../views/RestaurantInfo')
const CurrentDish = () => import('../views/CurrentDish')
const CardMenu = () => import('@/views/CardMenu')
const MainSettings = () => import('@/views/MainSettings')
const FAQ = () => import('@/views/FAQ')
const AddDiscount = () => import('@/views/AddDiscount')
const AddPaymentMethods = () => import('@/views/AddPaymentMethods')
const PaymentMethods = () => import('@/views/PaymentMethods')
const PaymentResult = () => import('@/views/PaymentResult')

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    props: true
  },
  {
    path: '/paymentmethods',
    name: 'PaymentMethods',
    component: PaymentMethods,
    props: true
  },
  {
    path: '/paymentresult',
    name: 'PaymentResult',
    component: PaymentResult,
    props: true
  },
  {
    path: '/',
    name: 'InitialSlider',
    component: InitialSlider,
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/main-settings',
    name: 'MainSettings',
    component: MainSettings,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/cardmenu',
    name: 'CardMenu',
    component: CardMenu,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/cardmenu/adddiscount',
    name: 'AddDiscount',
    component: AddDiscount,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/cardmenu/addpaymentmethods',
    name: 'AddPaymentMethods',
    component: AddPaymentMethods,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    props: true,
    beforeEnter(to, from, next) {
      store.state.token
        ? next()
        : next({ name: 'Auth' })
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    props: true
  }, {
    path: '/bucket',
    name: 'Bucket',
    component: Bucket,
    props: true
  }, {
    path: '/restaurant',
    name: 'Restaurant',
    component: RestaurantInfo,
    props: true
  },
  {
    path: '/dish',
    name: 'Dish',
    component: CurrentDish,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  watch: {
    '$route.params.search': {
      handler: function (search) {
        console.log(search)
      },
      deep: true,
      immediate: true
    }
  },
  base: process.env.BASE_URL,
  routes,

})

export default router
