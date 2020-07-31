<script>

import Vue from 'vue'

export default {
  name: 'EdText',
  props: {
    tei: String,
    uuid: String,
    textid: String
  },
  data: () => ({
    template: null,
    html: null,
    pages: []
  }),
  watch: {
    tei: function (newtei, oldtei) {
      // console.log('tei watcher', oldtei, newtei)
      // we need this watcher to update display as route is changing
      this.buildTemplate()
    }
  },
  beforeMount () {
    // console.log('EdText beforeMount')
    if (this.tei) {
      this.buildTemplate()
    }
  },
  // mounted () {
  //   this.$emit('onNewPageBreaks', this.pages)
  // },
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
      this.html = `<div` +
      ` class="tei${this.uuid === this.textid ? ' active' : ''}"` +
      ` data-uuid="${this.uuid}"` +
      `>` +
      `<a` +
      ` href="http://${window.apipath}/items/${this.uuid}"` +
      ` title="Copy to clipboard ${this.uuid}"` +
      ` class="text-item-link"` +
      ` @click.prevent="onClickCopyClipboard"` +
      `>` +
      `<span class="mdi mdi-open-in-new" />` +
      `</a>` +
      `${this.tei}</div>`
      this.parseLinks()
      this.parseFigures()
      // this.parsePageBreaks()
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
          linkparts = RegExp(/<a class="(.+)" href="(.+)" data-index="(.+)">(.+)<\/a>/g).exec(links[i], 'g')
          // console.log('linkparts', linkparts)
          if (!linkparts) {
            console.warn(`link ${i} malformed:`, links[i])
          } else {
            index = linkparts[3]
            uuid = linkparts[2].replace('#', '')
            newlink = `<a` +
              ` class="${linkparts[1]} active-link"` +
              ` data-index="${index}"` +
              ` data-uuid="${uuid}"` +
              ` href="/${index}/${uuid}"` +
              ` @click.prevent="onClickRef"` +
              ` @keyup.enter="onClickRef"` +
              ` @mouseover="onHoverLink"` +
              ` @mouseleave="onLeaveLink"` +
              // prevent click on this one
              ` v-touch:tap.prevent="onTapLink"` +
              ` v-touch-class="'tapped'"` +
              `>${linkparts[4]}` +
              `<sup class="mdi mdi-message-text-outline" />` +
              `</a>`
            // console.log('newlink', newlink)
            this.html = this.html.replace(links[i], newlink)
          }
        }
        // console.log('this.html', this.html)
      }
    },
    parseFigures () {
      console.log('parseFigures this.html', this.html)
      let imgs = this.html.match(/<img[^>]*>/g)
      console.log('imgs', imgs)
      if (imgs) {
        let imgparts, newsrc, newimg
        for (var i = 0; i < imgs.length; i++) {
          // console.log(`link ${i}:`, links[i])
          imgparts = RegExp(/<img src="(.+)" alt="(.+)">/g).exec(imgs[i], 'g')
          console.log('imgparts', imgparts)
          if (!imgparts) {
            console.warn(`img ${i} malformed:`, imgs[i])
          } else {
            newsrc = `${imgparts[1]}/full/1000,/0/native.jpg`
            newimg = `<img` +
              ` src="${newsrc}"` +
              ` alt="${imgparts[2]}"` +
              `/>`
            // console.log('newlink', newlink)
            this.html = this.html.replace(imgs[i], newimg)
          }
        }
      }
    },
    // parsePageBreaks () {
    //   let pbs = this.html.match(/<span role="pageBreak"[^>]+><\/span>/g)
    //   console.log('pagebreaks', pbs)
    //   if (pbs) {
    //     let pbparts, newpb, num
    //     for (var i = 0; i < pbs.length; i++) {
    //       pbparts = RegExp(/<span role="pageBreak" data-num="(.+)"><\/span>/).exec(pbs[i], 'g')
    //       if (!pbparts) {
    //         console.warn(`pageBreak ${i} maformed`, pbs[i])
    //       } else {
    //         // console.log('pbparts', pbparts)
    //         num = pbparts[1]
    //         this.pages.push(num)
    //         newpb = `<span` +
    //           // ` id="page-break-${num}"` +
    //           ` role="pageBreak"` +
    //           ` data-num="${num}"` +
    //           ` data-num-prev="${num - 1}"` +
    //           ` />`
    //         // console.log('newpb', newpb)
    //         this.html = this.html.replace(pbs[i], newpb)
    //       }
    //     }
    //   }
    // },
    onClickRef (e) {
      console.log('onClickRef(e)', e)
      if (e.target.classList.contains('tapped')) {
        this.$router.push({
          name: e.target.dataset.index,
          params: { id: e.target.dataset.uuid }
        })
      }
    },
    onHoverLink (e) {
      console.log('EdText onHoverLink(e)', e)
      this.$emit('onHoverLink', {
        uuid: e.target.dataset.uuid,
        index: e.target.dataset.index,
        rect: e.target.getBoundingClientRect()
      })
    },
    onTapLink (e) {
      console.log('EdText onTapLink(e)', e)
      this.$emit('onHoverLink', {
        uuid: e.target.dataset.uuid,
        index: e.target.dataset.index,
        rect: e.target.getBoundingClientRect()
      })
    },
    onLeaveLink (e) {
      // console.log('EdText onLeaveLink(e)', e)
      this.$emit('onLeaveLink')
    },
    onClickCopyClipboard (e) {
      e.preventDefault()
      console.log('onClickCopyClipboard', e)
      // navigator.clipboard.writeText(e.target.getAttribute('href'))
      this.$copyText(e.target.getAttribute('href'))
      return false
    }
  },
  render (h) {
    // console.log('EdText render()')
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
