<template>
  <MainContentLayout id="locorum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Loading ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1 v-html="content.title" />
      <p>{{ content.country }}</p>
      <p>{{ content.ville }}</p>
      <p>{{ content.type }}</p>

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
  name: 'Locorum',
  components: {
    MainContentLayout,
    IndexItemOcurrences
  },
  data: () => ({
    content: null
  }),
  metaInfo () {
    return {
      title: `Locorum ${this.$route.params.id}`
    }
  },
  computed: {
  },
  beforeCreate () {
    console.log('locorum this.$route', this.$route)
    REST.get(`${window.apipath}/indexLocorum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('locorum REST: data', data)
        if (data.content) {
          this.content = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with locorum', error)
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
