<template>
  <article class="result item">
    <header>
      <h1>
        <a
          :href="result.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="result.textId"
        />
      </h1>
    </header>
    <div class="extract" v-html="result.extract" />
  </article>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'ResultItem',
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions({
      addHistoryItem: 'History/addItem'
    }),
    onclick () {
      console.log('clicked on result item', this.result)
      this.addHistoryItem(this.result)
      // this.$router.push({
      //   name: `item`,
      //   params: { uuid: this.result.uuid }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
