<template>
  <div id="root">
    <header role="banner">
      <div class="wrapper">
        <h1
          class="site-title"
          tabindex="0"
        >
          Les Guides de Paris
        </h1>
        <HeaderMenu />
      </div>
    </header>
    <section role="main-content">
      <RouterView />
    </section>
    <footer role="search-bar">
      <History />
      <Results />
      <Search />
    </footer>
  </div>
</template>

<script>
import HeaderMenu from './components/nav/HeaderMenu'
import Search from './components/nav/Search'
import Results from './components/nav/Results'
import History from './components/nav/History'
// import { mapState, mapActions } from 'vuex'

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Home',
    // all titles will be injected into this template
    titleTemplate: '%s | Guides de Paris'
  },
  components: {
    HeaderMenu,
    Search,
    Results,
    History
  }
}
</script>

<style lang="scss" scoped>

.container{
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  max-width: 1200px;

}

</style>
