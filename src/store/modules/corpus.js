import { REST } from 'api/rest-axios'

export default {
  namespaced: true,

  // initial state
  state: {
    items: []
  },

  // getters
  getters: {},

  // mutations
  mutations: {
    setItems (state, content) {
      state.items = state.items.concat(content)
    }
  },

  // actions
  actions: {
    getItems ({ dispatch, commit, state }) {
      return REST.get(`/corpus`, {})
        .then(({ data }) => {
          console.log('corpus REST: data', data)
          commit('setItems', data.content)
        })
        .catch((error) => {
          console.warn('Issue with corpus', error)
          Promise.reject(error)
        })
    }
  }
}
