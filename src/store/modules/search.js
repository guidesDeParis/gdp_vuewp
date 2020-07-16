import { REST } from 'api/rest-axios'
import qs from 'querystring'

export default {
  namespaced: true,

  // initial state
  state: {
    keys: '',
    searchTypeOptions: [
      { 'code': 'text', 'label': 'Dans les textes' },
      { 'code': 'persons', 'label': 'Dans les personnes' },
      { 'code': 'places', 'label': 'Dans les lieux' },
      { 'code': 'objects', 'label': 'Dans les objets' }
    ],
    searchTypeValue: { 'code': 'text', 'label': 'Dans les textes' },
    results: [],
    isloading: false,
    opened: false
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
    },
    setIsloading (state, isloading) {
      state.isloading = isloading
    },
    setOpened (state, opened) {
      state.opened = opened
    },
    setSearchTypeValue (state, value) {
      state.searchTypeValue = value
    }
  },

  // actions
  actions: {
    getResults ({ dispatch, commit, state }) {
      console.log('getResults', state.keys)
      commit('setIsloading', true)
      let params = {
        search: state.keys
      }
      if (state.searchTypeValue.code !== 'text') {
        params.type = state.searchTypeValue.code
      }

      // console.log('Search getResults params', params);
      let q = qs.stringify(params)
      return REST.get(`${window.apipath}/search?` + q)
        .then(({ data }) => {
          console.log('search REST: data', data)
          commit('setIsloading', false)
          commit('setOpened', true)
          commit('setResults', data.content)
        })
        .catch((error) => {
          console.warn('Issue with search', error)
          commit('setIsloading', false)
          Promise.reject(error)
        })
    },
    setSearchTypeValue ({ dispatch, commit, state }, value) {
      commit('setSearchTypeValue', value)
    }
  }
}
