<template>
  <div id="history" class="row">
    <header class="col-1">
      <h2>Historique de consultation</h2>
    </header>
    <section class="col-10 history-list">
      <div class="wrapper">
        <ul>
          <li>item</li>
        </ul>
      </div>
    </section>
    <nav class="col-1 tools">
      <span
        class="mdi mdi-close"
        title="close"
        @click.prevent="close"
        @keydown.enter.prevent="close"
      />
    </nav>
  </div>
</template>
<script>
export default {
  name: 'History',
  data: () => ({

  }),
  methods: {
    close () {
      console.log('clicked on close history')
      // this.opened = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
