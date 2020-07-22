<template>
  <nav id="header-menu">
    <ul v-if="corpusLoaded">
      <li><router-link to="/corpus">Corpus</router-link></li>
      <li>
        <span>Indexs</span>
        <ul>
          <li><router-link to="/nominum">Personnes</router-link></li>
          <li><router-link to="/locorum">Lieux</router-link></li>
          <li><router-link to="/operum">Œuvres</router-link></li>
        </ul>
      </li>
      <li><router-link to="/bibliographie">Bibliographie</router-link></li>
      <li><a href="#">Blog</a></li>
      <li>
        <a href="#" class="mdi mdi-login-variant" title="connexion">
          <span class="visualy-hidden">connexion</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'HeaderMenu',
  data: () => ({

  }),
  computed: {
    ...mapState({
      corpusLoaded: state => state.Corpus.corpusLoaded
    })
  }
}

</script>

<style lang="scss" scoped>

</style>
