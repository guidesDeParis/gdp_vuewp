<template>
  <section
    :uuid="item.uuid"
    :level="level"
    :type="item.type"
    class="tocitem"
    :class="{
      active: isActive,
      loaded: isLoaded,
      notitle: noTitle,
      init_opened: isInitOpened,
      opened: isOpened,
      disabled: isDisabled
    }"
  >
    <component
      :is="titlelevel"
      v-if="title"
      class="toc-title"
      :uuid="item.uuid"
      :class="{
        active: isActive,
        loaded: isLoaded,
        notitle: noTitle,
        init_opened: isInitOpened,
        opened: isOpened,
        disabled: isDisabled
      }"
      :type="item.type"
      :level="level"
    >
      <a
        :href="'/texts/'+editionid+'/'+item.uuid"
        :uuid="item.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="title"
      />
    </component>
    <ul
      v-if="children.length"
      class="toc-list"
      :level="level"
      :type="item.type"
      :class="{init_opened: isInitOpened, opened: isOpened}"
    >
      <li v-for="child in children" :key="child.uuid">
        <TocItem
          :item="child"
          :level="nextLevel"
          :editionid="editionid"
          :loadedtextsuuids="loadedtextsuuids"
          :selectedindex="selectedindex"
          @onClickTocItem="onClickTocItem"
          @onScrollToRef="onScrollToRef"
        />
      </li>
    </ul>
  </section>
</template>

<script>

import TocItem from './TocItem'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'TocItem',
  components: {
    TocItem
  },
  props: {
    item: Object,
    level: Number,
    editionid: String,
    loadedtextsuuids: Array,
    selectedindex: Object
  },
  data: () => ({
    isInitOpened: false,
    isOpened: false,
    noTitle: false
  }),
  computed: {
    ...mapState({
      editionsbyuuid: state => state.Corpus.editionsbyuuid
    }),
    editionTitle () {
      return this.editionsbyuuid[this.editionid].title
    },
    children () {
      // check if children exists and if it is an array
      // this shoudn't be necessary
      return this.item.children ? Array.isArray(this.item.children) ? this.item.children : [this.item.children] : []
    },
    title () {
      // this shoudn't be necessary
      if (this.item.title && Array.isArray(this.item.title)) {
        return this.truncate(this.item.title.join(' '), 80, true)
      } else if (this.item.title) {
        return this.truncate(this.item.title, 80, true)
      } else {
        // console.log('TOC no title', this.item)
        // return this.item.type
        return null
      }
    },
    titlelevel () {
      return this.level < 7 ? `h${this.level}` : `span`
    },
    nextLevel () {
      return this.level + 1
    },
    isActive () {
      // console.log('Active', this.$route.params.textid, this.item.uuid)
      if (typeof this.$route.params.textid !== 'undefined') {
        return this.$route.params.textid === this.item.uuid
      } else {
        return false
      }
    },
    isLoaded () {
      // this is updated when loadedtextsuuids is changing
      // but not for isOpened (had to use a watcher + beforeMount)
      // don't now why ?
      return this.loadedtextsuuids.indexOf(this.item.uuid) !== -1
    },
    isDisabled () {
      let disabled = false
      if (this.selectedindex &&
        (!this.flat_indexes.length || this.flat_indexes.indexOf(this.selectedindex.code) === -1)
      ) {
        // console.log('tocitem disabled ?', this.selectedindex.code)
        disabled = true
      }
      return disabled
    }
  },
  watch: {
    loadedtextsuuids (n, o) {
      // console.log('EdTocItem watch loadedtxtsuuids', o, n)
      this.isOpened = this.loadedtextsuuids.some(e => e.indexOf(this.item.uuid) >= 0)
    },
    isOpened (n, o) {
      // console.log('TocItem watch isOpened', o, n)
      // if was closed and is opened
      if (!o && n) {
        this.onOpened()
      }
    }
  },
  created () {
    console.log('TocItem created', this.item)
    this.flat_indexes = []
    Object.keys(this.item.indexes[0]).forEach(index => {
      this.item.indexes[0][index].forEach(element => {
        this.flat_indexes.push(element.uuid)
      })
    })
    // console.log('tocItem created flat_indexes', this.flat_indexes)
  },
  beforeMount () {
    if (typeof this.$route.params.textid !== 'undefined') {
      this.isOpened = this.$route.params.textid.indexOf(this.item.uuid) >= 0
    }
    // if (this.level <= 2 && ['book', 'volume'].indexOf(this.item.type) === -1) {
    if (this.level === 1 ||
      (this.level === 2 && ['part', 'book', 'volume', 'front', 'body', 'back', 'div'].indexOf(this.item.type) >= 0)
    ) {
      this.isInitOpened = true
    }
    if (!this.item.title) {
      this.noTitle = true
    }
  },
  methods: {
    ...mapActions({
      addHistoryItem: 'History/addItem'
    }),
    truncate (str, n, useWordBoundary) {
      if (str.length <= n) { return str }
      const subString = str.slice(0, n - 1) // the original check
      return (useWordBoundary
        ? subString.slice(0, subString.lastIndexOf(' '))
        : subString) + '&nbsp;...'
    },
    onclick (e) {
      console.log('clicked on toc text', this.item, e)
      this.addHistoryItem({
        id: this.editionid,
        textid: this.item.uuid,
        title: this.item.title,
        editionTitle: this.editionTitle,
        pages: this.item.pages,
        size: this.item.size
      })
      this.$emit('onClickTocItem', e.target.getAttribute('uuid'))
    },
    onClickTocItem (uuid) {
      // pass the event to parent
      this.$emit('onClickTocItem', uuid)
    },
    onOpened () {
      this.$emit('onScrollToRef', this.item.uuid)
    },
    onScrollToRef (uuid) {
      // pass the event to parent
      this.$emit('onScrollToRef', uuid)
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
