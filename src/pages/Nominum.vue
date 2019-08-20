<template>
  <div
    id="nominum"
    class="full-width"
  >
    <h1>Nominum</h1>
    <span v-if="!items.length">Loading ...</span>
  </div>
</template>

<script>

import { REST } from 'api/rest-axios'

export default {
  name: 'Nominum',
  data: () => ({
    items: []

  }),
  beforeCreate () {
    // items/gdpLeMaire1685T01BodyFr01.003.016
    // texts/gdpSauval1724
    REST.get(`/indexNominum`, {})
      .then(({ data }) => {
        console.log('nominum REST: data', data)
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
        console.warn('Issue with nominum', error)
        Promise.reject(error)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
