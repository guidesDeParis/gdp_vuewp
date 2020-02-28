import { REST } from 'api/rest-axios'

export default {
  namespaced: true,

  // initial state
  state: {
    // items: [],
    authors: [],
    editionslist: []
  },

  // getters
  getters: {},

  // mutations
  mutations: {
    setAuthors (state, authors) {
      state.authors = authors
    },
    setEditionslist (state, editionslist) {
      state.editionslist = editionslist
    }
  },

  // actions
  actions: {
    getCorpuses ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        // get the list of corpuses (aka authors)
        dispatch('getAuthors')
          .then(({ data }) => {
            console.log('getCorpuses authors data', data)
            commit('setAuthors', data.content)
            // get the texts list for each corpus (aka author)
            let authorsUuids = []
            for (let author of data.content) {
              authorsUuids.push(author.uuid)
            }
            dispatch('getEditionsList', authorsUuids)
              .then((editionslist) => {
                console.log('all texts returned: editionslist', editionslist)
                commit('setEditionslist', editionslist)
              })
          })
      })
    },
    // get authors
    getAuthors ({ dispatch, commit, state }) {
      return REST.get(`/corpus`, {})
        // .then(({ data }) => {
        //   console.log('corpus getAuthors REST: data', data)
        //   commit('setAuthors', data.content)
        // })
        .catch((error) => {
          console.warn('Issue with getAuthors', error)
          Promise.reject(error)
        })
    },
    // get editionslist
    getEditionsList ({ dispatch, commit, state }, authorsUuids) {
      return Promise.all(authorsUuids.map(function (uuid) {
        return REST.get(`/corpus/` + uuid, {})
          .then(({ data }) => {
            console.log('corpus getEditionsList REST: data', data)
            // work arround
            if (!Array.isArray(data.content)) {
              data.content = [data.content]
            }
            return data
          })
          .catch((error) => {
            console.warn('Issue with getEditionsList', error)
            Promise.reject(error)
          })
      }))
    }
  }
}
