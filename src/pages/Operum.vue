<template>
  <MainContentLayout id="operum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Chargement ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1 v-html="content.title" />
      <h2 v-html="content.rubrique" />
      <p><em>{{ content.type }}</em></p>
      <p v-if="content.location"><span class="label">Adresse :</span> {{ content.location }}</p>
      <p v-if="content.description">{{ content.description }}</p>

      <section v-if="content.notes && content.notes.length" class="notes">
        <h3>Notes</h3>
        <div v-for="(note, i) in content.note" :key="i" class="note" v-html="note" />
      </section>
      <section v-if="content.autorities && content.autorities.length" class="autorities">
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

    <template #nav>
      <aside class="links">
        <p>
          Permalien:<br><a :href="`${content.url}`">{{ content.url }}</a>
        </p>
        <p>
          JSON:<br><a :href="`${apipath}${content.path}${content.uuid}`">{{ apipath }}{{ content.path }}{{ content.uuid }}</a>
        </p>
      </aside>
    </template>
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
