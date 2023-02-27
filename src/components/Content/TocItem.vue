<template>
  <section
    :uuid="item.uuid"
    :level="level"
    :type="item.type"
    class="tocitem"
  >
    <component
      :is="titlelevel"
      v-if="title"
      class="toc-title"
      :uuid="item.uuid"
      :class="{active: isActive, loaded: isLoaded, notitle: noTitle}"
    >
      <a
        :href="'/texts/'+editionid+'/'+item.uuid"
        :uuid="item.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
      >
        {{ title }}
      </a>
    </component>
    <ul
      v-if="children.length"
      class="toc-list"
      :class="{opened: isOpened}"
    >
      <li v-for="child in children" :key="child.uuid">
        <TocItem
          :item="child"
          :level="nextLevel"
          :editionid="editionid"
          :loadedtextsuuids="loadedtextsuuids"
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
    loadedtextsuuids: Array
  },
  data: () => ({
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
        return this.item.title.join(' ')
      } else if (this.item.title) {
        return this.item.title
      } else {
        console.log('TOC no title', this.item)
        return this.item.type
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
  beforeMount () {
    if (typeof this.$route.params.textid !== 'undefined') {
      this.isOpened = this.$route.params.textid.indexOf(this.item.uuid) >= 0
    }
    if (['book', 'volume'].indexOf(this.item.type) >= 0) {
      this.isOpened = true
    }
    if (!this.item.title) {
      this.noTitle = true
    }
  },
  methods: {
    ...mapActions({
      addHistoryItem: 'History/addItem'
    }),
    onclick (e) {
      console.log('clicked on toc text', this.item, e)
      this.addHistoryItem({
        id: this.editionid,
        textid: this.item.uuid,
        title: this.item.title,
        editionTitle: this.editionTitle
        // pages: this.item.pages,
        // size: this.item.size
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
