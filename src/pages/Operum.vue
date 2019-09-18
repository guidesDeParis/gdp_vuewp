<template>
  <div
    id="operum"
    class="full-width"
  >
    <h1>Operum</h1>
    <span v-if="!items.length">Loading ...</span>
    <div v-else class="item-list">
      <ul>
        <li v-for="item in items" :key="item.url">
          <OperumItem :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { REST } from 'api/rest-axios'
import OperumItem from '../components/Content/OperumItem'

export default {
  name: 'Operum',
  components: {
    OperumItem
  },
  data: () => ({
    items: []

  }),
  beforeCreate () {
    // items/gdpLeMaire1685T01BodyFr01.003.016
    // texts/gdpSauval1724
    REST.get(`/indexOperum`, {})
      .then(({ data }) => {
        console.log('operum REST: data', data)
        if (data.content.length) {
          this.items = data.content
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
