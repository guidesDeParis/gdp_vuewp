<template>
  <div id="search" class="col-11">
    <form class="search-form row">
      <fieldset class="search col-3">
        <div>
          <label for="keys">Search</label>
          <input
            id="keys"
            v-model="keys"
            type="text"
            placeholder="search"
            @keydown.enter.prevent="submit"
          >
          <v-select
            id="search-type"
            type="select"
            placeholder="dans ..."
            append-to-body
            :calculate-position="dropDownMenuPos"
            :options="searchTypeOptions"
            :clearable="false"
            :value="searchTypeValue"
            @input="onSearchTypeSelected"
          />
        </div>

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
      </fieldset>
      <fieldset class="filters-nominum col-3">
        <span>Filters Nominum</span>
      </fieldset>
      <fieldset class="filters-locorum col-3">
        <span>Filters Nominum</span>
      </fieldset>
      <fieldset class="filters-operum col-3">
        <span>Filters Nominum</span>
      </fieldset>
    </form>
  </div>
</template>

<script>

import { createPopper } from '@popperjs/core'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'Search',
  data: () => ({
  }),
  computed: {
    keys: {
      get () { return this.$store.state.Search.keys },
      set (value) { this.$store.commit('Search/setKeys', value) }
    },
    ...mapState({
      isloading: state => state.Search.isloading,
      searchTypeOptions: state => state.Search.searchTypeOptions,
      searchTypeValue: state => state.Search.searchTypeValue
    })
  },
  methods: {
    ...mapActions({
      getResults: 'Search/getResults',
      setSearchTypeValue: 'Search/setSearchTypeValue'
    }),
    submit () {
      console.log('submited', this.keys)
      this.getResults()
    },
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
    onSearchTypeSelected (e) {
      console.log('onSearchTypeSelected', e)
      this.setSearchTypeValue(e)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
