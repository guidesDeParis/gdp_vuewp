<template>
  <transition name="accordeon" appear>
    <div
      v-if="opened"
      id="history"
      class="row"
    >
      <header class="col-1">
        <h2>Historique de consultation</h2>
      </header>
      <section class="col-10 history-list">
        <div class="wrapper">
          <ul v-if="items.length">
            <li v-for="item in items" :key="item.uuid" class="item">
              <HistoryItem :item="item" />
            </li>
          </ul>
        </div>
      </section>
      <nav class="col-1 tools">
        <span
          class="mdi mdi-close"
          title="close"
          @click.prevent="close"
          @keydown.enter.prevent="close"
        />
      </nav>
    </div>
  </transition>
</template>

<script>

import HistoryItem from '../Content/HistoryItem'
import { mapState } from 'vuex'

export default {
  name: 'History',
  components: {
    HistoryItem
  },
  computed: {
    opened: {
      get () { return this.$store.state.History.opened },
      set (value) { this.$store.commit('History/setOpened', value) }
    },
    ...mapState({
      items: state => state.History.items
    })
  },
  methods: {
    close () {
      console.log('clicked on close history')
      this.opened = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
