<template>
  <MainContentLayout id="index-locorum" class="index">
    <template v-slot:header>
      <h1>Lieux</h1>
      <span v-if="!items.length">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.uuid">
        <LocorumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import LocorumItem from '../components/Content/LocorumItem'

export default {
  name: 'IndexLocorum',
  components: {
    LocorumItem,
    MainContentLayout
  },
  data: () => ({
    items: []
  }),
  beforeCreate () {
    REST.get(`/indexLocorum`, {})
      .then(({ data }) => {
        console.log('index locorum REST: data', data)
        if (data.content.length) {
          this.items = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with index locorum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
