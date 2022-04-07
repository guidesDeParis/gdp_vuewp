<template>
  <MainContentLayout id="biblio">
    <template v-if="!content" #header>
      <span class="loading">Loading ...</span>
    </template>
    <template #header>
      <h1>
        <router-link :to="{ name:'bibliographie'}">Bibliographie</router-link>
      </h1>
      <nav>
        <ul>
          <li>
            <router-link
              :to="{ name:'bibliographie', params: { type: 'expressions'}}"
            >
              Expressions
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name:'bibliographie', params: { type: 'manifestations'}}"
            >
              Manifestations
            </router-link>
          </li>
        </ul>
      </nav>
    </template>

    <!-- default slot -->
    <!-- expressions list -->
    <template v-if="!uuid && type === 'expressions'">
      <ul class="item-list">
        <li v-for="item in expressions" :key="item.uuid">
          <h2>
            <router-link
              v-if="item.authors"
              :to="{ name:'bibliographieItem', params:{ type:type, uuid:item.uuid } }"
            >
              {{ item.authors }}
            </router-link>
            <span v-else>/!\ No authors /!\</span>
          </h2>
          <p class="date">{{ item.dates }}</p>
          <em class="titles">{{ item.titles }}</em>
          <aside v-if="item.manifestations.length">
            <h5
              @click.prevent="onToggleManifs"
              @keyup.enter="onToggleManifs"
            >Manifestations</h5>
            <ul>
              <li v-for="manif in item.manifestations" :key="manif.uuid">
                <span class="date">{{ manif.dates }} </span>
                <router-link
                  :to="{ name:'bibliographieItem', params:{ type:'manifestations', uuid:manif.uuid } }"
                >
                  <em>{{ manif.titles }}</em>
                </router-link>
              </li>
            </ul>
          </aside>
        </li>
      </ul>
    </template>
    <!-- manifestations list -->
    <template v-if="!uuid && type === 'manifestations'">
      <ul class="item-list manifestations">
        <li
          v-for="item in manifestations" :key="item.uuid"
          :class="isInActiveAuthors(item.authors)"
        >
          <div class="wrapper">
            <span class="date">{{ item.dates }} </span>
            <router-link
              :to="{ name:'bibliographieItem', params:{ type:'manifestations', uuid:item.uuid } }"
            >
              <em class="titles">{{ item.titles }}</em>
            </router-link>
            <!-- <p class="authors">{{ item.authors }}</p> -->
          </div>
        </li>
      </ul>
    </template>
    <!-- or item -->
    <template v-else>
      <div class="biblio-item">
        <h2>{{ item.authors }}</h2>
        <p v-if="item.dates" class="date">{{ item.dates }}</p>
        <p class="titles">{{ item.titles }}</p>
        <p class="tei">{{ item.tei }}</p>
        <ul vi-if="item.manifestations.length" class="item-list">
          <li v-for="manif in item.manifestations" :key="manif.uuid">
            <router-link
              :to="{ name:'bibliographieItem', params:{ type:'manifestations', uuid:manif.uuid } }"
              v-html="manif.tei"
            />
          </li>
        </ul>
        <ul vi-if="item.idno.length" class="item-list">
          <li v-for="id in item.idno" :key="id.url">
            <a :href="id.url">{{ id.type }}: {{ id.url }}</a>
          </li>
        </ul>
      </div>
    </template>
    <template #nav>
      <ul v-if="!uuid && type === 'manifestations'" class="authors-filters">
        <li
          v-for="author in authors" :key="author"
        >
          <span
            :class="isInActiveAuthors(author)"
            @click.prevent="onToggleAuthors(author)"
            @keyup.enter="onToggleAuthors(author)"
          >{{ author }}</span>
        </li>
      </ul>
    </template>
  </MainContentLayout>
</template>

<script>

import { REST } from 'api/rest-axios'
import MainContentLayout from '../components/Layouts/MainContentLayout'

