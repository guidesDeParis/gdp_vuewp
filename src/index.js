import Vue from 'vue'
import router from './router'
import store from './store'
// import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'
import InfiniteLoading from 'vue-infinite-loading'
import VueScrollTo from 'vue-scrollto'
import VueSelect from 'vue-select'
import Vue2TouchEvents from 'vue2-touch-events'
import VueClipboard from 'vue-clipboard2'
import VueSweetalert2 from 'vue-sweetalert2'

import App from './App'

import 'assets/css/mdi/css/materialdesignicons.css'
// import 'mdi/font'
import 'vue-select/src/scss/vue-select.scss'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@sweetalert2/themes/dark/dark.scss'

import 'assets/css/app.scss'

Vue.use(Meta)
Vue.use(InfiniteLoading, {
  props: {
    spinner: 'spiral'
  },
  slots: {
    noMore: '',
    noResults: '',
    error: ''
  }
  // system: {
  //   throttleLimit: 50,
  //   /* other settings need to configure */
  // }
})
Vue.use(VueScrollTo)
Vue.component('v-select', VueSelect)
Vue.use(Vue2TouchEvents)
Vue.use(VueClipboard)
Vue.use(VueSweetalert2)

// https://apple.stackexchange.com/questions/17077/add-a-hosts-file-entry-without-jailbreaking
// window.apipath = process.env === 'prod' || window.location.hostname === 'dev.gdp.fr' ? `http://${window.location.hostname}/api` : 'http://localhost:8984'
if (process.env === 'prod') {
  window.apipath = `https://api.guidesdeparis.fr`
} else if (window.location.hostname === 'dev.gdp.fr') {
  window.apipath = `http://${window.location.hostname}/api`
} else {
  window.apipath = 'http://localhost:8984'
}
// if (window.location.hostname === 'dev.gdp.fr') {
//   window.apipath = `http://${window.location.hostname}/api`
// }
// window.apipath = `http://${window.location.hostname}:8984`
// sync(store, router) // done. Returns an unsync callback fn

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
