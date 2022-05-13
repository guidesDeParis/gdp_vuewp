<template>
  <div>
    <div class="tabs">
      <span
        v-if="content.occurences"
        class="tab"
        :class="{ active: tab === 'occurences' }"
        @click.prevent="onclickTab('occurences')"
        @keyup.enter="onclickTab('occurences')"
      >Occurences</span>
      <span
        v-if="content.attestedForms"
        class="tab"
        :class="{ active: tab === 'formes' }"
        @click.prevent="onclickTab('formes')"
        @keyup.enter="onclickTab('formes')"
      >Formes attestées</span>
    </div>
    <section v-if="content.occurences" v-show="tab === 'occurences'" class="occurences">
      <ul>
        <li
          v-for="ed in content.occurences"
          :key="ed.item"
        >
          <h3>
            <a
              :href="'/texts/'+ed.item"
              :uuid="ed.item"
              v-html="ed.biblio"
            />
          </h3>
          <ul>
            <li
              v-for="oc in ocAsArray(ed.occurences)"
              :key="oc.id"
            >
              <!-- <li
                v-for="oc in ed.occurences"
                :key="oc.uuid"
              > -->
              <occurence v-if="oc.title" :ed="ed" :oc="oc" />
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <section v-if="content.attestedForms" v-show="tab === 'formes'" class="attested-forms-occurences">
      <!-- <h3>Attested forms</h3> -->
      <ul>
        <li v-for="(af, i) in content.attestedForms" :key="i">
          <h3 class="form">{{ af.title }}</h3>
          <ul>
            <li v-for="(oc, j) in af.occurences" :key="j">
              <forme :form="af.title" :oc="oc" />
            </li>
          </ul>
        </li>
      </ul>
    </section>

  </div>
</template>

<script>
import Occurence from './Occurence'
import Forme from './Forme'

export default {
  name: 'IndexItemOcurrences',
  components: {
    Occurence,
    Forme
  },
  props: {
    content: Object
  },
  data: () => ({
    tab: 'occurences'
  }),
  methods: {
    ocAsArray (oc) {
      // not necesseary anymore (KB #758)
      console.log('Array.isArray(oc)', Array.isArray(oc))
      return Array.isArray(oc) ? oc : [oc]
    },
    onclickTab (tab) {
      this.tab = tab
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
