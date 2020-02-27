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
    <section>
      <p class="author">{{ item.author }}</p>
      <p class="date">{{ item.date }}</p>
      <p class="editions-quantity">{{ item.editionsQuantity }}</p>
      <p class="text-quantity">{{ item.textsQuantity }}</p>
      <div class="edition" v-html="item.editions" />
    </section>
  </article>
</template>

<script>
export default {
  name: 'CorpusItem',
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
      this.$router.push({
        name: `corpus`,
        params: { id: this.item.uuid }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
