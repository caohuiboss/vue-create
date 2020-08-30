<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" class="aaa">Home</router-link> |
      <router-link to="/about">About</router-link>
      <H />
    </div>
    <router-view />
  </div>
</template>

<script>
import H from '../src/components/HelloWorld.vue'
export default {
  name: 'App',
  components: { H },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
