<template>
  <article class="result item">
    <header>
      <h1>
        <a
          :href="'/edition/'+result.textId+'/'+result.uuid"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="result.title[0]"
        />
      </h1>
      <h2>
        <a
          :href="'/edition/'+result.textId+'/'+result.uuid"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="result.textId"
        />
      </h2>
    </header>
    <p v-if="preview" class="preview" v-html="preview" />
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
  data: () => ({
    preview: ''
  }),
  created () {
    if (this.result.extract) {
      const subString = this.result.extract.substr(0, 80)
      this.preview = subString.substr(0, subString.lastIndexOf(' ')) + ' &hellip;'
    } else {
      console.warn(`No extract for ${this.result.textId}/${this.result.uuid}`)
    }
  },
  methods: {
    ...mapActions({
      addHistoryItem: 'History/addItem'
    }),
    onclick () {
      console.log('clicked on result item', this.result)
      this.addHistoryItem(this.result)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
