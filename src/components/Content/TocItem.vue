<template>
  <section
    :uuid="item.uuid"
    :level="level"
  >
    <component
      :is="titlelevel"
      v-if="title"
      class="toc-title"
      :uuid="item.uuid"
      :class="{active: isActive, loaded: isLoaded}"
    >
      <a
        :href="'/edition/'+editionid+'/'+item.uuid"
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
    isOpened: false
  }),
  computed: {
    children () {
      // check if children exists and if it is an array
      // this shoudn't be necessary
      return this.item.children ? Array.isArray(this.item.children) ? this.item.children : [this.item.children] : []
    },
    title () {
      // this shoudn't be necessary
      if (this.item.title && Array.isArray(this.item.title)) {
        return this.item.title.join(' ')
      } else {
        return this.item.title
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
  },
  methods: {
    onclick (e) {
      // console.log('clicked on toc text', this.editionid, e)
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