export default {
  name: 'Bibliographie',
  components: {
    MainContentLayout
  },
  metaInfo: {
    title: 'Bibliographie'
  },
  props: {
    type: String,
    uuid: String
  },
  data: () => ({
    content: Array,
    manifestations: Array,
    expressions: Array,
    authors: Array,
    activeAuthors: Array,
    item: Array
  }),
  computed: {
  },
  watch: {
    $route (to, from) {
      console.log('watch $route to', to)
      // this.getContent()
      if (to.params.uuid) {
        this.getItem(to.params.type, to.params.uuid)
      }
    }
  },
  created () {
    // this.type = this.$route.params.type || 'expressions'
    // this.uuid = this.$route.params.id || null
    this.activeAuthors = []
    this.getContent()
    if (this.$route.params.uuid) {
      this.getItem(this.$route.params.type, this.$route.params.uuid)
    }
  },
  methods: {
    getContent () {
      REST.get(`${window.apipath}/bibliography/expressions`, {})
        .then(({ data }) => {
          console.log('Biblio REST expressions: data', data)
          if (data.content) {
            this.expressions = data.content
            REST.get(`${window.apipath}/bibliography/manifestations`, {})
              .then(({ data }) => {
                console.log('Biblio REST manifestations: data', data)
                if (data.content) {
                  this.manifestations = data.content
                }
                this.parseContents()
              })
              .catch((error) => {
                console.warn('Issue with bibliographie manifestations', error)
                Promise.reject(error)
              })
          }
        })
        .catch((error) => {
          console.warn('Issue with bibliographie expressions', error)
          Promise.reject(error)
        })
      // // ?_format=json
      // REST.get(`${window.apipath}/bibliography/${this.type}/${this.uuid || ''}`, {})
      //   .then(({ data }) => {
      //     console.log('Biblio REST: data', data)
      //     if (data.content) {
      //       this.content = data.content
      //     }
      //   })
      //   .catch((error) => {
      //     console.warn('Issue with bibliographie', error)
      //     Promise.reject(error)
      //   })
    },
    getItem (type, uuid) {
      REST.get(`${window.apipath}/bibliography/${type}/${uuid}`, {})
        .then(({ data }) => {
          console.log('Biblio REST item: data', data)
          if (data.content) {
            this.item = data.content
          }
        })
        .catch((error) => {
          console.warn('Issue with bibliographie get item', error)
          Promise.reject(error)
        })
    },
    parseContents () {
      this.expressions = this.expressions.sort((a, b) => {
        let Adate = parseInt(a.dates)
        let Bdate = parseInt(b.dates)
        if (Adate < Bdate) {
          return -1
        } else if (Adate > Bdate) {
          return 1
        } else {
          return 0
        }
      })
      this.manifestations = this.manifestations.sort((a, b) => {
        let Adate = parseInt(a.dates)
        let Bdate = parseInt(b.dates)
        if (Adate < Bdate) {
          return -1
        } else if (Adate > Bdate) {
          return 1
        } else {
          return 0
        }
      })

      this.authors = []
      this.manifestations.forEach(manif => {
        // console.log('this.authors', this.authors)
        if (this.authors.indexOf(manif.authors) === -1) {
          this.authors.push(manif.authors)
          this.activeAuthors.push(manif.authors)
        }
        // console.log('authors', this.authors)
      })

      this.expressions.forEach((expr, i) => {
        let manifs = []
        this.manifestations.forEach((manif, j) => {
          if (manif.authors !== '' && manif.authors === expr.authors) {
            manifs.push(manif)
          }
        })
        this.expressions[i].manifestations = manifs
      })
      this.content = this.expressions
      // console.log(this.expressions)
    },
    onToggleManifs (e) {
      console.log('togle manifs', e)
      let aside = e.originalTarget.parentNode
      // console.log('aside', aside)
      aside.classList.toggle('opened')
    },
    isInActiveAuthors (authors) {
      return this.activeAuthors.indexOf(authors) !== -1 ? 'active' : null
    },
    onToggleAuthors (author) {
      if (this.activeAuthors.indexOf(author) === -1) {
        this.activeAuthors.push(author)
      } else {
        this.activeAuthors.splice(this.activeAuthors.indexOf(author), 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
