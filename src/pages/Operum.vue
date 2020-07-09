<template>
  <MainContentLayout id="operum" class="index-item">
    <template v-if="!content" v-slot:header>
      <span class="loading">Loading ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1>{{ content.title }}</h1>
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
    content: null
  }),
  beforeCreate () {
    console.log('operum this.$route', this.$route)
    REST.get(`/indexOperum/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('operum REST: data', data)
        if (data.content) {
          this.content = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with operum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
