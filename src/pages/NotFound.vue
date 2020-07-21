<template>
  <MainContentLayout id="not-found" class="">
    <template v-slot:header>
      <h1>404 - Contenu non trouvé</h1>
      <code v-if="path">{{ path }}</code>
    </template>
  </MainContentLayout>
</template>

<script>

import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'NotFound',
  components: {
    MainContentLayout
  },
  // data: () => ({
  // }),
  computed: {
    path () {
      if (this.$route.query.fullpath) {
        return this.$route.query.fullpath
      } else if (this.$route.params.pathMatch) {
        return this.$route.params.pathMatch
      } else {
        return null
      }
    }
  },
  created () {
    console.log('NotFound created', this.$route)
  },
  metaInfo () {
    return {
      title: `Not Found`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
