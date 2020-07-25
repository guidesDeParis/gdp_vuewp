<template>
  <article class="result item">
    <h1>
      <a
        :href="'/edition/'+result.textId+'/'+result.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="result.title"
      />
    </h1>
    <h2>
      <a
        :href="'/edition/'+result.textId+'/'+result.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
        v-html="editionTitle"
      />
    </h2>
    <!-- <p v-if="preview" class="preview" v-html="preview" /> -->
    <aside>
      <span>{{ result.pages.prefix }} {{ result.pages.range }}</span> | <span>{{ result.size.quantity }} {{ result.size.unit }}</span>
    </aside>
  </article>
</template>

<script>

import { mapState, mapActions } from 'vuex'

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
  computed: {
    ...mapState({
      editionsbyuuid: state => state.Corpus.editionsbyuuid
    }),
    editionTitle () {
      return this.editionsbyuuid[this.result.textId].title
    }
  },
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
      this.addHistoryItem({
        id: this.result.textId,
        textid: this.result.uuid,
        title: this.result.title[0],
        editionTitle: this.editionTitle
      })
      this.$router.push({
        name: `editiontext`,
        params: {
          id: this.result.textId,
          textid: this.result.uuid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
