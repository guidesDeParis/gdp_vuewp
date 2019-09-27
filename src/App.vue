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
        <RouterView />
      </div>
    </section>
    <footer role="tools">
      <History />
      <Results v-if="resultsOpened" />
      <div id="footer-bottom" class="row">
        <FooterTabs />
        <Search />
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
import { mapState } from 'vuex'

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Home',
    // all titles will be injected into this template
    titleTemplate: '%s | Guides de Paris'
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
      resultsOpened: state => state.Search.opened
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
