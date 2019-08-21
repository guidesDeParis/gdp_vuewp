import Vue from 'vue'
import Vuex from 'vuex'

import Corpus from './modules/corpus'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    Corpus
    // search
  }
})
