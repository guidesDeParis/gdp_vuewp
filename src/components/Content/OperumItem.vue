<template>
  <article class="operum item">
    <header>
      <h1>

        <a
          v-if="item.uuid"
          :href="item.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
        >
          <span class="title" v-html="item.title" /> <span class="quantity">[{{ item.texts.length }}]</span>
        </a>
        <span v-else class="red">
          {{ item.title }}
        </span>
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
      if (this.item.uuid) {
        this.$router.push({
          name: `operum`,
          params: { id: this.item.uuid }
        })
      } else {
        console.warn('no uuid', this.item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
