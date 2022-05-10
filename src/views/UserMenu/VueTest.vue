<template>
<el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/ForNm' }">论坛</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">发表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div>
    <div class="titleWrapper">
      <el-input placeholder="请输入标题" v-model="form.title" style="font-size:28px" :rows="1" type="textarea"/>
    </div>
    <div class="titleWrapper">
      <el-input placeholder="请输入关键词" v-model="form.title" style="font-size:20px" :rows="1" type="textarea"/>
    </div>
    <div class="titleWrapper">
      <el-input placeholder="请输入正文" v-model="form.title" style="font-size:20px" :rows="10" type="textarea"/>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive } from 'vue'

const form = reactive({
  title: ''
})
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.titleWrapper{
  font-size: 28px;
  word-wrap: break-word;
  font-weight: 500;
}
</style>
