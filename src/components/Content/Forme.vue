<template>
  <section :class="{opened: isopened}">
    <h4>
      <a
        v-if="oc.title"
        :href="'/edition/'+oc.ed.uuid+'/'+oc.uuid+'/'+form"
        :uuid="oc.uuid"
        :eduuid="oc.ed.uuid"
        :form="form"
        @click.prevent="onGoToText"
        @keyup.enter="onGoToText"
      >
        <span v-html="oc.title" /> <span v-if="oc.ed.uuid" class="edition">( {{ editionTitle }} )</span>
        <!-- <span v-if="oc.form" class="form">( "{{ oc.form }}" )</span> -->
      </a>
    </h4>
    <!-- <span
      class="open-close"
      @click.prevent="onOpenPreview"
      @keyup.enter="onOpenPreview"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" class="vs__open-indicator">
        <path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" />
      </svg>
    </span> -->
    <!-- <div v-if="content" class="text" v-html="tei" /> -->
    <!-- <a
      v-if="content"
      class="lire-plus"
      :href="'/edition/'+ed.item+'/'+oc.uuid"
      :uuid="oc.uuid"
      :eduuid="ed.item"
      @click.prevent="onGoToText"
      @keyup.enter="onGoToText"
    >
      lire plus
    </a> -->
  </section>
</template>
<script>

// import { REST } from 'api/rest-axios'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Occurence',
  props: {
    form: String,
    oc: Object
  },
  data: () => ({
    content: null,
    isopened: false,
    tei: ''
  }),
  computed: {
    ...mapState({
      editionsbyuuid: state => state.Corpus.editionsbyuuid
    }),
    editionTitle () {
      return this.editionsbyuuid[this.oc.ed.uuid].title
    }
  },
  created () {
    console.log('occurence beforeCreate')
    // REST.get(`${window.apipath}/items/` + this.oc.uuid, {})
    //   .then(({ data }) => {
    //     console.log('occurence text REST: data', data)
    //     if (data.content) {
    //       this.content = data.content
    //       const subString = this.content.tei.substr(0, 500)
    //       this.tei = subString.substr(0, subString.lastIndexOf(' ')) + ' &hellip;'
    //     }
    //   })
    //   .catch((error) => {
    //     console.warn('Issue with nominum', error)
    //     Promise.reject(error)
    //   })
  },
  methods: {
    ...mapActions({
      addHistoryItem: 'History/addItem'
    }),
    onGoToText (e) {
      console.log('clicked on text occurence', e, this.oc.title, this.oc.ed)

      if (e.target.getAttribute('eduuid')) {
        this.addHistoryItem({
          id: e.target.getAttribute('eduuid'),
          textid: e.target.getAttribute('uuid'),
          title: this.oc.title,
          editionTitle: this.editionTitle
        })
        // if (e.target.getAttribute('form')) {
        //   this.$router.push({
        //     name: `editiontext`,
        //     params: {
        //       id: e.target.getAttribute('eduuid'),
        //       textid: e.target.getAttribute('uuid')
        //     }
        //   })
        // } else {
        this.$router.push({
          name: `editiontextextract`,
          params: {
            id: e.target.getAttribute('eduuid'),
            textid: e.target.getAttribute('uuid'),
            extract: e.target.getAttribute('form')
          }
        })
        // }
      } else {
        this.$router.push({
          name: `edition`,
          params: {
            id: e.target.getAttribute('uuid')
          }
        })
      }
    },
    onOpenPreview (e) {
      this.isopened = !this.isopened
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
