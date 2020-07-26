<template>
  <transition name="accordeon" appear>
    <div
      v-if="opened"
      id="results"
      class="row"
      :class="{ loading: isloading }"
    >
      <header class="col-1">
        <h2>Resultats</h2>
        <span class="search-keys">{{ searchedKeys }}</span><br>
        <span v-if="resultsQuantity" class="results-count">{{ resultsCount }}</span>
        <v-select
          id="sorting"
          type="select"
          placeholder="trier par"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="sortOptions"
          :value="sorting"
          @input="onSortingSelected"
        />
      </header>
      <section class="col-10 results-list">
        <div class="wrapper">
          <ul v-if="results.length">
            <li v-for="result in results" :key="result.uuid" class="result">
              <ResultItem :result="result" />
            </li>
            <infinite-loading
              v-if="offset < resultsQuantity.quantity"
              :identifier="isloading"
              @infinite="nextResultsBatch"
            />
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

import { createPopper } from '@popperjs/core'

import ResultItem from '../Content/ResultItem'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Results',
  components: {
    ResultItem
  },
  // data: () => ({
  // }),
  computed: {
    opened: {
      get () { return this.$store.state.Search.opened },
      set (value) { this.$store.commit('Search/setOpened', value) }
    },
    ...mapState({
      isloading: state => state.Search.isloading,
      searchedKeys: state => state.Search.searchedKeys,
      results: state => state.Search.results,
      resultsQuantity: state => state.Search.resultsQuantity,
      offset: state => state.Search.offset,
      sortOptions: state => state.Search.sortOptions,
      sorting: state => state.Search.sorting
    }),
    resultsCount () {
      return `${this.$store.state.Search.resultsQuantity.quantity} ${this.$store.state.Search.resultsQuantity.unit}`
    }
  },
  methods: {
    close () {
      console.log('clicked on close results')
      this.opened = false
    },
    ...mapMutations({
      setSorting: 'Search/setSorting'
    }),
    ...mapActions({
      nextResultsBatch: 'Search/nextResultsBatch',
      updateSearch: 'Search/updateSearch'
    }),
    dropDownMenuPos (dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1]
            }
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({ state }) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            }
          }]
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    },
    onSortingSelected (o) {
      this.setSorting(o)
      this.updateSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
