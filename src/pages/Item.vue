<template>
  <transition name="fade" appear>
    <span v-if="!loaded">Loading...</span>
    <article v-else class="item row">
      <header class="col-3">
        <h1>
          {{ item.title }}
        </h1>
      </header>
      <section v-html="item.tei" class="col-6"/>
      <section class="col-3">
        tree
      </section>
    </article>
  </transition>
</template>

<script>

import { REST } from 'api/rest-axios'

export default {
  name: 'Item',
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
