<template>
  <MainContentLayout id="text" class="text">
    <template v-slot:header>
      <h1>
        {{ item.title }}
      </h1>
      <span v-if="!loaded">Loading...</span>
    </template>

    <section v-html="item.tei" class="col-6"/>

    <template v-slot:nav>
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Item',
  components: {
    MainContentLayout
  },
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loaded: false,
    item: {}
  }),
  watch: {
    '$route' (to, from) {
      console.log('item route change')
      this.loadItem()
    }
  },
  created () {
    console.log('Item created', this.uuid)
    this.loadItem()
  },
  updated () {
    console.log('item updated', this.uuid)
  },
  methods: {
    loadItem () {
      this.loaded = false
      REST.get(`/items/` + this.uuid, {})
        .then(({ data }) => {
          console.log('item REST: data', data)
          this.item = data.content
          this.loaded = true
        })
        .catch((error) => {
          console.warn('Issue with item', error)
          Promise.reject(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
