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
      </fieldset>
      <fieldset v-if="filtersNominum.length" class="filters filters-nominum col-3">
        <v-select
          id="filters-nominum"
          type="select"
          placeholder="filtrer par personne"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="filtersNominum"
          :value="filtersNominumValue"
          multiple
          @input="onFiltersNominumSelected"
        />
      </fieldset>
      <fieldset v-if="filtersLocorum.length" class="filters filters-locorum col-3">
        <v-select
          id="filters-locorum"
          type="select"
          placeholder="filtrer par lieux"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="filtersLocorum"
          :value="filtersLocorumValue"
          multiple
          @input="onFiltersLocorumSelected"
        />
      </fieldset>
      <fieldset v-if="filtersOperum.length" class="filters filters-operum col-3">
        <v-select
          id="filters-operum"
          type="select"
          placeholder="filtrer par objet"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="filtersOperum"
          :value="filtersOperumValue"
          multiple
          @input="onFiltersOperumSelected"
        />
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
      searchTypeValue: state => state.Search.searchTypeValue,
      filtersNominum: state => state.Search.filtersNominum,
      filtersLocorum: state => state.Search.filtersLocorum,
      filtersOperum: state => state.Search.filtersOperum,
      filtersNominumValue: state => state.Search.filtersNominumValue,
      filtersLocorumValue: state => state.Search.filtersLocorumValue,
      filtersOperumValue: state => state.Search.filtersOperumValue
    })
  },
  methods: {
    ...mapActions({
      getResults: 'Search/getResults',
      setSearchTypeValue: 'Search/setSearchTypeValue',
      setSearchFiltersValue: 'Search/setSearchFiltersValue'
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
    },
    onFiltersNominumSelected (e) {
      console.log('onFiltersNominumSelected', e)
      this.setSearchFiltersValue({ index: 'nominum', value: e })
    },
    onFiltersLocorumSelected (e) {
      console.log('onFiltersLocorumSelected', e)
      this.setSearchFiltersValue({ index: 'locorum', value: e })
    },
    onFiltersOperumSelected (e) {
      console.log('onFiltersOperumSelected', e)
      this.setSearchFiltersValue({ index: 'operum', value: e })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
