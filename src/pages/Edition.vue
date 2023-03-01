<template>
  <MainContentLayout
    id="edition"
    :reftoscrollto="reftoscrollto"
    :navopened="navopened"
    @onCenterScrolled="onCenterScrolled"
  >
    <!-- <transition name="fade" mode="out-in"> -->
    <template v-if="!corpusLoaded" #header>
      <span class="loading">Loading ...</span>
    </template>
    <template v-else #header>
      <h1>
        <router-link :to="{ name:'edition', params: { id: editionid }}">{{ title }}</router-link>
      </h1>
      <div v-if="author">
        <p>{{ author }}</p>
      </div>
      <div v-if="date">
        <p>{{ date }}</p>
      </div>
      <div v-if="description">
        <p v-html="description" />
      </div>
      <div v-if="biblio" class="biblio">
        <p v-html="biblio.description" />
        <a
          :href="edition_manifestation_href"
          @click.prevent="onClickManifestation"
          @keyup.enter="onClickManifestation"
        >
          // todo better label
          {{ biblio.uuid }}
        </a>
      </div>

      <!-- displayed on hover entity on texte -->
      <aside
        v-if="indexitem"
        class="index-tooltip"
        :style="{ top:tooltip_top + 'px' }"
        :data-index="indexitem.index"
        :data-uuid="indexitem.uuid"
        @click.prevent="onClickTooltip"
        @keyup.enter="onClickTooltip"
      >
        <span v-if="indexitem == 'loading'" class="loading">Loading ...</span>
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
    <!-- </transition> -->
    <!-- default slot -->
    <div id="text">
      <template v-if="texts.length">
        <infinite-loading
          v-if="flattoc && center_scrolled"
          :identifier="inifinite_load_id"
          direction="top"
          :distance="inifinite_load_distance"
          @infinite="prevText"
        />
        <!-- <transition-group name="edition-texts" tag="div"> -->
        <EdText
          v-for="text in texts"
          :ref="text.content.uuid"
          :key="text.content.uuid"
          :tei="text.content.tei"
          :uuid="text.content.uuid"
          :url="text.content.url"
          :textid="textid"
          :extractid="extractid"
          @onHoverLink="onHoverLink"
          @onLeaveLink="onLeaveLink"
        />
        <!-- </transition-group> -->
        <infinite-loading
          v-if="flattoc"
          :identifier="inifinite_load_id"
          @infinite="nextText"
        />
      </template>
    </div>

    <template #nav>
      <span
        class="nav-title"
        @click.prevent="onOpenCloseNav"
        @keyup.enter="onOpenCloseNav"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" class="vs__open-indicator"><path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" /></svg>
        Sommaire
      </span>
      <EdToc
        id="toc"
        :toc="toc"
        :loadedtextsuuids="textsuuids"
        :selectedindex="selectedindex"
        @onClickTocItem="onClickTocItem"
      />
      <EdIndexes
        v-if="indexes"
        id="indexes-filters"
        :indexes="indexes"
        @onClickIndexItem="onClickIndexItem"
      />
      <EdPagination
        v-if="pagination"
        id="page-nav"
        :pagination="pagination"
        @onClickPaginationItem="onClickPaginationItem"
      />
    </template>
  </MainContentLayout>
</template>

<script>

import qs from 'querystring'

import { REST } from 'api/rest-axios'
import { mapState, mapActions } from 'vuex'

