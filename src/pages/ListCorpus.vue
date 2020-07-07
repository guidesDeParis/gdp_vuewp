<template>
  <MainContentLayout id="list-corpus">
    <template v-slot:header>
      <h1>Corpus</h1>
      <span v-if="!editionslist.length">Loading ...</span>
    </template>

    <ul v-if="editionslist.length" class="item-list">
      <li v-for="(corpus,index) in editionslist" :key="index">
        <header>
          <h2>{{ corpus.author.title }}</h2>
          <h3>{{ corpus.author.date }}</h3>
        </header>
        <section class="editions">
          <h4 class="editions-quantity">
            {{ corpus.author.editionsQuantity.quantity }} {{ corpus.author.editionsQuantity.unit }}
          </h4>
          <!-- <div v-if="corpus.author.editions" class="editions" v-html="corpus.author.editions"/> -->
        </section>
        <section class="texts">
          <h4 class="texts-quantity">
            {{ corpus.author.textsQuantity.quantity }}
            {{ corpus.author.textsQuantity.unit }}
          </h4>
          <ul class="texts-list">
            <li v-for="text in corpus.editions.content" :key="text.uuid">
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
        </section>
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
        name: `edition`,
        params: { id: e.target.getAttribute('uuid') }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
