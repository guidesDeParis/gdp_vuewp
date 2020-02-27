<template>
  <MainContentLayout id="texts">
    <template v-if="!content" v-slot:header>
      <span>Loading ...</span>
    </template>
    <template v-if="meta" v-slot:header>
      <h1>{{ meta.title }}</h1>
    </template>
    <section
      v-for="item in content"
      :key="item.uuid"
    >
      <h3 class="text-title">{{ item.title }}</h3>
      <div class="tei" v-html="item.tei" />
    </section>
    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Texts',
  components: {
    MainContentLayout
  },
  data: () => ({
    content: null,
    meta: null
  }),
  beforeCreate () {
    console.log('texts this.$route', this.$route)
    REST.get(`/texts/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('texts REST: data', data)
        this.meta = data.meta
        if (data.content) {
          if (Array.isArray(data.content)) {
            this.content = data.content
          } else {
            this.content = [data.content]
          }
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
