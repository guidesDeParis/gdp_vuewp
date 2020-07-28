<template>
  <nav id="header-menu">
    <!-- <span v-if="!corpusLoaded" class="loading">Loading ...</span> -->
    <ul>
      <li >
        <span v-if="!corpusLoaded" class="loading">Loading ...</span>
        <router-link v-else to="/corpus">Corpus</router-link>
      </li>
      <li :class="{ opened: indexOpened }">
        <span
          @click.prevent="onClickIndex"
          @keyup.enter="onClickIndex"
        >
          Indexs
        </span>
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
    indexOpened: false
  }),
  computed: {
    ...mapState({
      corpusLoaded: state => state.Corpus.corpusLoaded
    })
  },
  methods: {
    onClickIndex (e) {
      console.log('onClickIndex')
      this.indexOpened = !this.indexOpened
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
