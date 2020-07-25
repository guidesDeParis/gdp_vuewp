// import axios from 'axios'

import { REST } from 'api/rest-axios'
import qs from 'querystring'

// const _CancelToken = axios.CancelToken
// const _cancelTokenSource = _CancelToken.source()
// let _cancel

export default {
  namespaced: true,
  testconst: 'Hello',

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
    sortOptions: [
      { code: 'date', label: 'date' },
      { code: 'score', label: 'pertinence' },
      { code: 'size', label: 'nombre de mots' }
    ],
    sorting: null,
    results: [],
    resultsQuantity: null,
    isloading: false,
    // infiniteLoadingIsLoading: false,
    // infiniteLoadingCancelToken: null,
    // infiniteLoadingCancelTokenSource: null,
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
    },
    setSorting (state, sort) {
      console.log('setSorting', sort)
      state.sorting = sort
    }
  },

  // actions
  actions: {
    getResults ({ dispatch, commit, state }, $infiniteLoadingState = null) {
      console.log('getResults', state.keys, $infiniteLoadingState)
      // reset results on new search
      if (!$infiniteLoadingState) {
        commit('setIsloading', true)
      }
      // else {
      //   state.infiniteLoadingIsLoading = true
      // }

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
      if (state.sorting) {
        params.sort = state.sorting.code
      }
      // console.log('Search getResults params', params);
      let q = qs.stringify(params)

      let ops = {}
      // if ($infiniteLoadingState) {
      //   ops.cancelToken = new _CancelToken(function executor (c) {
      //     _cancel = c
      //   })
      // }
      return REST.get(`${window.apipath}/search?` + q, ops)
        .then(({ data }) => {
          console.log('search REST: data', data.meta.quantity.quantity, state.offset + state.limit, data)
          commit('setResultsCount', data.meta.quantity)
          commit('setFilters', data.meta.filters)
          if ($infiniteLoadingState) {
            if (state.isLoading) {
              // we are in a new search or an update so we dont apply the infinite loading received results
              $infiniteLoadingState.complete()
            } else {
              commit('setResults', data.content)
              if (state.offset + state.limit > data.meta.quantity.quantity) {
                console.log('Search infinite completed')
                // tell to vue-infinite-loading plugin that there si no new page
                $infiniteLoadingState.complete()
              } else {
                console.log('Search infinite loaded')
                // tell to vue-infinite-loading plugin that newpage is loaded
                $infiniteLoadingState.loaded()
              }
              // state.infiniteLoadingIsLoading = false
            }
          } else {
            commit('resetResults')
            commit('setIsloading', false)
            commit('setOpened', true)
            commit('setResults', data.content)
          }
        })
        .catch((error) => {
          console.warn('Issue with search', error)
          commit('setIsloading', false)
          // if (axios.isCancel(error)) {
          //   console.log('Request canceled', error.message)
          //   if ($infiniteLoadingState) {
          //     $infiniteLoadingState.complete()
          //   }
          // } else {
          Promise.reject(error)
          if ($infiniteLoadingState) {
            $infiniteLoadingState.error()
          }
          // }
        })
    },
    newSearch ({ dispatch, commit, state }) {
      // commit('resetResults')
      commit('resetActiveFilters')
      // if (_cancel) {
      //   _cancel('new search fired')
      // }
      dispatch('getResults')
    },
    updateSearch ({ dispatch, commit, state }) {
      // TODO: wait for new results came to reset results list
      // TODO: indicate loading state
      // commit('resetResults')
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
    }
    // setSearchActiveFilters ({ dispatch, commit, state }, filters) {
    //   // console.log('setSearchFiltersValue', filters)
    //   commit('setActiveFilters', filters)
    //   dispatch('updateSearch')
    // }
  }
}
