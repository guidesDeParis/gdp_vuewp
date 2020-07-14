import { REST } from 'api/rest-axios'

export default {
  namespaced: true,

  // initial state
  state: {
    // items: [],
    authors: [],
    editionslist: [],
    editionsbyuuid: {}
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
    },
    setEditionsByUUID (state, editionlist) {
      for (var i = 0; i < editionlist.length; i++) {
        for (var j = 0; j < editionlist[i].editions.content.length; j++) {
          state.editionsbyuuid[editionlist[i].editions.content[j].uuid] = editionlist[i].editions.content[j]
        }
      }
      console.log('corpus editionsbyuuid', state.editionsbyuuid)
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
            // let authorsUuids = []
            // for (let author of data.content) {
            //   authorsUuids.push(author.uuid)
            // }
            dispatch('getEditionsList', data.content)
              .then((editionslist) => {
                console.log('all texts returned: editionslist', editionslist)
                commit('setEditionslist', editionslist)
                commit('setEditionsByUUID', editionslist)
              })
          })
      })
    },
    // get authors
    getAuthors ({ dispatch, commit, state }) {
      return REST.get(`${window.apipath}/corpus`, {})
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
    getEditionsList ({ dispatch, commit, state }, authors) {
      return Promise.all(authors.map(function (author) {
        return REST.get(`${window.apipath}/corpus/` + author.uuid, {})
          .then(({ data }) => {
            console.log('corpus getEditionsList REST: author, data', author, data)
            // work arround
            if (!Array.isArray(data.content)) {
              data.content = [data.content]
            }
            return {
              author: author,
              editions: data
            }
          })
          .catch((error) => {
            console.warn('Issue with getEditionsList', error)
            Promise.reject(error)
          })
      }))
    }
  }
}
