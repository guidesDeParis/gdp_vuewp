<template>
  <MainContentLayout id="edition-toc">
    <template v-if="!content" #header>
      <span>Loading ...</span>
    </template>
    <template v-if="meta" #header>
      <h1>{{ meta.author }}</h1>
    </template>

    <!-- default slot -->
    <EdText v-if="textdata" :textdata="textdata" />

    <template #nav>
      <EdToc  :content="content" />
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import EdText from '../components/Content/EdText'
import EdToc from '../components/Content/EdToc'

export default {
  name: 'EditionToc',
  components: {
    MainContentLayout,
    EdText,
    EdToc
  },
  data: () => ({
    content: null,
    meta: null,
    editionid: null,
    textid: null,
    textdata: null
  }),
  watch: {
    textid: function (newid, oldid) {
      // console.log('textid watcher', this, newid, oldid)
      this.getTextContent()
    }
  },
  beforeCreate () {
    console.log('texts this.$route', this.$route)
    // http://localhost:8984/texts/gdpSauval1724/toc
    this.editionid = this.$route.params.id
    // get the edition's toc
    REST.get(`/texts/` + this.$route.params.id + `/toc`, {})
      .then(({ data }) => {
        console.log('texts/toc REST: data', data)
        this.meta = data.meta
        if (data.content) {
          if (Array.isArray(data.content)) {
            this.content = data.content
          } else {
            this.content = [data.content]
          }
        }
      })
      .catch((error) => {
        console.warn('Issue with locorum', error)
        Promise.reject(error)
      })
  },
  created () {
    // get the text if textid available
    if (this.$route.params.textid) {
      this.textid = this.$route.params.textid
      // this.getTextContent()
    }
  },
  beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
    // console.log('beforeRouteUpdate to', to)
    if (to.params.textid) {
      this.textid = to.params.textid
    }
    next()
  },
  methods: {
    getTextContent () {
      console.log('getTextContent', this.textid)
      if (this.textid) {
        REST.get(`/items/` + this.textid, {})
          .then(({ data }) => {
            console.log('text REST: data', data)
            this.textdata = data
          })
          .catch((error) => {
            console.warn('Issue with getTextContent', error)
            Promise.reject(error)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
