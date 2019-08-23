import Vue from 'vue'
import Vuex from 'vuex'

import Corpus from './modules/corpus'
import Search from './modules/search'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    Corpus,
    Search
  }
})
