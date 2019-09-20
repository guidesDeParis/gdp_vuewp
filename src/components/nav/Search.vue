<template>
  <div id="search" class="col-11">
    <form class="" action="index.html" method="post">
      <label htmlFor="keys">Search</label>
      <input
        id="keys"
        v-model="keys"
        type="text"
        placeholder="search"
      >
      <input
        id="search"
        type="submit"
        name="search"
        value="Search"
        @click.prevent="submit"
        @keyup.enter="submit"
      >
    </form>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'Search',
  // data: () => ({
  //   typed: ''
  // }),
  computed: {
    keys: {
      get () { return this.$store.state.Search.keys },
      set (value) { this.$store.commit('Search/setKeys', value) }
    }
  },
  methods: {
    ...mapActions({
      getResults: 'Search/getResults'
    }),
    submit () {
      console.log('submited', this.keys)
      this.getResults()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
