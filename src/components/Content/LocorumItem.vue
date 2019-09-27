<template>
  <article class="locorum item">
    <header>
      <h1>
        <a
          :href="item.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="item.title"
        />
      </h1>
    </header>
  </article>
</template>

<script>
export default {
  name: 'LocorumItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({

  }),
  methods: {
    onclick () {
      console.log('clicked on locorum item', this.item)
      // this.$router.push({
      //   name: `locorumItem`,
      //   query: { id: this.item.uuid }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
