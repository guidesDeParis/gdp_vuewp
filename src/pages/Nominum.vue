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
          <h3>
            <a
              :href="'/edition/'+ed.item"
              :uuid="ed.item"
              @click.prevent="onclick"
              @keyup.enter="onclick"
            >
              {{ ed.item }}
            </a>
          </h3>
          <ul >
            <li
              v-for="oc in ed.occurences"
              :key="oc.uuid"
            >
              <h4>
                <a
                  :href="'/edition/'+ed.item+'/'+oc.uuid"
                  :uuid="oc.uuid"
                  :eduuid="ed.item"
                  @click.prevent="onclick"
                  @keyup.enter="onclick"
                >
                  {{ oc.title }}
                </a>
              </h4>
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
  },
  methods: {
    onclick (e) {
      console.log('clicked on nominum text occurence', e)
      if (e.target.getAttribute('eduuid')) {
        this.$router.push({
          name: `editiontext`,
          params: {
            id: e.target.getAttribute('eduuid'),
            textid: e.target.getAttribute('uuid')
          }
        })
      } else {
        this.$router.push({
          name: `edition`,
          params: {
            id: e.target.getAttribute('uuid')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
