<template>
  <section>
    <ul>
      <li
        v-for="item in toc"
        :key="item.uuid"
      >
        <TocItem :item="item" :level="1" :editionid="$route.params.id" />
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
    toc: Array
  },
  data: () => ({

  })
}
</script>

<style lang="scss" scoped>
</style>
