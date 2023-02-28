import Vue from 'vue'
import Router from 'vue-router'

import { REST } from 'api/rest-axios'

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
import Static from 'pages/Static'

Vue.use(Router)

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'credits',
    path: '/credits',
    component: Static
  },
  {
    name: 'guide',
    path: '/guide',
    component: Static
  },
  {
    name: 'schema',
    path: '/schema',
    component: Static
  },
  {
    name: 'api',
    path: '/api',
    component: Static
  },
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
    path: '/texts/:id/:textid/:ocid',
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
    name: 'items',
    path: '/items/:uuid',
    beforeEnter: async (to, from, next) => {
      console.log('items before enter', from, to, next)

      let item = await REST.get(`${window.apipath}/items/` + to.params.uuid, {})
        .then(({ data }) => {
          // console.log('corpus getEditionsList REST: author, data', author, data)
          return data.content
        })
        .catch((error) => {
          console.warn('Issue with getEditionsList', error)
          // Promise.reject(error)
        })
      console.log('items : item', item)
      // item.textid = 'gdpSauval1724'
      // this named route does not replace the url
      // next({ name: 'editiontext', params: { id: item.textid, textid: item.uuid }, replace: true })
      next({ path: `/texts/${item.textId}/${item.uuid}`, replace: true })
    },
    component: { render: () => null }
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
