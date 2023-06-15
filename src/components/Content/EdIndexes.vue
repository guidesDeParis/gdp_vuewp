<template>
  <div>
    <div
      v-for="(opts, key) in options"
      :key="key"
    >
      <v-select
        :id="key"
        type="select"
        :placeholder="placeholders[key]"
        append-to-body
        :calculate-position="dropDownMenuPos"
        :options="opts"
        :clearable="true"
        :value="getSeletedValue(key)"
        @input="onClickIndexItem"
      >
        <template v-slot:option="option">
          <span v-html="option.label" />
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>

import { createPopper } from '@popperjs/core'

export default {
  name: 'EdIndexes',
  props: {
    indexes: Object
  },
  data: () => ({
    options: {},
    indexes_keys: [],
    persons_selected: null,
    objects_selected: null,
    places_selected: null,
    placeholders: {
      objects: 'Filtrer par œuvres',
      persons: 'Filtrer par personnes',
      places: 'Filtrer par lieux'
    }
  }),
  watch: {
    persons_selected (n, o) {
      console.log('EdIndexes watch persons_selected', o, n)
    }
  },
  created () {
    this.parseIndexesToOptions()
  },
  methods: {
    parseIndexesToOptions () {
      console.log('EdIndexes parseIndexesToOptions', this.indexes)
      Object.keys(this.indexes).forEach(key => {
        // console.log('OPTION', key)
        this.indexes_keys.push(key)
        this.options[key] = []
        Object.keys(this.indexes[key]).forEach(uuid => {
          // console.log('OPTIONS ITEM', key, uuid)
          this.options[key].push({
            code: uuid,
            label: `${this.indexes[key][uuid].title} [${this.indexes[key][uuid].quantity}]`,
            index: key
          })
        })
        if (!this.options[key].length) {
          delete this.options[key]
        }
      })
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
    getSeletedValue (key) {
      return this[`${key}_selected`]
    },
    onClickIndexItem (o) {
      console.log('onClickIndexItem', o)
      this.indexes_keys.forEach(key => {
        if (o && key === o.index) {
          this[`${key}_selected`] = o
        } else {
          this[`${key}_selected`] = null
        }
      })
      // this.page_selected = o
      this.$emit('onClickIndexItem', o)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
