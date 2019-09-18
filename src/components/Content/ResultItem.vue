<template>
  <article class="result item">
    <header>
      <h1>
        <a
          :href="result.url"
          @click.prevent="onclick"
          @keyup.enter="onclick"
          v-html="result.textId"
        />
      </h1>
    </header>
    <div class="extract" v-html="result.extract" />
  </article>
</template>

<script>
export default {
  name: 'ResultItem',
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  data: () => ({

  }),
  methods: {
    onclick () {
      console.log('clicked on result item', this.result)
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
