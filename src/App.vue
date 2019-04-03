<template>
  <div id="root">
    <header role="banner">
      <h1
        tabindex="0"
        @click="closePost()"
        @keydown.enter="closePost()"
      >
        Les Guides de Paris
      </h1>
    </header>
    <section class="container center-content">
      <RouterView />
    </section>
    <footer role="search-bar" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Home',
    // all titles will be injected into this template
    titleTemplate: '%s | Guides de Paris'
  },
  computed: mapState({
    opened: state => state.posts.opened
  }),
  methods: mapActions('posts', [
    'closePost'
  ])
}
</script>

<style lang="stylus" scoped>

.container
  font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
  max-width 1200px

</style>
