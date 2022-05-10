<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">机构请求</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗需求</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
}
</style>
