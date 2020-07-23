<template>
  <div v-if="options.length">
    <!-- <select class="" name="page-nav" v-model="page_selected" placeholder="Pages">
      <option value="" disabled selected>Pages</option>
      <option v-for="(page, index) in pages" :key="index" :value="page">{{ page }}</option>
    </select> -->
    <v-select
      id="page-nav-select"
      type="select"
      placeholder="Aller à la page ..."
      append-to-body
      :calculate-position="dropDownMenuPos"
      :options="options"
      :clearable="false"
      :value="page_selected"
      :selectable="option => ! option.disabled"
      @input="onClickPaginationItem"
    >
      <template v-slot:option="option">
        <span v-for="l in option.level" :key="l" class="op-tab" />
        {{ option.label }}
      </template>
    </v-select>
  </div>
</template>

<script>

import { createPopper } from '@popperjs/core'

export default {
  name: 'EdPagination',
  props: {
    pagination: Array
  },
  data: () => ({
    options: [],
    page_selected: ''
  }),
  created () {
    this.parsePagesToOptions(this.pagination)
  },
  // watch: {
  //   loadedtextsuuids (n, o) {
  //     console.log('EdToc watch loadedtxtsuuids', o, n)
  //   }
  // },
  methods: {
    parsePagesToOptions (p, i = 0, l = 0) {
      // console.log('EdPagination parsePagesToOptions', p)
      for (var j = 0; j < p.length; j++) {
        // if it is just a section without page like a volume
        if (p[j].text) {
          this.options.push({
            key: i,
            code: p[j].text,
            label: p[j].text,
            disabled: true,
            level: l
          })
        }
        // if it's a real page break
        if (p[j].pageBreak) {
          this.options.push({
            key: i,
            code: p[j].pageBreak,
            label: p[j].pageNum,
            uuid: p[j].uuid,
            level: l
          })
        }
        if (p[j].pages && p[j].pages.length) {
          this.parsePagesToOptions(p[j].pages, i++, l + 1)
        } else {
          i++
        }
      }
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
    onClickPaginationItem (o) {
      this.page_selected = o
      this.$emit('onClickPaginationItem', o)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
