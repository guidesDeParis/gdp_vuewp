<template>
  <MainContentLayout id="index-operum" class="index">
    <template v-slot:header>
      <h1>Œuvres</h1>
      <span v-if="!items.length" class="loading">Loading ...</span>
    </template>

    <ul v-if="items.length" class="item-list">
      <li
        v-for="item in items"
        :key="item.uuid"
        :class="{ hidden: activeLetter && item.letter !== activeLetter }"
      >

        <OperumItem :item="item" />
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
import OperumItem from '../components/Content/OperumItem'

export default {
  name: 'IndexOperum',
  metaInfo: {
    title: 'Index Operum'
  },
  components: {
    OperumItem,
    MainContentLayout
  },
  data: () => ({
    items: [],
    letters: [],
    activeLetter: null
  }),
  beforeCreate () {
    REST.get(`${window.apipath}/indexOperum`, {})
      .then(({ data }) => {
        console.log('index operum REST: data', data)
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
          if (this.letters.indexOf(this.items[i].letter.toLowerCase()) === -1) {
            this.letters.push(this.items[i].letter.toLowerCase())
          }
        }
        this.letters = this.letters.sort()
      })
      .catch((error) => {
        console.warn('Issue with index operum', error)
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
