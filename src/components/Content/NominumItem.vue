<template>
  <article class="nominum item">
    <header>
      <h1>
        <a
          :href="item.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
        >
          <span class="title" v-html="item.title" /> <span class="quantity">[{{ item.texts.length }}]</span>
        </a>
      </h1>
    </header>
  </article>
</template>

<script>
export default {
  name: 'NominumItem',
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
      console.log('clicked on nominum item', this.item)
      this.$router.push({
        name: `nominum`,
        params: { id: this.item.uuid }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
