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
    REST.get(`/indexNominum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('nominum REST: data', data)
        if (data.content) {
          this.content = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with nominum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
