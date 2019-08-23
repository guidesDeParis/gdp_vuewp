import { REST } from 'api/rest-axios'
import qs from 'querystring'

export default {
  namespaced: true,

  // initial state
  state: {
    keywords: '',
    results: []
  },

  // getters
  getters: {},

  // mutations
  mutations: {
    setResults (state, content) {
      state.results = content
    }
  },

  // actions
  actions: {
    getResults ({ dispatch, commit, state }) {
      let params = {
        search: state.keywords
      }
      // console.log('Search getResults params', params);
      let q = qs.stringify(params)
      return REST.post(`/search?` + q)
        .then(({ data }) => {
          console.log('search REST: data', data)
          // commit('setResults', data.content)
        })
        .catch((error) => {
          console.warn('Issue with search', error)
          Promise.reject(error)
        })
    }
  }
}
