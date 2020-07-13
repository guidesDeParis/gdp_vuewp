<template>
  <section>
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
          @onClickTocItem="onClickTocItem"
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
    loadedtextsuuids: Array
  },
  data: () => ({

  }),
  methods: {
    onClickTocItem (uuid) {
      this.$emit('onClickTocItem', uuid)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
