import { REST } from 'api/rest-axios'
import router from '../../router'

export default {
  namespaced: true,
  router,
  // initial state
  state: {
    colophon: [],
    colophonHome: []
  },

  // getters
  getters: {},

  // mutations
  mutations: {
    setColophon (state, colophon) {
      state.colophon = colophon
      for (let i = 0; i < colophon.length; i++) {
        if (colophon[i].uuid !== 'schema') {
          state.colophonHome.push(colophon[i])
        }
      }
    }
  },

  // actions
  actions: {
    getColophon ({ dispatch, commit, state }) {
      REST.get(`${window.apipath}/colophon`, {})
        .then(({ data }) => {
          console.log('colophon getColophon REST: data', data)
          // commit('setColophon', data.content)
          dispatch('getPages', data.content.pages)
            .then((pages) => {
              console.log('all pages returned: pages', pages)
              commit('setColophon', pages)
            })
        })
        .catch((error) => {
          console.warn('Issue with getColophon', error)
          Promise.reject(error)
        })
    },
    // async get pages
    getPages ({ dispatch, commit, state }, pages) {
      return Promise.all(pages.map(function (page) {
        return REST.get(`${window.apipath}/colophon/` + page.uuid, {})
          .then(({ data }) => {
            console.log('colophon getPages REST: page, data', page, data)
            // // work arround
            // if (!Array.isArray(data.content)) {
            //   data.content = [data.content]
            // }
            return data.content
          })
          .catch((error) => {
            console.warn('colophon Issue with getPages', error)
            Promise.reject(error)
          })
      }))
    }
  }
}
