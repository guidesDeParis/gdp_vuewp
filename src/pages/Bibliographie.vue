<template>
  <MainContentLayout id="biblio">
    <template v-if="!expressions.meta || !manifestations.meta" #header>
      <span class="loading">Chargement ...</span>
    </template>
    <template v-else #header>
      <h1>
        <router-link :to="{ name:'bibliographie'}">Bibliographie</router-link>
      </h1>
      <nav>
        <ul>
          <li>
            <router-link
              :to="{ name:'bibliographie', params: { type: 'expressions'}}"
              title="Consulter la liste des expressions"
            >
              {{ expressions.meta.quantity.quantity }} {{ expressions.meta.quantity.unit }}
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name:'bibliographie', params: { type: 'manifestations'}}"
              title="Consulter toutes les manifestations"
            >
              {{ manifestations.meta.quantity.quantity }} {{ manifestations.meta.quantity.unit }}
            </router-link>
          </li>
        </ul>
      </nav>
    </template>

    <!-- default slot -->
    <!-- expressions list -->
    <template v-if="!uuid && type === 'expressions'">
      <ul class="item-list">
        <li v-for="item in expressions.content" :key="item.uuid">
          <h2>
            <router-link
              v-if="item.authors"
              :to="{ name:'bibliographieItem', params:{ type:type, uuid:item.uuid } }"
              title="Consulter la notice de l'expression"
            >
              {{ item.authors }}
            </router-link>
            <span v-else>/!\ No authors /!\</span>
          </h2>
          <p class="date">{{ item.dates }}</p>
          <em class="titles">{{ item.titles }}</em>
          <aside v-if="item.manifestations && item.manifestations.length">
            <h5
              @click.prevent="onToggleManifs"
              @keyup.enter="onToggleManifs"
            >Afficher les manifestations</h5>
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
          v-for="item in manifestations.content" :key="item.uuid"
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
    <!-- or expression / manifestation item -->
    <template v-if="uuid">
      <div class="biblio-item">
        <h2>{{ item.type }}</h2>
        <h2 v-html="item.tei" />
        <p class="author"><span class="label">Auteur :</span> {{ item.authors }}</p>
        <p v-if="item.dates" class="date"><span class="label">Dates :</span> {{ item.dates }}</p>
        <p v-if="item.edition" class="edition"><span class="label">Édition :</span> {{ item.edition }}</p>
        <p v-if="item.editeur" class="editeur" v-html="editeur" />
        <p v-if="item.lieu" class="lieu"><span class="label">Lieu de publication :</span> {{ item.lieu }}</p>
        <p v-if="item.extent" class="extent"><span class="label">Format :</span> {{ item.extent }}</p>
        <!-- manifestation -->
        <h3 v-if="item.manifestations && item.manifestations.length">Liste des manifestations :</h3>
        <ul v-if="item.manifestations && item.manifestations.length" class="item-list">
          <li v-for="manif in item.manifestations" :key="manif.uuid">
            <p v-html="manif.tei" />
            <router-link
              :to="{ name:'bibliographieItem', params:{ type:'manifestations', uuid:manif.uuid } }"
              v-html="manif.path"
            />
          </li>
        </ul>
        <!-- note -->
        <h3 v-if="item.notes && item.notes.length">Note :</h3>
        <ul v-if="item.notes && item.notes.length" class="notes-list">
          <li v-for="note in item.notes" :key="note.uuid">
            <p v-html="note" />
          </li>
        </ul>
        <!-- BNF -->
        <h3 v-if="noticesbnf.length">Notices BnF :</h3>
        <ul v-if="noticesbnf.length" class="item-list">
          <li v-for="id in noticesbnf" :key="id.url">
            <a :href="id.url">{{ id.type }}: {{ id.url }}</a>
          </li>
        </ul>
        <!-- GALLICA -->
        <h3 v-if="noticesgallica.length">Exemplaires sur Gallica :</h3>
        <ul v-if="noticesgallica.length" class="item-list">
          <li v-for="id in noticesgallica" :key="id.url">
            <a :href="id.url">{{ id.type }}: {{ id.url }}</a>
          </li>
        </ul>

      </div>
    </template>

    <template v-if="!uuid && type === 'manifestations'" #nav>
      <ul class="authors-filters">
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
    <template v-else #nav>
      <aside class="links">
        <p>
          Permalien:<br><a :href="`${item.url}`">{{ item.url }}</a>
        </p>
        <p>
          JSON:<br><a :href="`${apipath}${item.path}${item.uuid}`">{{ apipath }}{{ item.path }}{{ item.uuid }}</a>
        </p>
      </aside>
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
    apipath () {
      return window.apipath
    },
    editeur () {
      return '<span class="label">Éditeur : </span>' + this.item.editeur
    },
    noticesbnf (item) {
      let n = []
      if (this.item && this.item.idno && this.item.idno.length) {
        this.item.idno.forEach(id => {
          if (id.type === 'catBnf') {
            n.push(id)
          }
        })
      }
      return n
    },
    noticesgallica (item) {
      let n = []
      if (this.item && this.item.idno && this.item.idno.length) {
        this.item.idno.forEach(id => {
          if (id.type === 'gallica') {
            n.push(id)
          }
        })
      }
      return n
    }
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
            this.expressions = data
            REST.get(`${window.apipath}/bibliography/manifestations`, {})
              .then(({ data }) => {
                console.log('Biblio REST manifestations: data', data)
                if (data.content) {
                  this.manifestations = data
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
            console.log('getItem item', this.item)
          }
        })
        .catch((error) => {
          console.warn('Issue with bibliographie get item', error)
          Promise.reject(error)
        })
    },
    parseContents () {
      this.expressions.content = this.expressions.content.sort((a, b) => {
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
      this.manifestations.content = this.manifestations.content.sort((a, b) => {
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
      this.manifestations.content.forEach(manif => {
        // console.log('manif', manif)
        if (this.authors.indexOf(manif.authors) === -1) {
          this.authors.push(manif.authors)
          this.activeAuthors.push(manif.authors)
        }
        // console.log('authors', this.authors)
      })

      this.expressions.content.forEach((expr, i) => {
        let manifs = []
        this.manifestations.content.forEach((manif, j) => {
          if (manif.authors !== '' && manif.authors === expr.authors) {
            manifs.push(manif)
          }
        })
        this.expressions.content[i].manifestations = manifs
      })
      this.content = this.expressions.content
      console.log('Biblio content parsed', this.expressions, this.manifestations)
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
