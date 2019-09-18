<template>
  <article class="nominum item">
    <header>
      <h1>
        <a
          :href="item.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="item.title"
        />
      </h1>
      <p v-if="item.birth && item.death">
        <span>{{ item.birth }}</span> -- <span>{{ item.death }}</span>
      </p>
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
        name: `nominumItem`,
        query: { id: this.item.uuid }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
