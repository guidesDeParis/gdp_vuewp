import Vue from 'vue'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import App from './App'

import 'assets/css/mdi/css/materialdesignicons.css'
// import 'mdi/font'
import 'assets/css/app.scss'

Vue.use(Meta)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
