<template>
  <MainContentLayout id="operum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Loading ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1 v-html="content.title" />
      <section v-if="content.author.length" class="authors">
        <ul>
          <li v-for="author in content.author" :key="author.uuid">
            <router-link
              :to="{ name:'nominum', params: { id: author.uuid }}"
            >
              {{ author.name }}
            </router-link>

          </li>
        </ul>
      </section>
      <section class="notes">
        <div v-for="(note, i) in content.note" :key="i" class="note" v-html="note" />
      </section>
      <section v-if="content.autorities.length" class="autorities">
        <h3>Autorities</h3>
        <ul>
          <li v-for="(aut, i) in content.autorities" :key="i">
            <a :href="aut.identifier" target="_blanck">
              {{ aut.autority }}
              <span class="mdi mdi-open-in-new" />
            </a>
          </li>
        </ul>
      </section>
    </template>

    <!-- default slot -->
    <IndexItemOcurrences v-if="content" :content="content" />

  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import IndexItemOcurrences from '../components/Content/IndexItemOcurrences'

export default {
  name: 'Operum',
  components: {
    MainContentLayout,
    IndexItemOcurrences
  },
  data: () => ({
    content: null,
    meta: [],
    metainfotitle: undefined
  }),
  metaInfo () {
    // console.log('metainfo', this.meta)
    return {
      title: this.metainfotitle,
      meta: this.meta
    }
  },
  beforeCreate () {
    console.log('operum this.$route', this.$route)
    REST.get(`${window.apipath}/indexOperum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('operum REST: data', data)
        if (data.content) {
          this.content = data.content
          this.metainfotitle = data.content.title
        }
        this.updateMetaData(data.meta.metadata)
      })
      .catch((error) => {
        console.warn('Issue with operum', error)
        Promise.reject(error)
        this.$router.replace({
          name: 'notfound',
          query: { fullpath: this.$route.path }
        })
      })
  },
  methods: {
    updateMetaData (metadata) {
      this.meta = []
      metadata.forEach(m => {
        let o = {}
        o.name = m.name
        if (Array.isArray(m.content)) {
          o.content = m.content.join(', ')
        } else {
          o.content = m.content
        }
        if (typeof m.scheme !== 'undefined') {
          o.scheme = m.scheme
        }
        this.meta.push(o)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
