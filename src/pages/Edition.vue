<template>
  <MainContentLayout id="edition" :reftoscrollto="reftoscrollto" @onCenterScrolled="onCenterScrolled">
    <template v-if="!content" #header>
      <span>Loading ...</span>
    </template>
    <template #header>
      <h1>
        <router-link :to="{ name:'edition', params: { id: editionid }}">{{ title }}</router-link>
      </h1>

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
        <infinite-loading
          v-if="center_scrolled"
          :identifier="textid"
          direction="top"
          :distance="inifinite_load_distance"
          @infinite="prevText"
        />
        <EdText
          v-for="text in texts"
          :ref="text.content.uuid"
          :key="text.content.uuid"
          :tei="text.content.tei"
          :uuid="text.content.uuid"
          :textid="textid"
          @onHoverLink="onHoverLink"
          @onLeaveLink="onLeaveLink"
          @onNewPageBreaks="onNewPageBreaks"
        />
        <infinite-loading
          :identifier="textid"
          @infinite="nextText"
        />
      </template>
    </div>

    <template #nav>
      <EdToc id="toc" :toc="toc" :loadedtextsuuids="textsuuids" @onClickTocItem="onClickTocItem" />
      <div v-if="pages.length" id="page-nav">
        <!-- <select class="" name="page-nav" v-model="page_selected" placeholder="Pages">
          <option value="" disabled selected>Pages</option>
          <option v-for="(page, index) in pages" :key="index" :value="page">{{ page }}</option>
        </select> -->
        <v-select
          id="page-nav-select"
          type="select"
          placeholder="Aller à la page ..."
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="pages"
          :clearable="false"
          :value="page_selected"
          @input="onPageSelected"
        />
      </div>
    </template>
  </MainContentLayout>
</template>

<script>

import { createPopper } from '@popperjs/core'

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
    textsuuids: [],
    metainfotitle: undefined,
    title: undefined,
    author: undefined,
    texttitle: undefined,
    //
    indexitem: null,
    tooltip_top: null,
    //
    next_loaded: false,
    center_scrolled: false,
    inifinite_load_distance: 10,
    reftoscrollto: null,
    //
    pages: [],
    pagesOptions: [],
    page_selected: ''
  }),
  computed: {
    ...mapState({
      editionslist: state => state.Corpus.editionslist,
      editionsbyuuid: state => state.Corpus.editionsbyuuid
    })
  },
  watch: {
    $route (to, from) {
      console.log('Edition Watcher $route', from, to)
      if (to.params.textid) {
        // change textid when route change
        this.textid = to.params.textid
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
    textid (newid, oldid) {
      console.log('textid watcher', this, oldid, newid)
      this.texts = []
      this.textsuuids = []
      this.pages = []
      this.pagesOtpions = []
      if (newid) {
        this.getTextContent(newid)
      }
    },
    textdata (newtxtdata, oldtxtdata) {
      console.log('textdata watcher', oldtxtdata, newtxtdata)
      this.metainfotitle = `${this.title} ${newtxtdata.meta.title}`
    },
    page_selected (newp, oldp) {
      console.log('page_selected watcher', oldp, newp)
      this.scrollToPage(newp)
    }
  },
  beforeCreate () {
    console.log('texts this.$route', this.$route)
    // http://localhost:8984/texts/gdpSauval1724/toc
    // get the edition's toc
    REST.get(`${window.apipath}/texts/` + this.$route.params.id + `/toc`, {})
      .then(({ data }) => {
        console.log('texts/toc REST: data', data)
        this.meta = data.meta
        this.author = data.meta.author
        if (data.content && data.content !== 'vide') {
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
        } else {
          console.warn('Bad edition uuid', this.$route.params.id, this.$route)
          this.$router.replace({
            name: 'notfound',
            query: { fullpath: this.$route.path }
          })
        }
      })
      .catch((error) => {
        console.warn('Issue with text toc', error)
        Promise.reject(error)
      })
  },
  created () {
    // console.log('Edition this.$route.params.id', this.$route.params.id)
    this.editionid = this.$route.params.id

    // load editions list from Corpus Store if not exist
    if (!this.editionslist.length) {
      // this.getCorpuses()
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
  // beforeRouteUpdate (to, from, next) {
  //   // called when the route that renders this component has changed,
  //   // but this component is reused in the new route.
  //   // For example, for a route with dynamic params `/foo/:id`, when we
  //   // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
  //   // will be reused, and this hook will be called when that happens.
  //   // has access to `this` component instance.
  //   // console.log('beforeRouteUpdate to', to)
  //   if (to.params.textid) {
  //     this.textid = to.params.textid
  //   }
  //   next()
  // },
  methods: {
    ...mapActions({
      getCorpuses: 'Corpus/getCorpuses'
    }),
    getTextContent (textid, $state = null, direction = 'next') {
      console.log('getTextContent', textid)
      REST.get(`${window.apipath}/items/${textid}`, {})
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
          this.$router.replace({
            name: 'notfound',
            query: { fullpath: this.$route.path }
          })
        })
    },
    onCenterScrolled (e) {
      // console.log('Edition centerScrolled(e)', e.target.scrollTop)
      if (!this.center_scrolled && e.target.scrollTop > this.inifinite_load_distance * 1.5) {
        this.center_scrolled = true
      }
      this.indexitem = null
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
      REST.get(`${window.apipath}/index${item.index.charAt(0).toUpperCase()}${item.index.slice(1)}/${item.uuid}`, {})
        .then(({ data }) => {
          console.log('index tooltip REST: data', data)
          if (this.indexitem === 'loading') {
            this.indexitem = data.content
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
    onNewPageBreaks (p) {
      // console.log('onNewPageBreaks', p)
      for (var i = 0; i < p.length; i++) {
        if (this.pages.indexOf(p[i]) === -1) {
          this.pages.push(p[i])
        }
      }
      // reorder array
      this.pages.sort((a, b) => a - b)
      // this.pagesOptions = []
      // for (var j = 0; j < this.pages.length; j++) {
      //   this.pagesOptions.push({ code: this.pages[j], label: `page ${this.pages[j]}` })
      // }
    },
    dropDownMenuPos (dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1]
            }
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({ state }) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            }
          }]
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    },
    onPageSelected (e) {
      console.log('onPageSelected', e)
      this.page_selected = e
      this.scrollToPage(e)
      // this.scrollToPage(e.code)
    },
    scrollToPage (p) {
      // console.log('scrollToPage', p)
      this.reftoscrollto = `span[role="pageBreak"][data-num="${p}"]`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
