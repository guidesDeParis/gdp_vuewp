<template>
  <div id="search" class="col-11">
    <form class="search-form">
      <label for="keys">Search</label>
      <input
        id="keys"
        v-model="keys"
        type="text"
        placeholder="search"
        @keydown.enter.prevent="submit"
      >
      <span
        v-if="!isloading"
        class="mdi mdi-magnify"
        title="rechercher"
        @click.prevent="submit"
        @keydown.enter.prevent="submit"
      />
      <span
        v-else
        class="mdi mdi-loading"
        title="chargement"
      />
      <!-- <input
        id="submit-search"
        type="submit"
        name="search"
        value="Search"
        class="mdi mdi-magnify"
        @click.prevent="submit"
        @keyup.enter="submit"
      > -->
    </form>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  name: 'Search',
  // data: () => ({
  //   typed: ''
  // }),
  computed: {
    keys: {
      get () { return this.$store.state.Search.keys },
      set (value) { this.$store.commit('Search/setKeys', value) }
    },
    ...mapState({
      isloading: state => state.Search.isloading
    })
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
