<template>
  <div
    id="operum"
    class="full-width"
  >
    <h1>Operum</h1>
    <span v-if="!items.length">Loading ...</span>
  </div>
</template>

<script>

import { REST } from 'api/rest-axios'

export default {
  name: 'Operum',
  data: () => ({
    items: []

  }),
  beforeCreate () {
    // ?_format=json
    REST.get(`/indexOperum`, {})
      .then(({ data }) => {
        console.log('operum REST: data', data)
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
        console.warn('Issue with operum', error)
        Promise.reject(error)
      })
  }
}
</script>
<style lang="scss" scoped>
</style>
