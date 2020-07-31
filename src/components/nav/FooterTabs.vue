<template>
  <div id="footer-tabs" class="col-1">
    <ul>
      <li class="history">
        <div class="wrapper">
          <transition name="fade" appear>
            <span
              v-if="historyItems.length && !historyOpened"
              title="Ouvrir l'historique'"
              @click.prevent="openHistory"
              @keydown.enter.prevent="openHistory"
            >
              Historique de consultation
            </span>
          </transition>
        </div>
      </li>
      <li class="results">
        <div class="wrapper">
          <transition name="fade" appear>
            <span
              v-if="resultsItems.length && !resultsOpened"
              title="Ouvrir les resultats"
              @click.prevent="openResults"
              @keydown.enter.prevent="openResults"
            >
              Resultats
            </span>
          </transition>
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
    historyOpened: {
      get () { return this.$store.state.History.opened },
      set (value) { this.$store.commit('History/setOpened', value) }
    },
    ...mapState({
      resultsItems: state => state.Search.results,
      historyItems: state => state.History.items
    })
  },
  watch: {
    $route (n, o) {
      // console.log('route changed')
      this.resultsOpened = false
    }
  },
  methods: {
    openResults () {
      this.resultsOpened = true
    },
    openHistory () {
      this.historyOpened = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
