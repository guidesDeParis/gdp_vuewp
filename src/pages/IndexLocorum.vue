<template>
  <MainContentLayout id="index-locorum" class="index">
    <template v-slot:header>
      <h1>Lieux</h1>
      <span v-if="!items.length" class="loading">Chargement ...</span>
      <span v-else>{{ meta.quantity.quantity }} {{ meta.quantity.unit }}</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li
        v-for="item in items"
        :key="item.uuid"
        :class="{ hidden: activeLetter && item.letter !== activeLetter }"
      >
        <LocorumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav>
      <div v-if="items.length" class="abc">
        <ul>
          <li :class="{ inactive: activeLetter }">
            <span
              class="tout"
              @click.prevent="onClickLetter(null)"
              @keyup.enter="onClickLetter(null)"
            >tout</span>
            <span class="quantity">[{{ items.length }}]</span>
          </li>
          <li
            v-for="l in letters" :key="l.l"
            :class="{ inactive: activeLetter && l.l !== activeLetter }"
          >
            <span
              class="letter"
              @click.prevent="onClickLetter(l.l)"
              @keyup.enter="onClickLetter(l.l)"
            >{{ l.l }}</span>
            <span class="quantity">[{{ l.q }}]</span>
          </li>
        </ul>

      </div>
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import qs from 'querystring'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import LocorumItem from '../components/Content/LocorumItem'

export default {
  name: 'IndexLocorum',
  metaInfo: {
    title: 'Index Locorum'
  },
  components: {
    LocorumItem,
    MainContentLayout
  },
  data: () => ({
    items: [],
    letters: {},
    activeLetter: null,
    meta: null,
    content: []
  }),
  created () {
    this.loadIndex(1, 200)
  },
  methods: {
    loadIndex (start, count) {
      console.log('loadIndex', start, count)
      // construct params
      let params = {
        start: start,
        count: count
      }
      let q = qs.stringify(params)
      REST.get(`${window.apipath}/indexLocorum?` + q, {})
        .then(({ data }) => {
          console.log('index locorum REST: data', data)
          this.meta = data.meta
          this.content = this.content.concat(data.content)
          if (this.content.length < data.meta.quantity.quantity) {
            this.loadIndex(start + count, count)
          } else {
            this.parseIndex()
          }
        })
        .catch((error) => {
          console.warn('Issue with index locorum', error)
          Promise.reject(error)
        })
    },
    parseIndex () {
      console.log('parseIndex', this.content)
      if (this.content.length) {
        this.items = this.content.sort((a, b) => {
          let Aletter = a.letter.toLowerCase()
          let Bletter = b.letter.toLowerCase()
          if (Aletter < Bletter) {
            return -1
          } else if (Aletter > Bletter) {
            return 1
          } else {
            return 0
          }
        })
      }
      for (let i = 0; i < this.items.length; i++) {
        // console.log(typeof this.items[i].letter)
        if (this.items[i].letter !== '') {
          let letter = this.items[i].letter.toLowerCase()
          console.log(letter)
          if (Object.keys(this.letters).indexOf(letter) === -1) {
            this.letters[letter] = {
              l: letter,
              q: 1
            }
          } else {
            this.letters[letter].q += 1
          }
        }
      }
      // console.log(this.letters)
      // this.letters = this.letters.sort((a, b) => {
      //   if (a.l < b.l) {
      //     return -1
      //   } else if (a.l > b.l) {
      //     return 1
      //   } else {
      //     return 0
      //   }
      // })
    },
    onClickLetter (l) {
      this.activeLetter = l
      // console.log('activeLetter', this.activeLetter)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
