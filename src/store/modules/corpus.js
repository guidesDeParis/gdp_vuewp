import { REST } from 'api/rest-axios'

export default {
  namespaced: true,

  // initial state
  state: {
    // items: [],
    authors: [],
    editionslist: [],
    editionsbyuuid: {},
    editionsuuids: [],
    corpusLoaded: false
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
          state.editionsuuids.push(editionlist[i].editions.content[j].uuid)
        }
      }
      console.log('corpus editionsbyuuid', state.editionsbyuuid)
    },
    setTocs (state, tocslist) {
      console.log('setTocs', tocslist)
      tocslist.forEach((toc, i) => {
        state.editionsbyuuid[toc.uuid].toc = toc.toc
      })
      // console.log('corpus editionsbyuuid', state.editionsbyuuid)
    },
    setPaginations (state, paginationslist) {
      console.log('setPaginations', paginationslist)
      paginationslist.forEach((pagination, i) => {
        state.editionsbyuuid[pagination.uuid].pagination = pagination.pagination
      })
      // console.log('corpus editionsbyuuid', state.editionsbyuuid)
    },
    setCorpusLoaded (state) {
      state.corpusLoaded = true
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

                dispatch('getEditionsTocs')
                  .then((tocslist) => {
                    console.log('all tocs returned: tocslist', tocslist)
                    commit('setTocs', tocslist)

                    dispatch('getEditionsPaginations')
                      .then((paginationslist) => {
                        console.log('all paginations returned: paginationslist', paginationslist)
                        commit('setPaginations', paginationslist)
                        commit('setCorpusLoaded')
                      })
                  })
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
    },
    // get tocslist
    getEditionsTocs ({ dispatch, commit, state }) {
      return Promise.all(state.editionsuuids.map(function (uuid) {
        return REST.get(`${window.apipath}/texts/${uuid}/toc`, {})
          .then(({ data }) => {
            console.log('corpus getEditionsTocs REST: uuid, data', uuid, data)
            // work arround
            // if (!Array.isArray(data.content)) {
            //   data.content = [data.content]
            // }
            return {
              uuid: uuid,
              toc: data.content
            }
          })
          .catch((error) => {
            console.warn('Issue with getEditionsTocs', error)
            Promise.reject(error)
          })
      }))
    },
    // get tocslist
    getEditionsPaginations ({ dispatch, commit, state }) {
      return Promise.all(state.editionsuuids.map(function (uuid) {
        return REST.get(`${window.apipath}/texts/${uuid}/pagination`, {})
          .then(({ data }) => {
            console.log('corpus getEditionsPaginations REST: uuid, data', uuid, data)
            // work arround
            // if (!Array.isArray(data.content)) {
            //   data.content = [data.content]
            // }
            return {
              uuid: uuid,
              pagination: data.content
            }
          })
          .catch((error) => {
            console.warn('Issue with getEditionsPaginations', error)
            Promise.reject(error)
          })
      }))
    }
  }
}
