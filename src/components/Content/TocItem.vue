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
  // data: () => ({
  //
  // })
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
      return 'h' + this.level
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
    isOpened () {
      // console.log('opened', this.$route.params.textid.indexOf(this.item.uuid) >= 0)
      if (typeof this.$route.params.textid !== 'undefined') {
        return this.$route.params.textid.indexOf(this.item.uuid) >= 0
      } else {
        return false
      }
    },
    isLoaded () {
      return this.loadedtextsuuids.indexOf(this.item.uuid) !== -1
    }
  },
  // beforeCreate () {
  //   console.log('editionid', this.editionid)
  // },
  methods: {
    onclick (e) {
      console.log('clicked on toc text', this.editionid, e)
      // if (this.$route.params.textid !== e.target.getAttribute('uuid')) {
      //   this.$router.push({
      //     name: `editiontext`,
      //     params: {
      //       id: this.editionid,
      //       textid: e.target.getAttribute('uuid')
      //     }
      //   })
      // } else {
      this.$emit('onClickTocItem', e.target.getAttribute('uuid'))
      // }
    },
    onClickTocItem (uuid) {
      this.$emit('onClickTocItem', uuid)
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
