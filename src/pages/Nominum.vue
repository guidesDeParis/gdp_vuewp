<template>
  <MainContentLayout id="nominum">
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
  name: 'Nominum',
  components: {
    MainContentLayout
  },
  data: () => ({
    content: null
  }),
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
