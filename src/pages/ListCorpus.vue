<template>
  <MainContentLayout id="list-corpus">
    <template v-slot:header>
      <h1>Corpus</h1>
      <span v-if="!editionslist.length">Loading ...</span>
    </template>

    <ul v-if="editionslist.length" class="item-list">
      <li v-for="(corpus,index) in editionslist" :key="index">
        <h2>{{ corpus.meta.author }}</h2>
        <ul>
          <li v-for="text in corpus.content" :key="text.uuid">
            <h3>
              <a
                :href="text.url"
                :uuid="text.uuid"
                @click.prevent="onclick"
                @keyup.enter="onclick"
                v-html="text.title"
              />
            </h3>
          </li>
        </ul>
        <!-- <CorpusItem :item="item" /> -->
      </li>
    </ul>

    <template v-slot:nav />
  </MainContentLayout>
</template>

<script>

// import CorpusItem from '../components/Content/CorpusItem'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ListCorpus',
  components: {
    // CorpusItem,
    MainContentLayout
  },
  data: () => ({
    // editionslist: []
  }),
  computed: {
    ...mapState({
      editionslist: state => state.Corpus.editionslist
    })
  },
  created () {
    if (!this.editionslist.length) {
      this.getCorpuses()
    }
  },
  methods: {
    ...mapActions({
      getCorpuses: 'Corpus/getCorpuses'
    }),
    onclick (e) {
      console.log('clicked on editon', e)
      this.$router.push({
        name: `editiontoc`,
        params: { id: e.target.getAttribute('uuid') }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
