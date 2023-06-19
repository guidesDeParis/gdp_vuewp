<template>
  <MainContentLayout id="nominum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Chargement ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1 v-html="content.title" />
      <h2 v-html="content.rubrique" />
      <p v-if="content.occupation"><em>{{ content.occupation }}</em></p>
      <p><span class="label">Nom : </span>{{ content.surname }}, {{ content.surname }}</p>
      <p><span class="label">Prénom : </span>{{ content.forename }}, {{ content.forename }}</p>
      <p><span class="label">Sexe : </span>
        <span v-if="content.sexe === 1">Masculin</span>
        <span v-if="content.sexe === 0">Feminin</span>
      </p>
      <p><span class="label">Naissance : </span>{{ content.birthPlace }}, {{ content.birthDate }}</p>
      <p><span class="label">Mort : </span>{{ content.deathPlace }}, {{ content.deathDate }}</p>
      <section v-if="content.note && content.note.length > 0" class="notes">
        <h3>Notes</h3>
        <div v-for="(note, i) in content.note" :key="i" class="note" v-html="note" />
      </section>

      <section v-if="content.autorities && content.autorities.length > 0" class="autorities">
        <h3>Autorités</h3>
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

    <template v-if="content" v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import IndexItemOcurrences from '../components/Content/IndexItemOcurrences'

export default {
  name: 'Nominum',
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
  created () {
    console.log('nominum this.$route', this.$route)
    REST.get(`${window.apipath}/indexNominum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('nominum REST: data', data)
        if (data.content) {
          this.parseOccurences(data.content)
          this.metainfotitle = data.content.title
        }
        this.updateMetaData(data.meta.metadata)
      })
      .catch((error) => {
        console.warn('Issue with nominum', error)
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
    },
    parseOccurences (content) {
      console.log('parseOccurences', content)
      // ! parsing occurences
      for (let i = 0; i < content.occurences.length; i++) {
        let ed = content.occurences[i]
        for (let j = 0; j < ed.occurences.length; j++) {
          let o = ed.occurences[j]
          const uuid = o.uuid
          for (let k = 0; k < content.attestedForms.length; k++) {
            const form = content.attestedForms[k]
            if (form.uuid.indexOf(uuid) >= 0) {
              content.occurences[i].occurences[j].form = form.title
              break
            }
            console.warn('no form for occurence', o.uuid, o.title)
            content.occurences[i].occurences[j].form = ''
          }
        }
      }
      // ! parsing attested-forms
      for (let f = 0; f < content.attestedForms.length; f++) {
        let form = content.attestedForms[f]
        content.attestedForms[f].occurences = []
        for (let u = 0; u < form.uuid.length; u++) {
          // ? some UUID are duplicate
          let oc = {
            uuid: form.uuid[u]
          }
          for (let e = 0; e < content.occurences.length; e++) {
            let ed = content.occurences[e]
            for (let o = 0; o < ed.occurences.length; o++) {
              let occ = ed.occurences[o]
              if (oc.uuid === occ.uuid && occ.title) {
                oc.title = occ.title
                oc.ed = {
                  uuid: ed.item,
                  title: ed.biblio
                }
                content.attestedForms[f].occurences.push(oc)
                // content.attestedForms[f].uuid[u] = oc
                break
              }
            }
            if (oc.title) break
          }
        }
      }
      this.content = content
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
