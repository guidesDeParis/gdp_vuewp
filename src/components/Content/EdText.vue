<template>
  <div class="text-wrapper">
    <EdTextRefLink :uuid="uuid" :url="url" />
    <div
      class="tei"
      :class="{ active: uuid === textid }"
      :data-uuid="uuid"
      v-html="teiparsed"
    />
  </div>
</template>

<script>

// import Vue from 'vue'

import EdTextRefLink from './EdTextRefLink'

export default {
  name: 'EdText',
  components: {
    EdTextRefLink
  },
  props: {
    tei: String,
    uuid: String,
    textid: String,
    extractid: String,
    url: String
  },
  data: () => ({
    template: null,
    html: null,
    pages: [],
    teiparsed: null
  }),
  watch: {
    tei: function (newtei, oldtei) {
      // console.log('tei watcher', oldtei, newtei)
      // we need this watcher to update display as route is changing
      // this.buildTemplate()
      this.parseTei()
    }
  },
  beforeMount () {
    // console.log('EdText beforeMount', this.tei)
    if (this.tei) {
      // this.buildTemplate()
      this.parseTei()
    }
  },
  // mounted () {
  //   this.$emit('onNewPageBreaks', this.pages)
  // },
  methods: {
    // buildTemplate () {
    //   // console.log('EdText buildTemplate: tei', this.tei)
    //   // to get Vue.compile working we have to use the full build of vuejs
    //   // https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds
    //   // in /build/webpack.config.base.js alias -> 'vue': 'vue/dist/vue.js',
    //   this.buildHtml()
    //   this.template = Vue.compile(this.html)
    //   this.$options.staticRenderFns = []
    //   this._staticTrees = []
    //   this.template.staticRenderFns.map(fn => (this.$options.staticRenderFns.push(fn)))
    // },
    // buildHtml () {
    //   this.html = `<div` +
    //   ` class="tei${this.uuid === this.textid ? ' active' : ''}"` +
    //   ` data-uuid="${this.uuid}"` +
    //   `>` +
    //   `<a` +
    //   ` href="http://${window.apipath}/items/${this.uuid}"` +
    //   ` title="Copy to clipboard ${this.uuid}"` +
    //   ` class="text-item-link"` +
    //   ` @click.prevent="onClickCopyClipboard"` +
    //   `>` +
    //   `<span class="mdi mdi-open-in-new" />` +
    //   `</a>` +
    //   `${this.tei}</div>`
    //   this.parseLinks()
    //   this.parseFigures()
    //   // this.parsePageBreaks()
    //   // console.log('EdText: builded html', this.html)
    // },
    parseTei () {
      this.teiparsed = this.tei

      this.parseIndexItems()
      this.parseLinks()
      this.parseFigures()

      if (this.textid === this.uuid) {
        this.parseExtract()
      }
    },
    parseIndexItems () {
      let items = this.teiparsed.match(/<span[^>]*class="(persName|objectName|placeName)"[^>]*>[^<]+<\/span>/g)
      console.log('items', items)
      if (items) {
        let itemparts, icon, newspan
        for (var i = 0; i < items.length; i++) {
          itemparts = RegExp(/<span[^>]*class="([^"]+)"[^>]*>.+<\/span>/g).exec(items[i], 'g')
          console.log('itemparts', itemparts)
          switch (itemparts[1]) {
            case 'placeName':
              icon = '<span class="index-item-icon mdi mdi-map-marker"></span>'
              break
            case 'objectName':
              icon = '<span class="index-item-icon mdi mdi-card-bulleted"></span>'
              break
            case 'persName':
              icon = '<span class="index-item-icon mdi mdi-account"></span>'
              break
          }
          // newspan = `<span class="no-wrap">${items[i]}${icon}</span>`
          newspan = `${items[i]}&nbsp;${icon}`
          this.teiparsed = this.teiparsed.replace(items[i], newspan)
        }
      }
    },
    parseLinks () {
      let links = this.teiparsed.match(/<a[^<]+<\/a>/g)
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
              // `<sup class="mdi mdi-message-text-outline" />` +
              `</a>`
            // console.log('newlink', newlink)
            this.teiparsed = this.teiparsed.replace(links[i], newlink)
          }
        }
        // console.log('this.html', this.html)
      }
    },
    parseFigures () {
      // console.log('parseFigures this.tei', this.teiparsed)
      let imgs = this.teiparsed.match(/<img[^>]*>/g)
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
            this.teiparsed = this.teiparsed.replace(imgs[i], newimg)
          }
        }
      }
    },
    parseExtract () {
      console.log('Parse extract', this.extractid)
      // let regexp = RegExp(this.extract, 'gim')
      let regexp = RegExp(`<span[^>]* id="${this.extractid}"[^>]*>[^<]*</span>`)
      // let regexp = RegExp(`<(\w+)((?:\s+\w+(?:\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|[^'">\s]+))?)+\s*|\s*)>([\s\S]*?)<\/\1>`)
      let index = 0
      function marking (str) {
        index++
        return `<mark class="extract" id="mark-${index}">${str}</mark>`
      }
      this.teiparsed = this.teiparsed.replace(regexp, marking)
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
    }
    // ,
    // onClickCopyClipboard (e) {
    //   e.preventDefault()
    //   console.log('onClickCopyClipboard', e)
    //   // navigator.clipboard.writeText(e.target.getAttribute('href'))
    //   this.$copyText(e.target.getAttribute('href'))
    //   return false
    // }
  }
  // render (h) {
  //   // console.log('EdText render()')
  //   if (!this.template) {
  //     return h('span', 'Loading ...')
  //   } else {
  //     return this.template.render.call(this)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
</style>
