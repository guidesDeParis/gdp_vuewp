<template>
  <nav id="header-menu" ref="header_menu">
    <!-- <span v-if="!corpusLoaded" class="loading">Chargement ...</span> -->
    <span
      class="mdi mdi-menu burger-btn"
      @click.prevent="onClickBTN"
      @keyup.enter="onClickBTN"
    />
    <ul>
      <li>
        <span v-if="!corpusLoaded" class="loading">Chargement ...</span>
        <router-link v-else to="/corpus">Corpus</router-link>
      </li>
      <li class="has-submenu" :class="{ opened: indexOpened }">
        <!-- tabindex="-1" -->
        <span
          @click.prevent="onClickIndex"
          @keyup.enter="onClickIndex"
        >
          Index
        </span>
        <ul>
          <li><router-link to="/indexNominum">Personnes</router-link></li>
          <li><router-link to="/indexLocorum">Lieux</router-link></li>
          <li><router-link to="/indexOperum">Œuvres</router-link></li>
        </ul>
      </li>
      <li><router-link to="/bibliography">Bibliographie</router-link></li>
      <li><router-link to="/schema">Schema</router-link></li>
      <!-- <li>
        <a href="#" class="mdi mdi-login-variant" title="connexion">
          <span class="visualy-hidden">connexion</span>
        </a>
      </li> -->
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
  watch: {
    $route (n, o) {
      // console.log('route changed')
      this.indexOpened = false
      this.$refs.header_menu.classList.remove('opened')
    }
  },
  methods: {
    onClickIndex (e) {
      console.log('onClickIndex')
      this.indexOpened = !this.indexOpened
    },
    onClickBTN () {
      this.$refs.header_menu.classList.toggle('opened')
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
