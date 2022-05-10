<template>
    <div class="headerAll" v-bind:class="headerAll">
        <HeaderSearch v-bind:class="others"/>
        <HeaderCart v-bind:class="others"/>
        <span v-if="!user">你好,请<router-link to="/login">登录</router-link> 免费
        <router-link to="/register">注册</router-link></span>
        <span v-else>欢迎您,{{user.username}},<a href="javascript:;" @click="logout">退出登录</a></span>
    </div>
</template>

<script>
import HeaderSearch from './HeaderSearch.vue'
import HeaderCart from './HeaderCart.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HeaderAll',

  components: {
    HeaderSearch,
    HeaderCart
  },

  computed: {
    ...mapState('user', [
      'user'
    ])
  },

  methods: {
    logout () {
      this.deleteUser()
    },
    ...mapMutations('user', [
      'deleteUser'
    ])
  }
}
</script>

<style scoped>
.headerAll{
  width : 1000px;
  height: 80px;
  border: 1px solid black;
  display:inline-block;
  vertical-align: top;
}
.others{
  display :inline-block;;
}
</style>
