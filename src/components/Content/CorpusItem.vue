<template>
  <article class="corpus item">
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
    <div class="text-quantity" v-html="item.textsQuantity"/>
  </article>
</template>

<script>
export default {
  name: 'CorpusItems',
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
      console.log('clicked on corpus item', this.item)
      // this.$router.push({
      //   name:`article`,
      //   params: { alias:this.alias },
      //   query: { uuid: this.item.uuid }
      //   // meta: { uuid:this.item.uuid },
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
