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

      <section v-if="content.autorities.length" class="autorities">
        <h3>Autorities</h3>
        <ul>
          <li v-for="(aut, i) in content.autorities" :key="i">
            <a :href="aut.identifier" target="_blanck">{{ aut.autority }}</a>
          </li>
        </ul>
      </section>
    </template>

    <!-- default slot -->
    <IndexItemOcurrences v-if="content" :content="content" />

    <template v-slot:nav>
      <section v-if="content.attestedForms" class="attested-forms">
        <h3>Attested forms</h3>
        <ul>
          <li v-for="(af, i) in content.attestedForms" :key="i">
            <h4>{{ af.title }}</h4>
            <ul>
              <li v-for="(uuid, j) in af.uuid" :key="j">
                <a href="#">{{ uuid }}</a>
              </li>
            </ul>
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
  beforeCreate () {
    console.log('nominum this.$route', this.$route)
    REST.get(`${window.apipath}/indexNominum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('nominum REST: data', data)
        if (data.content) {
          this.content = data.content
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
  }
}
</script>

<style lang="scss" scoped>
</style>
