<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">首页</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">系统简介</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <el-container style="height: calc(100% - 100px);">
      <el-aside style="background-color:red" width="60%">
        <p style="font-size:45px;margin:0">欢迎来到疫苗管理系统</p>
        <p style="font-size:20px">{{institutionName}}</p>
      </el-aside>
      <el-main style="font-size:30px">
          <p>前端采用vue</p>
          <p>后端采用php</p>
          <p>数据库采用phpmyadmin</p>
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

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
}
</style>
