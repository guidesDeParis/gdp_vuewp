import { REST } from 'api/rest-axios'
import qs from 'querystring'

export default {
  namespaced: true,

  // initial state
  state: {
    keys: '',
    results: []
  },

  // getters
  getters: {},

  // mutations
  mutations: {
    setKeys (state, keys) {
      state.keys = keys
    },
    setResults (state, content) {
      state.results = content
    }
  },

  // actions
  actions: {
    getResults ({ dispatch, commit, state }) {
      console.log('getResults', state.keys)
      let params = {
        search: state.keys
      }
      // console.log('Search getResults params', params);
      let q = qs.stringify(params)
      return REST.get(`/search?` + q)
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
