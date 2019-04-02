import datarest from '../../api/datarest'

// initial state
const state = {
  all: [],
  opened: null
}

// getters
const getters = {}

// actions
const actions = {
  getAllPosts ({ commit }) {
    datarest.getPosts(posts => {
      commit('setPosts', posts)
    })
  },
  openPost ({ commit }, post) {
    datarest.getPost(post.id, post => {
      commit('setOpened', post)
    })
  },
  closePost ({ commit }) {
    commit('clearOpened')
  }
}

// mutations
const mutations = {
  setPosts (state, posts) {
    state.all = posts
  },
  setOpened (state, post) {
    state.opened = post
  },
  clearOpened (state) {
    state.opened = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
