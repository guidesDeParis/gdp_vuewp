<template>
  <div
    id="home"
    class="full-width"
  >
    <header>
      <h1>Les Guides de Paris</h1>
      <h2>Corpus des XVII et XVIII<sup>E</sup> siècles</h2>
    </header>
    <section class="row">
      <div class="col-2" />
      <div class="col-8 teasers">
        <div class="wrapper">
          <template v-if="!colophonHome || colophonHome.length <= 0">
            <span class="loading">Chargement ...</span>
          </template>
          <template v-else>
            <article
              v-for="page in colophonHome"
              :key="page.uuid"
            >
              <!-- <h1>{{ page.title }}</h1> -->
              <div v-html="trimedTei(page.tei)" />
              <a
                :href="page.url"
                class="readmore"
                @click.prevent="onclick(page.uuid)"
                @keyup.enter="onclick(page.uuid)"
              >
                <span>Lire la suite</span>
              </a>
            </article>
          </template>
        </div>
      </div>
      <div class="col-2" />
    </section>

  </div>

</template>

<script>

import { mapState, mapActions } from 'vuex'
import truncate from 'truncate-html'

export default {
  name: 'Home',
  metaInfo: {
    title: 'Home'
  },
  // data: () => ({
  //   // editionslist: []
  // }),
  computed: {
    ...mapState({
      colophonHome: state => state.Colophon.colophonHome
    })
  },
  created () {
    if (!this.colophonHome.length) {
      this.getColophon()
    }
  },
  methods: {
    ...mapActions({
      getColophon: 'Colophon/getColophon'
    }),
    trimedTei (tei) {
      return truncate(tei, 30, {
        byWords: true,
        stripTags: false,
        reserveLastWord: 10
      })
    },
    onclick (uuid) {
      console.log('clicked on home teaser', uuid)
      this.$router.push({
        name: uuid
      })
    }

  }
}
</script>

<style lang="scss">
  // a{
  //   z-index: 100;
  // }
</style>
