<template>
  <div class="textrefcopylink">
    <span class="mdi mdi-open-in-new" />
    <div class="popup">
      <button
        type="button"
        :title="btnuuidtitle"
        class="copy-btn"
        v-clipboard:copy="uuid"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >
        {{ uuid }} <span class="mdi mdi-clipboard-outline" />
      </button>
      <button
        type="button"
        :title="btnurltitle"
        class="copy-btn"
        v-clipboard:copy="linkhref"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
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
    uuid: String
  },
  computed: {
    linkhref () {
      return `${window.apipath}/items/${this.uuid}`
    },
    btnuuidtitle () {
      return `Copy to clipboard ${this.uuid}`
    },
    btnurltitle () {
      return `Copy to clipboard ${this.linkhref}`
    }
  },
  methods: {
    onCopy (e) {
      this.$swal({
        text: `copié dans le press papier : ${e.text}`,
        toast: true,
        position: 'bottom-end',
        timer: 2000,
        icon: 'success',
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
