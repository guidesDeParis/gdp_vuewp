<template>
  <MainContentLayout id="corpus">
    <template v-slot:header>
      <h1>Corpus</h1>
      <span v-if="!items.length">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.url">
        <CorpusItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav>
    </template>
  </MainContentLayout>
</template>

<script>

import CorpusItem from '../components/Content/CorpusItem'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Corpus',
  components: {
    CorpusItem,
    MainContentLayout
  },
  data: () => ({
    // items: []
  }),
  computed: {
    ...mapState({
      items: state => state.Corpus.items
    })
  },
  created () {
    if (!this.items.length) {
      this.getItems()
    }
  },
  methods: {
    ...mapActions({
      getItems: 'Corpus/getItems'
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
