<template>
  <div id="text">
    <!-- <h1>{{ textdata.meta.title }}</h1> -->
    <div class="tei" v-html="textdata.content.tei" />
  </div>
</template>

<script>
export default {
  name: 'EdText',
  props: {
    textdata: Object
  },
  data: () => ({

  })
}
</script>

<style lang="scss" scoped>
</style>
