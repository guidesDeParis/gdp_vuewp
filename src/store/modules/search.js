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
    filters: { persons: [], places: [], objects: [] },
    activeFilters: { persons: [], places: [], objects: [] },
    results: [],
    resultsCount: '',
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
    setResultsCount (state, quantity) {
      state.resultsCount = `${quantity.quantity} ${quantity.unit}`
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
    setFilters (state, filters) {
      for (let index in filters) {
        if (filters.hasOwnProperty(index)) {
          console.log('index', index)
          if (filters[index]) {
            if (Array.isArray(filters[index])) {
              state.filters[index] = []
              for (var i = 0; i < filters[index].length; i++) {
                if (filters[index][i].uuid && filters[index][i].title) {
                  state.filters[index].push({
                    code: filters[index][i].uuid,
                    label: filters[index][i].title
                  })
                }
              }
            } else {
              if (filters[index].uuid && filters[index].title) {
                state.filters[index] = [{
                  code: filters[index].uuid,
                  label: filters[index].title
                }]
              }
            }
          } else {
            state.filters[index] = []
          }
        }
      }
      console.log('filters', state.filters)
    },
    setActiveFilters (state, filters) {
      // console.log('setActiveFilters', filters)
      state.activeFilters[filters.index] = filters.value
      // console.log('state.activeFilters', state.activeFilters)
    },
    resetFiltersValues (state) {
      for (var index of ['persons', 'places', 'objects']) {
        state.activeFilters[index] = []
      }
    }
  },

  // actions
  actions: {
    getResults ({ dispatch, commit, state }) {
      console.log('getResults', state.keys)
      commit('setIsloading', true)
      let params = {
        search: `${state.keys}`,
        start: 1,
        count: 30
      }
      if (state.searchTypeValue.code !== 'text') {
        params.type = state.searchTypeValue.code
      }
      // if ()
      // console.log('Search getResults params', params);
      let q = qs.stringify(params)
      return REST.get(`${window.apipath}/search?` + q)
        .then(({ data }) => {
          console.log('search REST: data', data)
          commit('setIsloading', false)
          commit('setOpened', true)
          commit('setResults', data.content)
          commit('setResultsCount', data.meta.quantity)
          commit('setFilters', data.meta.filters)
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
      // console.log('setSearchFiltersValue', filters)
      commit('setActiveFilters', filters)
    }
  }
}
