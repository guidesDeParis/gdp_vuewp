<template>
  <transition name="accordeon" appear>
    <div
      v-if="opened"
      id="results"
      class="row"
    >
      <header class="col-1">
        <h2>Resultats</h2>
        <span class="search-keys">{{ keys }}</span><br />
        <span class="results-count">{{ results.length }} resultat(s)</span>
      </header>
      <section class="col-10 results-list">
        <div class="wrapper">
          <ul v-if="results.length">
            <li v-for="result in results" :key="result.uuid" class="result">
              <ResultItem :result="result" />
            </li>
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
import { mapState } from 'vuex'

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
      results: state => state.Search.results
    })
  },
  methods: {
    close () {
      console.log('clicked on close results')
      this.opened = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
