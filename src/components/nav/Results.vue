<template>
  <transition name="accordeon" appear>
    <div
      v-if="opened"
      id="results"
      class="row"
    >
      <header class="col-1">
        <h2>Resultats</h2>
        <span class="search-keys">{{ keys }}</span><br>
        <span v-if="resultsQuantity" class="results-count">{{ resultsCount }}</span>
      </header>
      <section class="col-10 results-list">
        <div class="wrapper">
          <ul v-if="results.length">
            <li v-for="result in results" :key="result.uuid" class="result">
              <ResultItem :result="result" />
            </li>
            <infinite-loading
              v-if="offset < resultsQuantity.quantity"
              @infinite="nextResultsBatch"
            />
          </ul>
        </div>
      </section>
      <nav class="col-1 tools">
        <span
          class="mdi mdi-close"
          title="close"
          @click.prevent="close"
          @keydown.enter.prevent="close"
        />
      </nav>
    </div>
  </transition>
</template>

<script>

import ResultItem from '../Content/ResultItem'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Results',
  components: {
    ResultItem
  },
  computed: {
    opened: {
      get () { return this.$store.state.Search.opened },
      set (value) { this.$store.commit('Search/setOpened', value) }
    },
    ...mapState({
      keys: state => state.Search.keys,
      results: state => state.Search.results,
      resultsQuantity: state => state.Search.resultsQuantity,
      offset: state => state.Search.offset
    }),
    resultsCount () {
      return `${this.$store.state.Search.resultsQuantity.quantity} ${this.$store.state.Search.resultsQuantity.unit}`
    }
  },
  methods: {
    close () {
      console.log('clicked on close results')
      this.opened = false
    },
    ...mapActions({
      nextResultsBatch: 'Search/nextResultsBatch'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
