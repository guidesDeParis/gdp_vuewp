<template>
  <MainContentLayout id="biblio">
    <template v-if="!content" #header>
      <span class="loading">Loading ...</span>
    </template>
    <template #header>
      <h1>
        <router-link :to="{ name:'bibliographie'}">Bibliographie</router-link>
      </h1>
      <nav>
        <ul>
          <li>
            <router-link
              :to="{ name:'bibliographie', params: { type: 'expressions'}}"
            >
              Expressions
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name:'bibliographie', params: { type: 'manifestations'}}"
            >
              Manifestations
            </router-link>
          </li>
        </ul>
      </nav>
    </template>

    <!-- default slot -->
    <!-- expressions or manifestations list -->
    <template v-if="!uuid">
      <ul class="item-list">
        <li v-for="item in content" :key="item.uuid">
          <h2>
            <router-link
              :to="{ name:'bibliographieItem', params:{ type:type, uuid:item.uuid } }"
            >
              {{ item.authors }}
            </router-link>
          </h2>
          <p class="date">{{ item.dates }}</p>
          <p class="titles">{{ item.titles }}</p>
        </li>
      </ul>
    </template>
    <!-- or item -->
    <template v-else>
      <div class="biblio-item">
        <h2>{{ content.authors }}</h2>
        <p v-if="content.dates" class="date">{{ content.dates }}</p>
        <p class="titles">{{ content.titles }}</p>
        <ul vi-if="content.manifestations.length" class="item-list">
          <li v-for="item in content.manifestations" :key="item.uuid">
            <router-link
              :to="{ name:'bibliographieItem', params:{ type:'manifestations', uuid:item.uuid } }"
              v-html="item.tei"
            />
          </li>
        </ul>
      </div>
    </template>
    <template #nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Bibliographie',
  components: {
    MainContentLayout
  },
  metaInfo: {
    title: 'Bibliographie'
  },
  props: {
    type: String,
    uuid: String
  },
  data: () => ({
    content: Array
  }),
  watch: {
    $route (to, from) {
      this.getContent()
    }
  },
  created () {
    // this.type = this.$route.params.type || 'expressions'
    // this.uuid = this.$route.params.id || null
    this.getContent()
  },
  methods: {
    getContent () {
      // ?_format=json
      REST.get(`${window.apipath}/bibliography/${this.type}/${this.uuid || ''}`, {})
        .then(({ data }) => {
          console.log('Biblio REST: data', data)
          if (data.content) {
            this.content = data.content
          }
        })
        .catch((error) => {
          console.warn('Issue with bibliographie', error)
          Promise.reject(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
