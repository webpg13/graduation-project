<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">首页</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">系统简介</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <el-container style="height: calc(100% - 100px);">
      <el-card class="card-wrap" style="width: 55%">
        <p style="font-size:45px;margin:0">欢迎来到疫苗管理系统</p>
        <p style="font-size:20px">{{institutionName}}</p>
      </el-card>
      <el-main style="font-size:30px">
          <p class="tag-label">前端采用vue<el-image :src="require('@/assets/vue.svg')"></el-image>
           </p>
          <p class="tag-label">后端采用php<el-image :src="require('@/assets/php.svg')"></el-image></p>
          <p class="tag-label">数据库采用phpmyadmin<el-image :src="require('@/assets/phpmyadmin.png')"></el-image></p>
      </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const institutionName = ref('')

axios.post('http://localhost:8081/graduation-project/Utils/GetInstitution.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  institutionName.value = response.data[0][2]
})
</script>

<style scoped lang="scss">
.tag-label{
  border: 1px solid #50c1e9;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  .el-image{
    width: 40px;
    display: flex;
    align-items: center;
    margin: 0 0 0 10px;
  }
}
</style>
