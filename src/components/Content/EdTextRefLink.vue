<template>
  <div class="textrefcopylink">
    <span class="mdi mdi-open-in-new" />
    <div class="popup">
      <button
        v-clipboard:copy="uuid"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        type="button"
        :title="btnuuidtitle"
        class="copy-btn"
      >
        <!-- todo better label -->
        {{ uuid }} <span class="mdi mdi-clipboard-outline" />
      </button>
      <button
        v-clipboard:copy="linkhref"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        type="button"
        :title="btnurltitle"
        class="copy-btn"
      >
        {{ linkhref }} <span class="mdi mdi-clipboard-outline" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EdTextRefLink',
  props: {
    uuid: String,
    url: String
  },
  computed: {
    linkhref () {
      // return `${window.apipath}/items/${this.uuid}`
      return this.url
    },
    btnuuidtitle () {
      return `Copy to clipboard ${this.uuid}`
    },
    btnurltitle () {
      return `Copy to clipboard ${this.url}`
    }
  },
  methods: {
    onCopy (e) {
      this.$swal({
        text: `copié dans le press papier : ${e.text}`,
        toast: false,
        position: 'bottom-end',
        timer: 2000,
        icon: null,
        backdrop: false,
        showConfirmButton: false
      })
    },
    onError (e) {
      this.$swal('erreur')
    }
    // onClickCopyClipboard (e, s) {
    //   e.preventDefault()
    //   console.log('onClickCopyClipboard', s, e)
    //   // navigator.clipboard.writeText(e.target.getAttribute('href'))
    //   this.$copyText(s === 'ref' ? this.uuid : this.linkhref)
    //     .then(function (r) {
    //       console.log(this, r)
    //       // alert('Copied')
    //       this.$swal(`${s === 'ref' ? this.uuid : this.linkhref} copied`)
    //     }, function (r) {
    //       console.log(r)
    //       alert('Can not copy')
    //     })
    //   return false
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
