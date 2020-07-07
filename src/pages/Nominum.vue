<template>
  <MainContentLayout id="nominum">
    <template v-if="!content" v-slot:header>
      <span class="loading">Loading ...</span>
    </template>

    <template v-if="content" v-slot:header>
      <h1>{{ content.title }}</h1>
      <p>
        {{ content.birthDate }}, {{ content.birthPlace }}<br>
        {{ content.deathDate }}, {{ content.deathPlace }}
      </p>
    </template>

    <!-- default slot -->
    <section class="occurences">
      <ul>
        <li
          v-for="ed in content.occurences"
          :key="ed.item"
        >
          <h3>{{ ed.item }}</h3>
          <ul>
            <li
              v-for="oc in ed.occurences"
              :key="oc.uuid"
            >
              <h4>{{ oc.title }}</h4>
            </li>
          </ul>
        </li>
      </ul>
    </section>

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
