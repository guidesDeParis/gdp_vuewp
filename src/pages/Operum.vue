<template>
  <MainContentLayout id="operum">
    <template v-slot:header>
      <h1>Œuvres</h1>
      <span v-if="!items.length">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.url">
        <OperumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav>
      nav
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import OperumItem from '../components/Content/OperumItem'

export default {
  name: 'Operum',
  components: {
    OperumItem,
    MainContentLayout
  },
  data: () => ({
    items: []
  }),
  beforeCreate () {
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
