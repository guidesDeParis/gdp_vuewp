import Vue from 'vue'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import App from './App'
import 'assets/css/app.styl'

Vue.use(Meta)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
