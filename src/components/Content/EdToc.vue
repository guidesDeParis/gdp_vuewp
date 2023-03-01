<template>
  <section ref="scrollabletoc">
    <ul>
      <li
        v-for="item in toc"
        :key="item.uuid"
      >
        <TocItem
          :item="item"
          :level="1"
          :editionid="$route.params.id"
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

export default {
  name: 'EdToc',
  components: {
    TocItem
  },
  props: {
    toc: Array,
    loadedtextsuuids: Array,
    selectedindex: Object
  },
  // watch: {
  //   reftoscrollto: function (newref, oldref) {
  //     console.log('TOC reftoscrollto watcher', oldref, newref)
  //     this.scrollToRef()
  //   }
  // },
  methods: {
    onScrollToRef (uuid) {
      // console.log('TOC scrollToRef', uuid, this.$refs)
      this.$scrollTo(`a[uuid="${uuid}"]`, 500, {
        container: this.$refs.scrollabletoc
      })
    },
    onClickTocItem (uuid) {
      this.$emit('onClickTocItem', uuid)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
