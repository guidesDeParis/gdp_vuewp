<template>
  <MainContentLayout
    id="static"
    :reftoscrollto="reftoscrollto"
  >
    <template v-slot:header>
      <span v-if="!page" class="loading">Chargement ...</span>
      <template v-else>
        <h1>{{ page.title }}</h1>
        <nav v-if="toc" class="toc" :class="{ opened: sommaireopened }">
          <span
            class="sommaire-title"
            @click.prevent="onOpenCloseSommaire"
            @keyup.enter="onOpenCloseSommaire"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" class="vs__open-indicator"><path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" /></svg>
            Sommaire
          </span>
          <div class="wrapper">
            <ul>
              <li
                v-for="(item,index) in toc"
                :key="index"
              >
                <a
                  :href="'#' + item.hash"
                  @click.prevent="onclickTOC"
                  @keyup.enter="onclickTOC"
                >
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </template>
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
    page: null,
    toc: [],
    reftoscrollto: null,
    sommaireopened: false
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
      this.parseContentTOC()
    },
    parseContentImages () {
      console.log('parseContentImages')
      this.page.tei_parsed = this.page.tei.replace(/src="\/gdp\/static\/images\/(\w+)\.jpg"/g, `src="${window.apipath}/gdp/static/images/$1.jpg"`)
      // console.log(this.page.tei_parsed)
    },
    parseContentTOC () {
      let match = this.page.tei_parsed.match(/<h1[^>]*>[^<]+<\/h1>/g)
      console.log('match', match)
      match.forEach((element, index) => {
        console.log(element, index)
        // let elmt = element.replace(/<h1([^>]*)>([^<]+)<\/h1>/, `<h1 id="toc-${index}"$1>$2</h1>`)
        let elmtmatch = element.match(/(<h1([^>]*)>)([^<]+)<\/h1>/)
        let elmt = element.replace(elmtmatch[1], `<h1 id="toc-${index}"${elmtmatch[2]}>`)
        this.page.tei_parsed = this.page.tei_parsed.replace(element, elmt)
        this.toc.push({
          title: elmtmatch[3],
          hash: `toc-${index}`
        })
      })
    },
    onOpenCloseSommaire (e) {
      console.log('onOpenCloseSommaire', e)
      this.sommaireopened = !this.sommaireopened
    },
    onclickTOC (e) {
      console.log('onClickTOC', e, e.target.hash)
      this.reftoscrollto = e.target.hash
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
