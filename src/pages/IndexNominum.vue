<template>
  <MainContentLayout id="index-nominum" class="index">
    <template v-slot:header>
      <h1>Personnes</h1>
      <span v-if="!items.length">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.url">
        <NominumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import NominumItem from '../components/Content/NominumItem'

export default {
  name: 'IndexNominum',
  metaInfo: {
    title: 'Index Nominum'
  },
  components: {
    NominumItem,
    MainContentLayout
  },
  data: () => ({
    items: []

  }),
  beforeCreate () {
    // items/gdpLeMaire1685T01BodyFr01.003.016
    // texts/gdpSauval1724
    REST.get(`/indexNominum`, {})
      .then(({ data }) => {
        console.log('index nominum REST: data', data)
        if (data.content.length) {
          this.items = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with index nominum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
