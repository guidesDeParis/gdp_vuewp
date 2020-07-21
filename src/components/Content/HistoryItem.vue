<template>
  <article class="result item">
    <h1>
      <a
        :href="'/edition/'+item.textId+'/'+item.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="item.title"
      />
    </h1>
    <h2>
      <a
        :href="'/edition/'+item.textId+'/'+item.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="item.editionTitle"
      />
    </h2>
    <!-- <p v-if="preview" class="preview" v-html="preview" /> -->
    <aside>
      <span>Pagination</span> | <span>Nbr mots</span>
    </aside>
  </article>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'HistoryItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions({
      navigateToHistoryItem: 'History/navigateToItem'
    }),
    onclick () {
      console.log('clicked on history item', this.item)
      this.navigateToHistoryItem(this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
