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
    resultsQuantity: null,
    isloading: false,
    limit: 10,
    offset: 0,
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
      state.results = state.results.concat(content)
    },
    resetResults (state) {
      state.results = []
      state.offset = 0
    },
    setResultsCount (state, quantity) {
      state.resultsQuantity = quantity
    },
    incrementOffset (state) {
      state.offset += state.limit
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
    resetActiveFilters (state) {
      for (var index of ['persons', 'places', 'objects']) {
        state.activeFilters[index] = []
      }
    }
  },

  // actions
  actions: {
    getResults ({ dispatch, commit, state }, $infiniteLoadingState = null) {
      console.log('getResults', state.keys, $infiniteLoadingState)
      // reset results on new search
      commit('setIsloading', true)
      let params = {
        search: `${state.keys}`,
        start: state.offset,
        count: state.limit
      }
      if (state.searchTypeValue.code !== 'text') {
        params.type = state.searchTypeValue.code
      }
      let f
      for (var index of ['persons', 'places', 'objects']) {
        if (state.activeFilters[index].length) {
          f = `filter${index.charAt(0).toUpperCase()}${index.slice(1)}`
          params[f] = []
          for (var i = 0; i < state.activeFilters[index].length; i++) {
            params[f].push(state.activeFilters[index][i].code)
          }
        }
      }
      // params.filterPersons = ['nomLouisXIII', 'nomChampagnePhilippeDe']
      // console.log('Search getResults params', params);
      let q = qs.stringify(params)
      return REST.get(`${window.apipath}/search?` + q)
        .then(({ data }) => {
          console.log('search REST: data', data.meta.quantity.quantity, state.offset + state.limit, data)
          commit('setIsloading', false)
          commit('setOpened', true)
          commit('setResults', data.content)
          commit('setResultsCount', data.meta.quantity)
          commit('setFilters', data.meta.filters)
          if ($infiniteLoadingState) {
            if (state.offset + state.limit > data.meta.quantity.quantity) {
              console.log('Search infinite completed')
              // tell to vue-infinite-loading plugin that there si no new page
              $infiniteLoadingState.complete()
            } else {
              console.log('Search infinite loaded')
              // tell to vue-infinite-loading plugin that newpage is loaded
              $infiniteLoadingState.loaded()
            }
          }
        })
        .catch((error) => {
          console.warn('Issue with search', error)
          commit('setIsloading', false)
          $infiniteLoadingState.error()
          Promise.reject(error)
        })
    },
    newSearch ({ dispatch, commit, state }) {
      commit('resetResults')
      commit('resetActiveFilters')
      dispatch('getResults')
    },
    filteredSearch ({ dispatch, commit, state }) {
      commit('resetResults')
      dispatch('getResults')
    },
    nextResultsBatch ({ dispatch, commit, state }, $infiniteLoadingState) {
      console.log('nextResultsBatch', $infiniteLoadingState)
      commit('incrementOffset')
      if (state.offset < state.resultsQuantity.quantity) {
        dispatch('getResults', $infiniteLoadingState)
      } else {
        $infiniteLoadingState.complete()
      }
    },
    setSearchTypeValue ({ dispatch, commit, state }, value) {
      commit('setSearchTypeValue', value)
    },
    setSearchActiveFilters ({ dispatch, commit, state }, filters) {
      // console.log('setSearchFiltersValue', filters)
      commit('setActiveFilters', filters)
      dispatch('filteredSearch')
    }
  }
}
