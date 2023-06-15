<template>
  <MainContentLayout id="static" class="">
    <template v-slot:header>
      <span v-if="!page" class="loading">Chargement ...</span>
      <h1 v-else>{{ page.title }}</h1>
    </template>

    <div v-if="page" v-html="page.tei_parsed" />

  </MainContentLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Static',
  components: {
    MainContentLayout
  },
  data: () => ({
    uuid: null,
    page: null
  }),
  computed: {
    ...mapState({
      colophon: state => state.Colophon.colophon
    })
    // page () {
    // }
  },
  watch: {
    $route (n, o) {
      console.log('static route changed', n, o)
      this.uuid = n.name
      if (this.colophon && this.colophon.length > 0) {
        this.setPage()
      }
    },
    colophon (n, o) {
      this.setPage()
    }
  },
  beforeCreate () {

  },
  created () {
    if (!this.colophon.length) {
      this.getColophon()
    }
    console.log('Static created', this.$route)
    this.uuid = this.$route.name
    if (this.colophon && this.colophon.length > 0) {
      this.setPage()
    }
  },
  methods: {
    ...mapActions({
      getColophon: 'Colophon/getColophon'
    }),
    setPage () {
      for (let i = 0; i < this.colophon.length; i++) {
        if (this.colophon[i].uuid === this.uuid) {
          this.page = this.colophon[i]
        }
      }
      this.parseContentImages()
    },
    parseContentImages () {
      console.log('parseContentImages')
      this.page.tei_parsed = this.page.tei.replace(/src="\/gdp\/static\/images\/(\w+)\.jpg"/g, `src="${window.apipath}/gdp/static/images/$1.jpg"`)
      console.log(this.page.tei_parsed)
    }
  },
  metaInfo () {
    return {
      title: `Static`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
