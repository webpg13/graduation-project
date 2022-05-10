<template>
  <nav>
    <router-link to="/"></router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
html,body{
  height: 100%;
  width:100%;
  overflow: hidden;
}
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.outContainer{
  height: 100%;
  .el-container{
    height: calc(100% - 60px);
    .el-aside{
      .el-menu{
        height: 100%;
        min-height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>
