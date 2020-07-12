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
            <h4>
              <a
                :href="'/edition/'+ed.item+'/'+oc.uuid"
                :uuid="oc.uuid"
                :eduuid="ed.item"
                @click.prevent="onclick"
                @keyup.enter="onclick"
              >
                {{ oc.title }}
              </a>
            </h4>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'IndexItemOcurrences',
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
    },
    onclick (e) {
      console.log('clicked on text occurence', e)
      if (e.target.getAttribute('eduuid')) {
        this.$router.push({
          name: `editiontext`,
          params: {
            id: e.target.getAttribute('eduuid'),
            textid: e.target.getAttribute('uuid')
          }
        })
      } else {
        this.$router.push({
          name: `edition`,
          params: {
            id: e.target.getAttribute('uuid')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