import MainContentLayout from '../components/Layouts/MainContentLayout'
import EdText from '../components/Content/EdText'
import EdToc from '../components/Content/EdToc'
import EdIndexes from '../components/Content/EdIndexes'
import EdPagination from '../components/Content/EdPagination'

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
    EdToc,
    EdIndexes,
    EdPagination
  },
  data: () => ({
    meta: null,
    editionid: null,
    textid: null,
    extract: null,
    extractid: null,
    texts: [],
    textsuuids: [],
    metainfotitle: undefined,
    title: undefined,
    biblio: undefined,
    author: undefined,
    date: undefined,
    description: undefined,
    texttitle: undefined,
    //
    indexitem: null,
    tooltip_top: null,
    //
    next_loaded: false,
    center_scrolled: false,
    inifinite_load_distance: 10,
    inifinite_load_id: +new Date(),
    reftoscrollto: null,
    //
    toc: null,
    flattoc: null,
    //
    indexes: null,
    selectedindex: null,
    //
    pagination: null,
    //
    navopened: false
  }),
  computed: {
    ...mapState({
      corpusLoaded: state => state.Corpus.corpusLoaded,
      editionslist: state => state.Corpus.editionslist,
      editionsbyuuid: state => state.Corpus.editionsbyuuid
    }),
    edition_manifestation_href () {
      return `${this.biblio.path}${this.biblio.uuid}`
    }
  },
  watch: {
    $route (to, from) {
      console.log('Edition Watcher $route', from, to)
      if (to.params.textid) {
        // change textid when route change
        this.textid = to.params.textid
        // change also extract if exists
        this.extractid = null
        if (to.params.extract) {
          console.log('extract params from route', to.params.extract)
          this.extractid = to.params.ocid
          // scrolling is not working :(
          this.reftoscrollto = '#mark-1'
        }
      } else if (this.toc) {
        // if no textid in new route (e.g. edition front)
        // but we have toc
        // get the first item
        // will be replaced by front page of edition
        this.textid = this.toc[0].children[1].uuid
      } else {
        this.textid = null
      }
    },
    reftoscrollto (newref, oldref) {
      console.log('reftoscrollto changed', oldref, newref)
    },
    textid (newid, oldid) {
      console.log('textid watcher', this, oldid, newid)
      this.texts = []
      this.textsuuids = []
      this.pages = []
      this.pagesOtpions = []
      if (newid) {
        this.getTextContent(newid)
        this.inifinite_load_id += 1
      }
    },
    textdata (newtxtdata, oldtxtdata) {
      console.log('textdata watcher', oldtxtdata, newtxtdata)
      this.metainfotitle = `${this.title} ${newtxtdata.meta.title}`
    },
    page_selected (newp, oldp) {
      console.log('page_selected watcher', oldp, newp)
      this.scrollToPage(newp)
    },
    flattoc (n, o) {
      console.log('flattoc watcher', o, n)
      // this.scrollToPage(newp)
    }
  },
  created () {
    // console.log('Edition this.$route.params.id', this.$route.params.id)
    this.editionid = this.$route.params.id

    // get the text if textid available
    if (this.$route.params.textid) {
      this.textid = this.$route.params.textid
    }

    // get the searchkeys from route param (only comming from result item) for text highlighting
    if (this.$route.params.ocid) {
      this.extractid = this.$route.params.ocid
      // scrolling is not working :(
      this.reftoscrollto = '#mark-1'
    }

    // wait for editions list from Corpus Store if not already loaded
    if (!this.corpusLoaded) {
      // this.getCorpuses()
      // subsribe to store to get the editionbyuuid list
      // https://dev.to/viniciuskneves/watch-for-vuex-state-changes-2mgj
      this.edUuuidsUnsubscribe = this.$store.subscribe((mutation, state) => {
        // console.log('Edition store subscribe', mutation.type)
        if (mutation.type === 'Corpus/setEditionsByUUID') {
          // console.log('Edition state.Coprus.editionsbyuuid', this.editionid, state.Corpus.editionsbyuuid)
          this.title = this.metainfotitle = state.Corpus.editionsbyuuid[this.editionid].title
          this.biblio = state.Corpus.editionsbyuuid[this.editionid].biblio
          this.description = state.Corpus.editionsbyuuid[this.editionid].description
          this.date = state.Corpus.editionsbyuuid[this.editionid].date
          this.author = state.Corpus.editionsbyuuid[this.editionid].author
        }
        if (mutation.type === 'Corpus/setTocs') {
          console.log('Edition Corpus/setTocs', this.editionid, state.Corpus.editionsbyuuid)
          this.toc = state.Corpus.editionsbyuuid[this.editionid].toc
        }
        if (mutation.type === 'Corpus/buildFlatTocsAndFilters') {
          console.log('Edition Corpus/buildFlatTocsAndFilters', this.editionid, state.Corpus.editionsbyuuid)
          this.flattoc = state.Corpus.editionsbyuuid[this.editionid].flattoc
          // launch infinitloading
          this.inifinite_load_id += 1
          // if no textid in new route (e.g. edition front)
          // but we have toc
          // get the first item
          // will be replaced by front page of edition
          if (!this.textid) { this.textid = this.flattoc[1] }
          //
          this.indexes = state.Corpus.editionsbyuuid[this.editionid].indexes
        }
        if (mutation.type === 'Corpus/setPaginations') {
          // console.log('Edition state.Coprus.editionsbyuuid', this.editionid, state.Corpus.editionsbyuuid)
          this.pagination = state.Corpus.editionsbyuuid[this.editionid].pagination
        }
      })
    } else {
      // console.log('');
      this.title = this.metainfotitle = this.editionsbyuuid[this.editionid].title
      this.biblio = this.editionsbyuuid[this.editionid].biblio
      this.description = this.editionsbyuuid[this.editionid].description
      this.date = this.editionsbyuuid[this.editionid].date
      this.author = this.editionsbyuuid[this.editionid].author
      this.toc = this.editionsbyuuid[this.editionid].toc
      this.flattoc = this.editionsbyuuid[this.editionid].flattoc
      // if no textid in new route (e.g. edition front)
      // but we have toc
      // get the first item
      // will be replaced by front page of edition
      if (!this.textid) { this.textid = this.toc[0].children[0].uuid }
      this.indexes = this.editionsbyuuid[this.editionid].indexes
      this.pagination = this.editionsbyuuid[this.editionid].pagination
    }
  },
  methods: {
    ...mapActions({
      getCorpuses: 'Corpus/getCorpuses'
    }),
    getTextContent (textid, $state = null, direction = 'next') {
      console.log('getTextContent', textid)
      let params = {
        depth: 0
      }
      let q = qs.stringify(params)
      REST.get(`${window.apipath}/items/${textid}?${q}`, {})
        .then(({ data }) => {
          console.log('text REST: data', data)
          if (direction === 'next') {
            this.texts.push(data)
            this.textsuuids.push(data.content.uuid)
          } else {
            this.texts.unshift(data)
            this.textsuuids.unshift(data.content.uuid)
          }
          if ($state) {
            $state.loaded()
            this.next_loaded = true
          }
        })
        .catch((error) => {
          console.warn('Issue with getTextContent', error)
          Promise.reject(error)
          // if some item don't load and if we come from infinite loading
          // retry with next step
          if ($state) {
            switch (direction) {
              case 'next':
                this.nextText($state, 2)
                break
              case 'prev':
                this.prevText($state, 2)
                break
            }
          }
          // this.$router.replace({
          //   name: 'notfound',
          //   query: { fullpath: this.$route.path }
          // })
        })
    },
    onCenterScrolled (e) {
      console.log('Edition centerScrolled(e)', e.target.scrollTop)
      if (!this.center_scrolled && e.target.scrollTop > this.inifinite_load_distance * 1.5) {
        this.center_scrolled = true
        // this.$store.commit('History/setOpened', false)
      }
      this.indexitem = null
    },
    nextText ($state, indent = 1) {
      console.log('infinite loading nextText()')
      let indexofnext = this.flattoc.indexOf(this.textsuuids[this.textsuuids.length - 1]) + indent
      if (indexofnext < this.flattoc.length) {
        this.getTextContent(this.flattoc[indexofnext], $state, 'next')
      } else {
        $state.complete()
      }
    },
    prevText ($state, indent = 1) {
      console.log('infinite loading prevText()')
      let indexofprev = this.flattoc.indexOf(this.textsuuids[0]) - indent
      if (indexofprev >= 0) {
        this.getTextContent(this.flattoc[indexofprev], $state, 'prev')
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
      REST.get(`${window.apipath}/index${item.index.charAt(0).toUpperCase()}${item.index.slice(1)}/${item.uuid}`, {})
        .then(({ data }) => {
          console.log('index tooltip REST: data', data)
          if (this.indexitem === 'loading') {
            this.indexitem = data.content
            this.indexitem.index = item.index
          }
        })
        .catch((error) => {
          console.warn('Issue with index tooltip rest', error)
          Promise.reject(error)
          this.indexitem = null
        })
    },
    onClickTocItem (uuid) {
      console.log('Edition onClickTocItem', uuid, this.$refs)
      if (this.textsuuids.indexOf(uuid) !== -1) {
        // if already loaded, scroll to uuid
        this.reftoscrollto = `.tei[data-uuid="${uuid}"]`
      } else {
        // if not already loaded, change route
        this.$router.push({
          name: `editiontext`,
          params: {
            id: this.editionid,
            textid: uuid
          }
        })
      }
    },
    onClickIndexItem (o) {
      this.selectedindex = o
    },
    onClickPaginationItem (o) {
      console.log('onClickPaginationItem', o)
      if (this.textsuuids.indexOf(o.uuid) !== -1) {
        // if already loaded, scroll to uuid
        // this.scrollToPage(o)
        this.reftoscrollto = `span[role="pageBreak"][id="${o.code}"]`
      } else {
        // if not already loaded, change route
        this.$router.push({
          name: `editiontext`,
          params: {
            id: this.editionid,
            textid: o.uuid
          }
        })
      }
    },
    // scrollToPage (p) {
    //   console.log('scrollToPage', p)
    //
    // },
    onOpenCloseNav (e) {
      console.log('onOpenCloseNav', e)
      this.navopened = !this.navopened
    },
    onClickTooltip (e) {
      console.log(`onClickTooltip index: ${e.target.dataset.index}, uuid: ${e.target.dataset.uuid}`)
      this.$router.push({
        name: e.target.dataset.index,
        params: { id: e.target.dataset.uuid }
      })
    },
    onClickManifestation (e) {
      console.log(`onClickManifestation`)
      this.$router.push({
        name: 'bibliographieItem',
        params: { type: 'manifestations', uuid: this.biblio.uuid }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
