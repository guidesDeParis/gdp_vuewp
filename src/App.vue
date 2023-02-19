<template>
  <div id="root">
    <header role="banner">
      <div class="wrapper">
        <h1
          class="site-title"
          tabindex="0"
        >
          <router-link :to="{ name:'home' }">Les Guides de Paris</router-link>
        </h1>
        <HeaderMenu />
      </div>
    </header>
    <section role="main-content">
      <div class="wrapper">
        <transition name="fade" mode="out-in">
          <RouterView />
        </transition>
      </div>
    </section>
    <footer role="tools">
      <History />
      <Results v-if="resultsOpened" />
      <div id="footer-bottom" class="row">
        <FooterTabs />
        <Search />
        <div
          v-if="$route.name === 'home' && (!searchResults || !searchResults.length)"
          id="logos"
          class="small-col-12 med-col-7 large-col-7"
        >
          <div class="wrapper">
            <img src="/static/img/logos/labex.jpg" alt="Labex">
            <img src="/static/img/logos/PIA logo.png" alt="PIA">
            <img src="/static/img/logos/Logo-HAR-Unite-de-recherche.png" alt="HAR">
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import HeaderMenu from './components/nav/HeaderMenu'
import History from './components/nav/History'
import Results from './components/nav/Results'
import Search from './components/nav/Search'
import FooterTabs from './components/nav/FooterTabs'
import { mapActions, mapState } from 'vuex'

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Home',
    // all titles will be injected into this template
    titleTemplate: '%s | Guides de Paris',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  components: {
    HeaderMenu,
    History,
    Results,
    Search,
    FooterTabs
  },
  computed: {
    ...mapState({
      resultsOpened: state => state.Search.opened,
      editionslist: state => state.Corpus.editionslist,
      searchResults: state => state.Corpus.results
    })
  },
  created () {
    if (!this.editionslist.length) {
      this.getCorpuses()
    }
  },
  methods: {
    ...mapActions({
      getCorpuses: 'Corpus/getCorpuses'
    })
  }
}
</script>

<style lang="scss" scoped>

.container{
  // font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  max-width: 1200px;

}

</style>
