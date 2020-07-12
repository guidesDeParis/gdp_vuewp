<template>
  <MainContentLayout id="locorum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Loading ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1 v-html="content.title" />
      <p>
        {{ content.type }}
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
    REST.get(`/indexLocorum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('locorum REST: data', data)
        if (data.content) {
          this.content = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with locorum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
