<template>
  <div
    id="corpus"
    class="full-width"
  >
    <h1>Corpus</h1>
    <span v-if="!items.length">Loading ...</span>
    <div v-else class="item-list">
      <ul>
        <li v-for="item in items" v-bind:key="item.url">
          <CorpusItem :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import CorpusItem from '../components/Content/CorpusItem'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Corpus',
  components: {
    CorpusItem
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
