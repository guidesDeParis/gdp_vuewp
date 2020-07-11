<template>
  <MainContentLayout id="index-operum" class="index">
    <template v-slot:header>
      <h1>Œuvres</h1>
      <span v-if="!items.length">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.uuid">
        <OperumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import OperumItem from '../components/Content/OperumItem'

export default {
  name: 'IndexOperum',
  metaInfo: {
    title: 'Index Operum'
  },
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
        console.log('index operum REST: data', data)
        if (data.content.length) {
          this.items = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with index operum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
