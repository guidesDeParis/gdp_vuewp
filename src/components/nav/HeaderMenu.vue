<template>
  <nav id="header-menu">
    <ul>
      <li>
        <span>Index</span>
        <ul>
          <li>
            <router-link to="/nominum">
              Nominum
            </router-link>
          </li>
          <li>
            <router-link to="/locorum">
              Locorum
            </router-link>
          </li>
          <li>
            <router-link to="/operum">
              Operum
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <router-link to="/bibliographie">
          Bibliographie
        </router-link>
      </li>
      <li>
        <a href="#">Blog</a>
      </li>
    </ul>
  </nav>
</template>

<script>

export default {
  name: 'HeaderMenu',
  data: () => ({

  })
}

</script>

<style lang="scss" scoped>
</style>
