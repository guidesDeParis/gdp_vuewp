<template>
  <section v-if="opened != null">
    <h2>{{ opened.title }}</h2>
    <p>{{ opened.body }}</p>
    <span
      @click="closePost()"
      >
      close</span>
  </section>
  <ul v-else>
    <li
      v-for="post in posts"
      :key="post.id"
      >
      <h2>
        <a
          @click="openPost(post)"
          >
          {{ post.title }}</a></h2>
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
  methods: mapActions('posts', [
    'openPost',
    'closePost'
  ]),
  created () {
    this.$store.dispatch('posts/getAllPosts')
  }
}
</script>
