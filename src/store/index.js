import Vue from 'vue'
import Vuex from 'vuex'

import Corpus from './modules/corpus'
import Search from './modules/search'
import History from './modules/history'
import Colophon from './modules/colophon'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    Corpus,
    Search,
    History,
    Colophon
  }
})
