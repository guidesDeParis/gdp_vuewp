<template>
  <div
    :id="id"
    class="full-width row"
  >
    <header class="col-3">
      <slot name="header" />
    </header>

    <section class="col-6">
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
