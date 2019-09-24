import Vue from 'vue'
import Router from 'vue-router'

import Home from 'pages/Home'
import Item from 'components/Content/Item'
import Corpus from 'pages/Corpus'
import Nominum from 'pages/Nominum'
import NominumItem from 'components/Content/NominumItem'
import Locorum from 'pages/Locorum'
import Operum from 'pages/Operum'
import OperumItem from 'components/Content/OperumItem'
import Bibliographie from 'pages/Bibliographie'

Vue.use(Router)

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'item',
    path: '/items/:uuid',
    component: Item,
    props: true
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
    name: 'nominumItem',
    path: '/nominum/:id',
    component: NominumItem
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
    name: 'operumItem',
    path: '/operum/:id',
    component: OperumItem
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
