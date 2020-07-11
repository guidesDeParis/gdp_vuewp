<script>

import Vue from 'vue'

export default {
  name: 'EdText',
  props: {
    tei: String
  },
  data: () => ({
    template: null,
    html: null
  }),
  watch: {
    tei: function (newtei, oldtei) {
      // console.log('tei watcher', oldtei, newtei)
      // we need this watcher to update display as route is changing
      this.buildTemplate()
    }
  },
  beforeMount () {
    console.log('EdText beforeMount')
    if (this.tei) {
      this.buildTemplate()
    }
  },
  methods: {
    buildTemplate () {
      // console.log('EdText buildTemplate: tei', this.tei)
      // to get Vue.compile working we have to use the full build of vuejs
      // https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds
      // in /build/webpack.config.base.js alias -> 'vue': 'vue/dist/vue.js',
      this.buildHtml()
      this.template = Vue.compile(this.html)
      this.$options.staticRenderFns = []
      this._staticTrees = []
      this.template.staticRenderFns.map(fn => (this.$options.staticRenderFns.push(fn)))
    },
    buildHtml () {
      this.html = `<div class="tei">${this.tei}</div>`
      this.parseLinks()
      // console.log('EdText: builded html', this.html)
    },
    parseLinks () {
      let links = this.html.match(/<a[^<]+<\/a>/g)
      // console.log('links', links)
      if (links) {
        // let domparser = new DOMParser()
        // let domlink
        let linkparts, newlink, uuid
        let index = null
        for (var i = 0; i < links.length; i++) {
          // console.log(`link ${i}:`, links[i])
          // domlink = domparser.parseFromString(links[i], 'text/xml').firstChild
          // console.log('domlink', domlink.classList)
          // if (domlink.classList.contains('placeName')) { index = 'locorum' }
          // if (domlink.classList.contains('persName')) { index = 'nominum' }
          // if (domlink.classList.contains('objectName')) { index = 'operum' }
          // console.log('index:', index)
          linkparts = RegExp(/<a class="(.+)" href="(.+)">(.+)<\/a>/g).exec(links[i], 'g')
          // console.log('linkparts', linkparts)
          switch (linkparts[1]) {
            case 'persName':
              index = 'nominum'
              break
            case 'placeName':
              index = 'locorum'
              break
            case 'objectName':
              index = 'operum'
              break
          }
          if (index) {
            uuid = linkparts[2].replace('#', '')
            newlink = `<a` +
              ` class="${linkparts[1]} active-link"` +
              ` data-index="${index}"` +
              ` uuid="${uuid}"` +
              ` href="/${index}/${uuid}"` +
              ` @click.prevent="onClickRef"` +
              ` @keyup.enter="onClickRef"` +
              `>${linkparts[3]}</a>`
            // console.log('newlink', newlink)
            this.html = this.html.replace(links[i], newlink)
          }
        }
        // console.log('this.html', this.html)
      }
    },
    onClickRef (e) {
      console.log('onClickRef()', e)
      this.$router.push({
        name: e.target.getAttribute('data-index'),
        params: { id: e.target.getAttribute('uuid') }
      })
    }
  },
  render (h) {
    console.log('EdText render()')
    if (!this.template) {
      return h('span', 'Loading ...')
    } else {
      return this.template.render.call(this)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
