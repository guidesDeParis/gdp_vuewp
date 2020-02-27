<template>
  <MainContentLayout id="operum">
    <template v-slot:header>
      <h1 v-if="content">{{ content.title }}</h1>
      <span v-if="!content">Loading ...</span>
    </template>

    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Operum',
  components: {
    MainContentLayout
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
