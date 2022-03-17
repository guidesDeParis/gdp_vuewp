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
    path: '/texts/:id',
    component: Edition
  },
  {
    name: 'editiontext',
    path: '/texts/:id/:textid',
    component: Edition
  },
  {
    name: 'editiontextextract',
    path: '/texts/:id/:textid/:extract',
    component: Edition
  },
  {
    name: 'indexNominum',
    path: '/indexNominum',
    component: IndexNominum
  },
  {
    name: 'nominum',
    path: '/indexNominum/:id',
    component: Nominum
  },
  {
    name: 'indexLocorum',
    path: '/indexLocorum',
    component: IndexLocorum
  },
  {
    name: 'locorum',
    path: '/indexLocorum/:id',
    component: Locorum
  },
  {
    name: 'indexOperum',
    path: '/indexOperum',
    component: IndexOperum
  },
  {
    name: 'operum',
    path: '/indexOperum/:id',
    component: Operum
  },
  {
    path: '/bibliography',
    redirect: '/bibliography/expressions'
  },
  {
    name: 'bibliographie',
    path: '/bibliography/:type',
    component: Bibliographie,
    props: true
  },
  {
    name: 'bibliographieItem',
    path: '/bibliography/:type/:uuid',
    component: Bibliographie,
    props: true
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
