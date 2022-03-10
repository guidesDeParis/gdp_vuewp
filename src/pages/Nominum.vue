<template>
  <MainContentLayout id="nominum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Loading ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1 v-html="content.title" />
      <p>
        {{ content.birthDate }}, {{ content.birthPlace }}<br>
        {{ content.deathDate }}, {{ content.deathPlace }}
      </p>
      <p v-if="content.occupation">{{ content.occupation }}</p>

      <section class="notes">
        <div v-for="(note, i) in content.note" :key="i" class="note" v-html="note" />
      </section>

      <section v-if="content.attestedForms" class="attested-forms">
        <h3>formes attestées</h3>
        <ul>
          <li v-for="(af, i) in content.attestedForms" :key="i">
            <span class="form">{{ af.title }}</span>
            <!-- <ul>
              <li v-for="(uuid, j) in af.uuid" :key="j">
                <a href="#">{{ uuid }}</a>
              </li>
            </ul> -->
          </li>
        </ul>
      </section>
    </template>

    <!-- default slot -->
    <IndexItemOcurrences v-if="content" :content="content" />

    <template v-if="content" v-slot:nav>
      <section v-if="content.autorities.length" class="autorities">
        <h3>Autorities</h3>
        <ul>
          <li v-for="(aut, i) in content.autorities" :key="i">
            <a :href="aut.identifier" target="_blanck">{{ aut.autority }}</a>
          </li>
        </ul>
      </section>
    </template>
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
    content: null
  }),
  metaInfo () {
    return {
      title: `Nominum ${this.$route.params.id}`
    }
  },
  created () {
    console.log('nominum this.$route', this.$route)
    REST.get(`${window.apipath}/indexNominum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('nominum REST: data', data)
        if (data.content) {
          this.parseOccurences(data.content)
        }
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
