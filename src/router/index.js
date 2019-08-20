import Vue from 'vue'
import Router from 'vue-router'

import Home from 'pages/Home'
import Corpus from 'pages/Corpus'
import Nominum from 'pages/Nominum'
import Locorum from 'pages/Locorum'
import Operum from 'pages/Operum'
import Bibliographie from 'pages/Bibliographie'

Vue.use(Router)

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'corpus',
    path: '/corpus',
    component: Corpus
  },
  {
    name: 'nominum',
    path: '/nominum',
    component: Nominum
  },
  {
    name: 'locorum',
    path: '/locorum',
    component: Locorum
  },
  {
    name: 'operum',
    path: '/operum',
    component: Operum
  },
  {
    name: 'bibliographie',
    path: '/bibliographie',
    component: Bibliographie
  }
]

export default new Router({
  mode: 'history',
  routes
})
