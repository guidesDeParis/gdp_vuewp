<template>
  <article class="history item">
    <header>
      <h1>
        <a
          :href="item.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="item.textId"
        />
      </h1>
    </header>
    <div class="extract" v-html="item.extract" />
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
