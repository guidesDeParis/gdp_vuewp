<template>
  <section v-if="opened != null">
    <h2>{{ opened.title }}</h2>
    <p>{{ opened.body }}</p>
    <a
      href="#"
      @click="closePost()"
      @keydown.enter="closePost()"
    >
      close
    </a>
  </section>
  <ul v-else>
    <li
      v-for="post in posts"
      :key="post.id"
    >
      <h2>
        <a
          :href="'#post-'+post.id"
          @click="openPost(post)"
          @keydown.enter="openPost(post)"
        >
          {{ post.title }}
        </a>
      </h2>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    opened: state => state.posts.opened,
    posts: state => state.posts.all
  }),
  created () {
    this.$store.dispatch('posts/getAllPosts')
  },
  methods: mapActions('posts', [
    'openPost',
    'closePost'
  ]),
  metaInfo () {
    return {
      title: this.opened !== null ? this.opened.title : 'home'
    }
  }
}
</script>
