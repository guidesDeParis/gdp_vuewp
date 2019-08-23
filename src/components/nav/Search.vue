<template>
  <div id="search">
    <form class="" action="index.html" method="post">
      <label for="keywords">
        Search
        <input
          id="keywords"
          v-model="keywords"
          type="text"
          placeholder="search"
        >
      </label>
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

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Search',
  // data: () => ({
  //   keywords: ''
  // }),
  computed: {
    ...mapState({
      keywords: state => state.Search.keywords
    })
  },
  methods: {
    ...mapActions({
      getResults: 'Search/getResults'
    }),
    submit () {
      console.log('submited', this.keywords)
      this.getResults()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
