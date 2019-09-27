<template>
  <MainContentLayout id="locorum" class="index">
    <template v-slot:header>
      <h1>Lieux</h1>
      <span v-if="!items.length">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.url">
        <LocorumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav>
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import LocorumItem from '../components/Content/LocorumItem'

export default {
  name: 'Locorum',
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
        console.log('locorum REST: data', data)
        if (data.content.length) {
          this.items = data.content
        }
      })
      .catch((error) => {
        console.warn('Issue with locorum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
