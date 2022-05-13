<template>
  <div
    :id="id"
    class="full-width med-row large-row main-content-layout"
  >
    <header class="med-col-3 large-col-3">
      <slot name="header" />
    </header>

    <section
      class="med-col-6 large-col-6"
    >
      <div
        ref="scrollablecenter"
        class="wrapper"
        @scroll.passive="onScrollCenter"
      >
        <slot />
      </div>
    </section>

    <nav class="med-col-3 large-col-3" :class="{ opened: navopened }">
      <slot name="nav" />
    </nav>

  </div>
</template>

<script>
export default {
  name: 'MainContentLayout',
  props: {
    id: {
      type: String,
      required: true
    },
    reftoscrollto: { type: String },
    navopened: { type: Boolean }
  },
  watch: {
    reftoscrollto: function (newref, oldref) {
      console.log('MainLayout reftoscrollto watcher', oldref, newref)
      this.scrollToRef()
    }
  },
  mounted () {
    console.log('mounted')
    this.scrollToRef()
  },
  methods: {
    onScrollCenter (e) {
      // console.log('mainLayout onScrollCenter: e', e)
      this.$emit('onCenterScrolled', e)
    },
    scrollToRef () {
      console.log('scrollToRef', this.reftoscrollto, this.$refs)
      this.$scrollTo(this.reftoscrollto, 500, {
        container: this.$refs.scrollablecenter
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
