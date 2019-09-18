<template>
  <div
    id="nominum"
    class="full-width"
  >
    <h1>Nominum</h1>
    <span v-if="!items.length">Loading ...</span>
    <div v-else class="item-list">
      <ul>
        <li v-for="item in items" :key="item.url">
          <NominumItem :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { REST } from 'api/rest-axios'
import NominumItem from '../components/Content/NominumItem'

export default {
  name: 'Nominum',
  components: {
    NominumItem
  },
  data: () => ({
    items: []

  }),
  beforeCreate () {
    // items/gdpLeMaire1685T01BodyFr01.003.016
    // texts/gdpSauval1724
    REST.get(`/indexNominum`, {})
      .then(({ data }) => {
        console.log('nominum REST: data', data)
        if (data.content.length) {
          this.items = data.content
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
