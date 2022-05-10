<template>
  <el-header class="el-header_cls">
    <div class="logo-div">
      <el-image :src="require('@/assets/VMSW.png')" :fit="cover" />
    </div>
    <div class="clock-cls">
      <p>{{ nowTime }}</p>
    </div>
    <div class="nav-cls">
      <el-row>
        <el-col :span="6"
          ><router-link to="/" target="_blank"><p>首页</p></router-link></el-col
        >
        <el-col :span="6"
          ><p>
            <a class="cursor_pointer" href="/vue3+TS.md" download>文档</a>
          </p></el-col
        >
        <el-col :span="6"><p>博客</p></el-col>
        <el-col :span="6"><p>社区</p></el-col>
      </el-row>
    </div>
    <!-- <div> -->
    <p class="welcome">欢迎您，{{ name }}</p>
    <!-- </div> -->
    <div class="logout-btn">
      <el-button type="warning" plain @click="exit">退出</el-button>
    </div>
    <div>
      <!-- <img :src="imageUrl" class="avatar"/> -->
      <el-avatar
        class="avatar"
        shape="square"
        size="medium"
        :src="imageUrl"
      ></el-avatar>
    </div>
  </el-header>
</template>

<script setup>
/* eslint-disable */
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import axios from 'axios'
  import Qs from 'qs'


  const nowTime = ref('');
  const name = ref('');
  const router = useRouter();


  setInterval(() => {
    nowTime.value = new Date().toLocaleString()
  }, 1000);

  const exit = () => {
    router.push('/')
    sessionStorage.clear()
  }

  const imageUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
  axios.post('http://localhost:8081/graduation-project/UserMenu/avatar/AvatarInit.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId')
  })).then(function (response) {
    imageUrl.value = response.data[0][0]
  })

  axios.post('http://localhost:8081/graduation-project/Utils/GetUserAccount.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId')
  })).then(function (response) {
    name.value = response.data[0][1]
})

</script>

<style lang="scss" scoped>
.logo-div{
  height: 60px;
  width: 120px;
  position: relative;
  top:12px;
  left: 80px;
}
.avatar{
  width: 30px;
  height: 30px;
  margin-left: 10px;
}
.logout-btn{
}
.welcome{
  margin-left:200px;
  color: #909399;
}
</style>