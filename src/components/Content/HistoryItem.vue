<template>
  <article class="result item">
    <h1>
      <a
        :href="'/texts/'+item.id+'/'+item.textid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="item.title"
      />
    </h1>
    <h2>
      <a
        :href="'/texts/'+item.id+'/'+item.textid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="item.editionTitle"
      />
    </h2>
    <!-- <p v-if="preview" class="preview" v-html="preview" /> -->
    <aside
      v-if="item.pages || item.size"
    >
      <span v-if="item.pages">{{ item.pages.prefix }} {{ item.pages.range }}</span>
      <span v-if="item.pages && item.size"> | </span>
      <span v-if="item.size">{{ item.size.quantity }} {{ item.size.unit }}</span>
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
