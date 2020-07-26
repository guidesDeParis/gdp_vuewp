import Vue from 'vue'
import router from './router'
import store from './store'
// import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'
import InfiniteLoading from 'vue-infinite-loading'
import VueScrollTo from 'vue-scrollto'
import VueSelect from 'vue-select'

import App from './App'

import 'assets/css/mdi/css/materialdesignicons.css'
// import 'mdi/font'
import 'vue-select/src/scss/vue-select.scss'
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

window.apipath = process.env === 'prod' ? `http://${window.location.hostname}/api` : 'http://localhost:8984'

// sync(store, router) // done. Returns an unsync callback fn

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
