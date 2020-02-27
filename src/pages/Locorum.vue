<template>
  <MainContentLayout id="locorum">
    <template v-slot:header>
      <h1 v-if="content">{{ content.title }}</h1>
      <p v-if="content">{{ content.type }}</p>
      <span v-if="!content">Loading ...</span>
    </template>

    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Locorum',
  components: {
    MainContentLayout
  },
  data: () => ({
    content: null
  }),
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
