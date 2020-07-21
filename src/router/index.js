import Vue from 'vue'
import Router from 'vue-router'

import Home from 'pages/Home'
// import Item from 'pages/Item'
import ListCorpus from 'pages/ListCorpus'
// import Corpus from 'pages/Corpus'
import Edition from 'pages/Edition'
import IndexNominum from 'pages/IndexNominum'
import IndexLocorum from 'pages/IndexLocorum'
import IndexOperum from 'pages/IndexOperum'
import Nominum from 'pages/Nominum'
import Locorum from 'pages/Locorum'
import Operum from 'pages/Operum'
import Bibliographie from 'pages/Bibliographie'
import NotFound from 'pages/NotFound'

Vue.use(Router)

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  // {
  //   name: 'item',
  //   path: '/babar/:uuid',
  //   component: Item,
  //   props: true
  // },
  {
    name: 'listcorpus',
    path: '/corpus',
    component: ListCorpus
  },
  // {
  //   name: 'corpus',
  //   path: '/corpus/:id',
  //   component: Corpus
  // },
  {
    name: 'edition',
    path: '/edition/:id',
    component: Edition
  },
  {
    name: 'editiontext',
    path: '/edition/:id/:textid',
    component: Edition
  },
  {
    name: 'indexNominum',
    path: '/nominum',
    component: IndexNominum
  },
  {
    name: 'nominum',
    path: '/nominum/:id',
    component: Nominum
  },
  {
    name: 'indexLocorum',
    path: '/locorum',
    component: IndexLocorum
  },
  {
    name: 'locorum',
    path: '/locorum/:id',
    component: Locorum
  },
  {
    name: 'indexOperum',
    path: '/operum',
    component: IndexOperum
  },
  {
    name: 'operum',
    path: '/operum/:id',
    component: Operum
  },
  {
    name: 'bibliographie',
    path: '/bibliographie',
    component: Bibliographie
  },
  {
    name: 'notfound',
    path: '/404',
    alias: '*',
    component: NotFound
  }
]

export default new Router({
  mode: 'history',
  routes
})
