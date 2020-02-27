<template>
  <MainContentLayout id="corpus">
    <template v-if="!content" v-slot:header>
      <span>Loading ...</span>
    </template>
    <template v-if="content" v-slot:header>
      <h1>{{ meta.author }}</h1>
      <h2>{{ meta.quantity }}</h2>
    </template>
    <section
      v-for="item in content"
      :key="item.uuid"
    >
      <h3>
        <a
          :uuid="item.uuid"
          :href="item.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
        >
          {{ item.title }}
        </a>
      </h3>
      <p class="date">{{ item.date }}</p>
      <p class="format"><span>format:</span> {{ item.format }}</p>
      <p class="itemsNb"><span>itemsNb:</span> {{ item.itemsNb }}</p>
      <p class="otherEditions"><span>Other Editions:</span> {{ item.otherEditions }}</p>
      <p class="biblio">{{ item.biblio }}</p>
    </section>
    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Corpus',
  components: {
    MainContentLayout
  },
  data: () => ({
    content: null,
    meta: null
  }),
  beforeCreate () {
    console.log('corpus this.$route', this.$route)
    REST.get(`/corpus/` + this.$route.params.id, {})
      .then(({ data }) => {
        console.log('corpus REST: data', data)
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
  },
  methods: {
    onclick (e) {
      console.log('clicked on corpus', e)
      this.$router.push({
        name: `texts`,
        params: { id: e.target.getAttribute('uuid') }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
