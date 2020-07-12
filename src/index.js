import Vue from 'vue'
import router from './router'
import store from './store'
// import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'
import InfiniteLoading from 'vue-infinite-loading'

import App from './App'

import 'assets/css/mdi/css/materialdesignicons.css'
// import 'mdi/font'
import 'assets/css/app.scss'

Vue.use(Meta)

Vue.use(InfiniteLoading, {
  props: {
    spinner: 'spiral'
  },
  slots: {
    noMore: '',
    noResult: ''
  },
  system: {
    throttleLimit: 5000
  }
  // system: {
  //   throttleLimit: 50,
  //   /* other settings need to configure */
  // }
})

// sync(store, router) // done. Returns an unsync callback fn

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
