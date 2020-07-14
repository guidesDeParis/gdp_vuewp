<template>
  <div
    id="bibliographie"
    class="full-width"
  >
    <h1>Bibliographie</h1>
  </div>
</template>

<script>

import { REST } from 'api/rest-axios'

export default {
  name: 'Bibliographie',
  metaInfo: {
    title: 'Bibliographie'
  },
  data: () => ({

  }),
  beforeCreate () {
    // ?_format=json
    REST.get(`${apipath}/bibliography/works`, {})
      .then(({ data }) => {
        console.log('Biblio REST: data', data)
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
