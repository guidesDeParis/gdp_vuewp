<template>
  <MainContentLayout id="index-nominum" class="index">
    <template v-slot:header>
      <h1>Personnes</h1>
      <span v-if="!items.length" class="loading">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li
        v-for="item in items"
        :key="item.url"
        :class="{ hidden: activeLetter && item.letter !== activeLetter }"
      >
        <NominumItem :item="item" />
      </li>
    </ul>

    <template v-slot:nav>
      <div v-if="items.length" class="abc">
        <ul>
          <li :class="{ inactive: activeLetter }">
            <span
              @click.prevent="onClickLetter(null)"
              @keyup.enter="onClickLetter(null)"
            >tout</span>
          </li>
          <li
            v-for="l in letters" :key="l"
            :class="{ inactive: activeLetter && l !== activeLetter }"
          >
            <span
              @click.prevent="onClickLetter(l)"
              @keyup.enter="onClickLetter(l)"
            >{{ l }}</span>
          </li>
        </ul>

      </div>
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'
import NominumItem from '../components/Content/NominumItem'

export default {
  name: 'IndexNominum',
  metaInfo: {
    title: 'Index Nominum'
  },
  components: {
    NominumItem,
    MainContentLayout
  },
  data: () => ({
    items: [],
    letters: [],
    activeLetter: null
  }),
  beforeCreate () {
    // items/gdpLeMaire1685T01BodyFr01.003.016
    // texts/gdpSauval1724
    REST.get(`${window.apipath}/indexNominum`, {})
      .then(({ data }) => {
        console.log('index nominum REST: data', data)
        if (data.content.length) {
          this.items = data.content.sort((a, b) => {
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
          if (this.items[i].letter !== '' && this.letters.indexOf(this.items[i].letter.toLowerCase()) === -1) {
            this.letters.push(this.items[i].letter.toLowerCase())
          }
        }
        this.letters = this.letters.sort()
      })
      .catch((error) => {
        console.warn('Issue with index nominum', error)
        Promise.reject(error)
      })
  },
  methods: {
    onClickLetter (l) {
      this.activeLetter = l
      // console.log('activeLetter', this.activeLetter)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
