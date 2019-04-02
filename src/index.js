import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import store from './store'
import App from './App'
import 'assets/css/app.styl'

Vue.use(Vuex)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
