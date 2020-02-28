<template>
  <section
    :uuid="item.uuid"
    :level="level"
  >
    <component
      :is="titlelevel"
      v-if="title"
      class="toc-title"
      :uuid="item.uuid"
    >
      <a
        :href="'/edition/'+editionid+'/'+item.uuid"
        :uuid="item.uuid"
        @click.prevent="onclick"
        @keyup.enter="onclick"
      >
        {{ title }}
      </a>
    </component>
    <ul v-if="children.length">
      <li v-for="child in children" :key="child.uuid">
        <TocItem :item="child" :level="nextLevel" :editionid="editionid" />
      </li>
    </ul>
  </section>
</template>

<script>

import TocItem from './TocItem'

export default {
  name: 'TocItem',
  components: {
    TocItem
  },
  props: {
    item: Object,
    level: Number,
    editionid: String
  },
  // data: () => ({
  //
  // })
  computed: {
    children () {
      // check if children exists and if it is an array
      // this shoudn't be necessary
      return this.item.children ? Array.isArray(this.item.children) ? this.item.children : [this.item.children] : []
    },
    title () {
      // this shoudn't be necessary
      if (this.item.title && Array.isArray(this.item.title)) {
        return this.item.title.join(' ')
      } else {
        return this.item.title
      }
    },
    titlelevel () {
      return 'h' + this.level
    },
    nextLevel () {
      return this.level + 1
    }
  },
  // beforeCreate () {
  //   console.log('editionid', this.editionid)
  // },
  methods: {
    onclick (e) {
      console.log('clicked on toc text', this.editionid, e)
      this.$router.push({
        name: `editiontoctext`,
        params: {
          id: this.editionid,
          textid: e.target.getAttribute('uuid')
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
