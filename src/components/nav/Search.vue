<template>
  <div id="search" class="" :class="[isloading ? loading : '', wrapperClass]">
    <form class="search-form row">
      <fieldset class="" :class="['search', 'small-col-10', firstFieldsetClass]">
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
      <fieldset v-if="filters.texts.length" class="filters filters-texts small-col-4 med-col-4 large-col-4">
        <v-select
          id="filters-texts"
          type="select"
          placeholder="filtrer par texte"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="textsOptions"
          :value="activeFilters.texts"
          @input="onFiltersTextSelected"
        />
      </fieldset>
      <fieldset v-if="filters.persons.length" class="filters filters-nominum small-col-4 med-col-2 large-col-2">
        <v-select
          id="filters-nominum"
          type="select"
          placeholder="filtrer par personne"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="personsOptions"
          :value="activeFilters.persons"
          multiple
          @input="onFiltersNominumSelected"
        />
      </fieldset>
      <fieldset v-if="filters.places.length" class="filters filters-locorum small-col-4 med-col-2 large-col-2">
        <v-select
          id="filters-locorum"
          type="select"
          placeholder="filtrer par lieux"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="placesOptions"
          :value="activeFilters.places"
          multiple
          @input="onFiltersLocorumSelected"
        />
      </fieldset>
      <fieldset v-if="filters.objects.length" class="filters filters-operum small-col-4 med-col-2 large-col-2">
        <v-select
          id="filters-operum"
          type="select"
          placeholder="filtrer par objet"
          append-to-body
          :calculate-position="dropDownMenuPos"
          :options="objectsOptions"
          :value="activeFilters.objects"
          multiple
          @input="onFiltersOperumSelected"
        />
      </fieldset>
    </form>
  </div>
</template>

<script>

import { createPopper } from '@popperjs/core'

import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'Search',
  data: () => ({
  }),
  computed: {
    ...mapState({
      isloading: state => state.Search.isloading,
      searchTypeOptions: state => state.Search.searchTypeOptions,
      searchTypeValue: state => state.Search.searchTypeValue,
      filters: state => state.Search.filters,
      activeFilters: state => state.Search.activeFilters,
      corpusLoaded: state => state.Corpus.corpusLoaded,
      results: state => state.Corpus.results
    }),
    // TODO: do not synch keys instantetly (infinite loading will drop)
    wrapperClass () {
      console.log('this.$route.name', this.$route.name)
      if (this.$route.name === 'home' && (!this.results || !this.results.length)) {
        return 'col-4'
      } else {
        return 'col-11'
      }
    },
    firstFieldsetClass () {
      return (this.$route.name === 'home' && (!this.results || !this.results.length)) ? 'med-col-10 large-col-10' : 'med-col-4 large-col-4'
    },
    keys: {
      get () { return this.$store.state.Search.keys },
      set (value) { this.$store.commit('Search/setKeys', value) }
    },
    personsOptions () {
      return this.filters.persons.filter(option => !this.activeFilters.persons.includes(option))
    },
    placesOptions () {
      return this.filters.places.filter(option => !this.activeFilters.places.includes(option))
    },
    objectsOptions () {
      return this.filters.objects.filter(option => !this.activeFilters.objects.includes(option))
    },
    textsOptions () {
      return this.filters.texts.filter(option => !this.activeFilters.texts.includes(option))
    }

  },
  methods: {
    ...mapMutations({
      setSearchTypeValue: 'Search/setSearchTypeValue',
      setActiveFilters: 'Search/setActiveFilters'
    }),
    ...mapActions({
      newSearch: 'Search/newSearch',
      updateSearch: 'Search/updateSearch'
    }),
    submit () {
      // console.log('submited', this.keys)
      this.newSearch()
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
      this.setActiveFilters({ filter: 'persons', value: e })
      this.updateSearch()
    },
    onFiltersLocorumSelected (e) {
      console.log('onFiltersLocorumSelected', e)
      this.setActiveFilters({ filter: 'places', value: e })
      this.updateSearch()
    },
    onFiltersOperumSelected (e) {
      console.log('onFiltersOperumSelected', e)
      this.setActiveFilters({ filter: 'objects', value: e })
      this.updateSearch()
    },
    onFiltersTextSelected (e) {
      console.log('onFiltersTextSelected', e)
      // as texts is not multiple, convert one object value to array [e]
      this.setActiveFilters({ filter: 'texts', value: e ? [e] : [] })
      this.updateSearch()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
