<template>
  <MainContentLayout id="edition">
    <template v-if="!content" #header>
      <span>Loading ...</span>
    </template>
    <template #header>
      <h1>{{ title }}</h1>
      <p v-if="meta">{{ meta.author }}</p>
      <aside
        v-if="indexitem"
        class="index-tooltip"
        :style="{ top:tooltip_top + 'px' }"
      >
        <span v-if="indexitem == 'loading'">Loading ...</span>
        <template v-if="indexitem !== 'loading'">
          <h1 v-html="indexitem.title" />
          <p v-if="indexitem.birthDate" class="birthdeath">
            <time>{{ indexitem.birthDate }}</time>, <span class="place">{{ indexitem.birthPlace }}</span><br>
            <time>{{ indexitem.deathDate }}</time>, <span class="place">{{ indexitem.deathPlace }}</span>
          </p>
          <p v-if="indexitem.occupation" class="occupation">
            {{ indexitem.occupation }}
          </p>
          <p v-if="indexitem.type" class="type">
            {{ indexitem.type }}
          </p>
        </template>

      </aside>
    </template>

    <!-- default slot -->
    <div id="text">
      <template v-if="texts.length">
        <infinite-loading direction="top" @infinite="prevText" />
        <EdText
          v-for="text in texts"
          :key="text.content.uuid"
          :tei="text.content.tei"
          :uuid="text.content.uuid"
          @onHoverLink="onHoverLink"
          @onLeaveLink="onLeaveLink"
        />
        <infinite-loading @infinite="nextText" />
      </template>
    </div>

    <template #nav>
      <EdToc :toc="toc" />
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import { mapState, mapActions } from 'vuex'

import MainContentLayout from '../components/Layouts/MainContentLayout'
import EdText from '../components/Content/EdText'
import EdToc from '../components/Content/EdToc'

export default {
  name: 'Edition',
  metaInfo () {
    // console.log('metainfo', this.meta)
    return {
      title: this.metainfotitle
    }
  },
  components: {
    MainContentLayout,
    EdText,
    EdToc
  },
  data: () => ({
    toc: null,
    meta: null,
    editionid: null,
    textid: null,
    texts: [],
    metainfotitle: undefined,
    title: undefined,
    author: undefined,
    texttitle: undefined,
    //
    indexitem: null,
    tooltip_top: null
  }),
  computed: {
    ...mapState({
      editionslist: state => state.Corpus.editionslist,
      editionsbyuuid: state => state.Corpus.editionsbyuuid
    })
  },
  watch: {
    textid: function (newid, oldid) {
      console.log('textid watcher', this, oldid, newid)
      this.texts = []
      this.getTextContent(newid)
    },
    textdata: function (newtxtdata, oldtxtdata) {
      console.log('textdata watcher', oldtxtdata, newtxtdata)
      this.metainfotitle = `${this.title} ${newtxtdata.meta.title}`
    }
  },
  beforeCreate () {
    console.log('texts this.$route', this.$route)
    // http://localhost:8984/texts/gdpSauval1724/toc
    // get the edition's toc
    REST.get(`/texts/` + this.$route.params.id + `/toc`, {})
      .then(({ data }) => {
        console.log('texts/toc REST: data', data)
        this.meta = data.meta
        this.author = data.meta.author
        if (data.content) {
          if (Array.isArray(data.content)) {
            this.toc = data.content
          } else {
            this.toc = [data.content]
          }
          // if front page get the first item in toc
          if (!this.$route.params.textid) {
            // console.log('toc', this.toc)
            this.textid = this.toc[0].children[1].uuid
          }
        }
      })
      .catch((error) => {
        console.warn('Issue with locorum', error)
        Promise.reject(error)
      })
  },
  created () {
    // console.log('Edition this.$route.params.id', this.$route.params.id)
    this.editionid = this.$route.params.id

    // load editions list from Corpus Store if not exist
    if (!this.editionslist.length) {
      this.getCorpuses()
      // subsribe to store to get the editionbyuuid list
      // https://dev.to/viniciuskneves/watch-for-vuex-state-changes-2mgj
      this.unsubscribe = this.$store.subscribe((mutation, state) => {
        // console.log('Edition store subscribe', mutation.type)
        if (mutation.type === 'Corpus/setEditionsByUUID') {
          console.log('Edition state.Coprus.editionsbyuuid', this.editionid, state.Corpus.editionsbyuuid)
          // this.title = 'HoHoHo'
          this.title = this.metainfotitle = state.Corpus.editionsbyuuid[this.editionid].title
        }
      })
    } else {
      this.title = this.metainfotitle = this.editionsbyuuid[this.editionid].title
    }

    // get the text if textid available
    if (this.$route.params.textid) {
      this.textid = this.$route.params.textid
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
    ...mapActions({
      getCorpuses: 'Corpus/getCorpuses'
    }),
    getTextContent (textid, $state = null, direction = 'next') {
      console.log('getTextContent', textid)
      REST.get(`/items/${textid}`, {})
        .then(({ data }) => {
          console.log('text REST: data', data)
          if (direction === 'next') {
            this.texts.push(data)
          } else {
            this.texts.unshift(data)
          }
          if ($state) {
            $state.loaded()
          }
        })
        .catch((error) => {
          console.warn('Issue with getTextContent', error)
          Promise.reject(error)
        })
    },
    nextText ($state) {
      console.log('infinite loading nextText()', this.texts[this.texts.length - 1].content.itemAfterUuid, $state)
      if (this.texts[this.texts.length - 1].content.itemAfterUuid) {
        this.getTextContent(this.texts[this.texts.length - 1].content.itemAfterUuid, $state, 'next')
      } else {
        $state.complete()
      }
    },
    prevText ($state) {
      console.log('infinite loading prevText()', this.texts[0].content.itemBeforeUuid, $state)
      if (this.texts[0].content.itemBeforeUuid) {
        this.getTextContent(this.texts[0].content.itemBeforeUuid, $state, 'prev')
      } else {
        $state.complete()
      }
    },
    onHoverLink (elmt) {
      console.log('Edition onHoverLink(elmt)', elmt)
      this.tooltip_top = elmt.rect.top
      this.getIndexItem(elmt)
    },
    onLeaveLink () {
      console.log('Edition onLeaveLink()')
      this.indexitem = null
    },
    getIndexItem (item) {
      this.indexitem = 'loading'
      REST.get(`/index${item.index.charAt(0).toUpperCase()}${item.index.slice(1)}/${item.uuid}`, {})
        .then(({ data }) => {
          console.log('index tooltip REST: data', data)
          this.indexitem = data.content
        })
        .catch((error) => {
          console.warn('Issue with index tooltip rest', error)
          Promise.reject(error)
          this.indexitem = null
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
