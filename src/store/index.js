import Vue from 'vue'
import Vuex from 'vuex'
import posts from './modules/posts'

// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    posts
  }
})
