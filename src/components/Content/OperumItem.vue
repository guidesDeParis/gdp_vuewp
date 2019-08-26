<template>
  <article class="operum item">
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
  name: 'OperumItem',
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
      console.log('clicked on Operum item', this.item)
      this.$router.push({
        name: `operuumItem`,
        query: { id: this.item.uuid }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
