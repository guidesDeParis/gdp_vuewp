<template>
  <div
    id="corpus"
    class="full-width"
  >
    <h1>Corpus</h1>
    <span v-if="!items.length">Loading ...</span>
  </div>
</template>

<script>

import { REST } from 'api/rest-axios'

export default {
  name: 'Corpus',
  data: () => ({
    items: []
  }),
  beforeCreate () {
    // items/gdpLeMaire1685T01BodyFr01.003.016
    // texts/gdpSauval1724
    REST.get(`/corpus`, {})
      .then(({ data }) => {
        console.log('corpus REST: data', data)
        // if(data.length){
        //   commit('setItems',data)
        //   // console.log('items.length', this.items.length);
        //   if(state.infiniteLoadingState)
        //     state.infiniteLoadingState.loaded()
        // }else{
        //   if(state.infiniteLoadingState)
        //     state.infiniteLoadingState.complete()
        // }
      })
      .catch((error) => {
        console.warn('Issue with corpus', error)
        Promise.reject(error)
      })
  }
}
</script>
<style lang="scss" scoped>
</style>
