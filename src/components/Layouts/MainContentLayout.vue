<template>
  <div
    :id="id"
    class="full-width row main-content-layout"
  >
    <header class="col-3">
      <slot name="header" />
    </header>

    <section ref="scrollablecenter" class="col-6" @scroll.passive="onScrollCenter">
      <slot />
    </section>

    <nav class="col-3">
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
    reftoscrollto: { type: String }
  },
  watch: {
    reftoscrollto: function (newref, oldref) {
      console.log('reftoscrollto watcher', oldref, newref)
      this.scrollToRef()
    }
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
