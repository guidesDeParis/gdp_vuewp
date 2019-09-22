<template>
  <div id="footer-tabs" class="col-1">
    <ul>
      <li class="history">
        <div class="wrapper">
          <span>Historique de consultation</span>
        </div>
      </li>
      <li class="results">
        <div class="wrapper">
          <span
            v-if="resultsItems.length && !resultsOpened"
            title="Ouvrir les resultats"
            @click.prevent="openResults"
            @keydown.enter.prevent="openResults"
          >
            Resultas
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'FooterTabs',
  computed: {
    resultsOpened: {
      get () { return this.$store.state.Search.opened },
      set (value) { this.$store.commit('Search/setOpened', value) }
    },
    ...mapState({
      resultsItems: state => state.Search.results
    })
  },
  methods: {
    openResults () {
      this.resultsOpened = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
