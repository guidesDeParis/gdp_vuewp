<template>
  <div id="results">
    <h2>Resultats</h2>
    <h3 v-if="keys">{{ keys }}</h3>
    <div class="results-list">
      <ul v-if="results.length">
        <li v-for="result in results" :key="result.uuid">
          <ResultItem :result="result" />
        </li>
      </ul>
    </div>

  </div>
</template>

<script>

import ResultItem from '../Content/ResultItem'
import { mapState } from 'vuex'

export default {
  name: 'Results',
  components: {
    ResultItem
  },
  data: () => ({

  }),
  computed: {
    ...mapState({
      keys: state => state.Search.keys,
      results: state => state.Search.results
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
