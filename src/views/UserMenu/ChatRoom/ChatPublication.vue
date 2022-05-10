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
      <el-input placeholder="请输入正文" v-model="form.mainText" style="font-size:20px" :rows="10" type="textarea"/>
    </div>
    <div class="comment-operate" style="overflow:hidden">
        <el-button type="primary" class="sub-btn fr" @click="subComment">发表评论</el-button>
        <el-button type="text" class="fr" style="margin:10px" @click="clear">清空</el-button>
      </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import Qs from 'qs'
import { reactive } from 'vue'

const clear = () => {
  form.mainText = ''
}

const subComment = () => {
  ElMessageBox.confirm(
    '您确定要提交吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/UserMenu/ChatRoom/AddChat.php', Qs.stringify({
        userId: sessionStorage.getItem('currentUserId'),
        title: form.title,
        mainText: form.mainText,
        date: new Date(),
        type: '个人'
      })).then(function (response) {
        ElMessage({
          type: 'success',
          message: '发表成功！'
        })
        form.title = ''
        form.mainText = ''
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const form = reactive({
  title: '',
  mainText: ''
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
  margin-top: 10px;
}
</style>
