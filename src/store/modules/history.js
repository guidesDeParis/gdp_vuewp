// import { REST } from 'api/rest-axios'
import router from '../../router'

export default {
  namespaced: true,
  router,
  // initial state
  state: {
    items: [],
    opened: false
  },

  // getters
  getters: {},

  // mutations
  mutations: {
    addItem (state, item) {
      state.items.push(item)
    },
    setOpened (state, opened) {
      state.opened = opened
    }
  },

  // actions
  actions: {
    addItem ({ dispatch, commit, state }, item) {
      console.log('history add item', item, router)
      commit('addItem', item)
      commit('setOpened', true)
      router.push({
        name: `editiontext`,
        params: {
          id: item.textId,
          textid: item.uuid
        }
      })
    },
    navigateToItem ({ dispatch, commit, state }, item) {
      console.log('history navigate to item', item, router)
      // commit('addItem', item)
      router.push({
        name: `editiontext`,
        params: {
          id: item.textId,
          textid: item.uuid
        }
      })
    }
  }
}
