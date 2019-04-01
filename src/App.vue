<template>
  <div id="root">
    <header role="banner">
      <h1>Les Guides de Paris</h1>
    </header>
    <section class="container center-content">
      <RouterView />
    </section>
    <footer role="search-bar" />
  </div>
</template>

<style lang="stylus" scoped>

.container
  font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
  max-width 1200px

</style>
