<template>
  <section class="occurences">
    <ul>
      <li
        v-for="ed in content.occurences"
        :key="ed.item"
      >
        <h3>
          <a
            :href="'/edition/'+ed.item"
            :uuid="ed.item"
            @click.prevent="onclick"
            @keyup.enter="onclick"
          >
            {{ ed.item }}
          </a>
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
            <occurence :ed="ed" :oc="oc" />
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
import Occurence from './Occurence'

export default {
  name: 'IndexItemOcurrences',
  components: {
    Occurence
  },
  props: {
    content: Object
  },
  data: () => ({

  }),
  methods: {
    ocAsArray (oc) {
      // not necesseary anymore (KB #758)
      console.log('Array.isArray(oc)', Array.isArray(oc))
      return Array.isArray(oc) ? oc : [oc]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
