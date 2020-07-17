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
    filtersNominum: [
      { 'code': '1', 'label': 'filter Nonminum 1' },
      { 'code': '2', 'label': 'filter Nonminum 2' },
      { 'code': '3', 'label': 'filter Nonminum 3' },
      { 'code': '4', 'label': 'filter Nonminum 4' },
      { 'code': '5', 'label': 'filter Nonminum 5' },
      { 'code': '6', 'label': 'filter Nonminum 6' },
      { 'code': '7', 'label': 'filter Nonminum 7' },
      { 'code': '8', 'label': 'filter Nonminum 8' },
      { 'code': '9', 'label': 'filter Nonminum 9' }
    ],
    filtersLocorum: [
      { 'code': '1', 'label': 'filter Locorum 1' },
      { 'code': '2', 'label': 'filter Locorum 2' },
      { 'code': '3', 'label': 'filter Locorum 3' },
      { 'code': '4', 'label': 'filter Locorum 4' },
      { 'code': '5', 'label': 'filter Locorum 5' },
      { 'code': '6', 'label': 'filter Locorum 6' },
      { 'code': '7', 'label': 'filter Locorum 7' },
      { 'code': '8', 'label': 'filter Locorum 8' },
      { 'code': '9', 'label': 'filter Locorum 9' }
    ],
    filtersOperum: [
      { 'code': '1', 'label': 'filter Operum 1' },
      { 'code': '2', 'label': 'filter Operum 2' },
      { 'code': '3', 'label': 'filter Operum 3' },
      { 'code': '4', 'label': 'filter Operum 4' },
      { 'code': '5', 'label': 'filter Operum 5' },
      { 'code': '6', 'label': 'filter Operum 6' },
      { 'code': '7', 'label': 'filter Operum 7' },
      { 'code': '8', 'label': 'filter Operum 8' },
      { 'code': '9', 'label': 'filter Operum 9' }
    ],
    filtersNominumValue: [],
    filtersLocorumValue: [],
    filtersOperumValue: [],
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
    },
    setFiltersNominumValue (state, value) {
      state.filtersNominumValue = value
    },
    setFiltersLocorumValue (state, value) {
      state.filtersLocorumValue = value
    },
    setFiltersOperumValue (state, value) {
      state.filtersOperumValue = value
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
    },
    setSearchFiltersValue ({ dispatch, commit, state }, filters) {
      console.log('setSearchFiltersValue', filters)
      switch (filters.index) {
        case 'nominum':
          commit('setFiltersNominumValue', filters.value)
          break
        case 'locorum':
          commit('setFiltersLocorumValue', filters.value)
          break
        case 'operum':
          commit('setFiltersOperumValue', filters.value)
          break
      }
    }
  }
}
