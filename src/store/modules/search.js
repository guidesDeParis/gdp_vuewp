import axios from 'axios'

import { REST } from 'api/rest-axios'
import qs from 'querystring'

const _filterskeys = ['persons', 'places', 'objects', 'texts']
const _CancelToken = axios.CancelToken
// const _cancelTokenSource = _CancelToken.source()
let _cancelTokens = []

export default {
  namespaced: true,
  testconst: 'Hello',

  // initial state
  state: {
    keys: '',
    searchedKeys: '',
    searchTypeOptions: [
      { 'code': 'text', 'label': 'Dans les textes' },
      { 'code': 'persons', 'label': 'Dans les personnes' },
      { 'code': 'places', 'label': 'Dans les lieux' },
      { 'code': 'objects', 'label': 'Dans les objets' }
    ],
    searchTypeValue: { 'code': 'text', 'label': 'Dans les textes' },
    filters: { persons: [], places: [], objects: [], texts: [] },
    activeFilters: { persons: [], places: [], objects: [], texts: [] },
    sortOptions: [
      { code: 'date', label: 'date' },
      { code: 'score', label: 'pertinence' },
      { code: 'size', label: 'nombre de mots' }
    ],
    sorting: null,
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
    setSearchKeys (state) {
      state.searchedKeys = state.keys
    },
    setResults (state, content) {
      state.results = state.results.concat(content)
    },
    resetResults (state) {
      console.log('resetResults')
      state.results = []
    },
    resetOffset (state) {
      state.offset = 0
    },
    setResultsCount (state, quantity) {
      state.resultsQuantity = quantity
    },
    incrementOffset (state) {
      state.offset += state.limit
    },
    setIsloading (state, isloading) {
      console.log('setIsloading', isloading)
      state.isloading = isloading
    },
    setOpened (state, opened) {
      state.opened = opened
    },
    setSearchTypeValue (state, value) {
      state.searchTypeValue = value
    },
    setFilters (state, filters) {
      for (let filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          console.log('filter', filter)
          if (filters[filter]) {
            if (Array.isArray(filters[filter])) {
              state.filters[filter] = []
              for (var i = 0; i < filters[filter].length; i++) {
                if (filters[filter][i].uuid && filters[filter][i].title) {
                  state.filters[filter].push({
                    code: filters[filter][i].uuid,
                    label: filters[filter][i].title
                  })
                }
              }
            } else {
              if (filters[filter].uuid && filters[filter].title) {
                state.filters[filter] = [{
                  code: filters[filter].uuid,
                  label: filters[filter].title
                }]
              }
            }
          } else {
            state.filters[filter] = []
          }
        }
      }
      console.log('filters', state.filters)
    },
    setActiveFilters (state, filters) {
      // console.log('setActiveFilters', filters)
      state.activeFilters[filters.filter] = filters.value
      // console.log('state.activeFilters', state.activeFilters)
    },
    resetActiveFilters (state) {
      for (var index of _filterskeys) {
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
    getResults ({ dispatch, commit, state }, pl) {
      console.log(`getResults keys: ${pl.keys}, infiniteLoading:`, pl.infiniteLoading)

      if (!pl.infiniteLoading) {
        // loading indicator unless we are on infiniteloading
        commit('setIsloading', true)
        commit('resetOffset')
        // cancel infiniteloading requests
        _cancelTokens.forEach((ct, i) => {
          console.log('_cancelTokens forEach ct', ct)
          ct.cancel('new or updated search fired')
        })
      }

      // construct params
      let params = {
        search: `${pl.keys}`,
        start: state.offset,
        count: state.limit
      }
      if (state.searchTypeValue.code !== 'text') {
        params.type = state.searchTypeValue.code
      }
      let f
      for (var filter of _filterskeys) {
        // console.log(`state.activeFilters[${filter}]`, state.activeFilters[filter])
        if (state.activeFilters[filter].length) {
          f = filter === 'texts' ? 'text' : `filter${filter.charAt(0).toUpperCase()}${filter.slice(1)}`
          params[f] = []
          for (var i = 0; i < state.activeFilters[filter].length; i++) {
            params[f].push(state.activeFilters[filter][i].code)
          }
        }
      }
      if (state.sorting) {
        params.sort = state.sorting.code
      }
      console.log('Search getResults params', params)
      let q = qs.stringify(params)

      // construct options
      let ops = {}
      if (pl.infiniteLoading) {
        ops.cancelToken = pl.infiniteLoading.cancelToken
      }

      return REST.get(`${window.apipath}/search?` + q, ops)
        .then(({ data }) => {
          console.log(`search REST quantity: ${data.meta.quantity.quantity}, offset+limit: ${state.offset + state.limit}, data:`, data)
          commit('setResultsCount', data.meta.quantity)
          commit('setFilters', data.meta.filters)

          if (state.isloading) {
            // a new or updated search has been launched :
            // we dont apply the infinite loading received results
            // and we reset the infinite loader
            // pl.infiniteLoading.$state.reset()
            _cancelTokens.forEach((ct, i) => {
              console.log('_cancelTokens forEach AFTER ct', ct)
              ct.cancel('new or updated search fired')
              ct.$state.complete()
            })
            _cancelTokens = []
          }

          if (!pl.infiniteLoading) {
            // we are not on infiniteloading
            // new or updated search
            commit('resetResults')
            commit('setSearchKeys')
            commit('setResults', data.content)
            commit('setIsloading', false)
            commit('setOpened', true)
          } else {
            // we are on infiniteloading
            // normal InfiniteLoading procedure
            commit('setResults', data.content)
            if (state.offset + state.limit > data.meta.quantity.quantity) {
              // tell to vue-infinite-loading plugin that there is no new page
              pl.infiniteLoading.$state.complete()
            } else {
              // tell to vue-infinite-loading plugin that newpage is loaded
              pl.infiniteLoading.$state.loaded()
            }
          }
        })
        .catch((error) => {
          // console.warn('Issue with search', error)
          if (axios.isCancel(error)) {
            console.info(`Request canceled, message: ${error.message}`)
            // TODO: the $state here is probably not the good one
            // Promise.reject(error)
            // pl.infiniteLoading.$state.reset()
          } else {
            commit('setIsloading', false)
            if (pl.infiniteLoading) {
              pl.infiniteLoading.$state.error()
            }
            Promise.reject(error)
          }
        })
    },
    newSearch ({ dispatch, commit, state }) {
      commit('resetActiveFilters')
      dispatch('getResults', { keys: state.keys })
      // .then((e) => {
      //   console.log('dispatch get results then', e)
      // })
    },
    updateSearch ({ dispatch, commit, state }) {
      dispatch('getResults', { keys: state.searchedKeys })
    },
    nextResultsBatch ({ dispatch, commit, state }, $infiniteLoadingState) {
      console.log(`nextResultsBatch, isloading: ${state.isloading}`, $infiniteLoadingState)
      if (state.isloading) {
        // we are loading a new or updated searche
        // we stop the infinite
        $infiniteLoadingState.complete()
      } else {
        commit('incrementOffset')
        if (state.offset < state.resultsQuantity.quantity) {
          dispatch('getResults', {
            keys: state.searchedKeys,
            infiniteLoading: {
              $state: $infiniteLoadingState,
              cancelToken: new _CancelToken((c) => {
                _cancelTokens.push({
                  cancel: c,
                  $state: $infiniteLoadingState
                })
              })
            }
          })
        } else {
          $infiniteLoadingState.complete()
        }
      }
    }
  }
}
