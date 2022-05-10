<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">首页</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/AdminIntrouce' }">机构简介</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">更新信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Qs from 'qs'

axios.post('http://localhost:8081/graduation-project/AdminMenu/avatar/AvatarInit.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  imageUrl.value = response.data[0][0]
})

const imageUrl = ref('')
const beforeUpload = (uploadFile) => {
  console.log(uploadFile, 1322)
  //   imageUrl.value = URL.createObjectURL(uploadFile)
  //   console.log(imageUrl, 123)
  fileToBase64(URL.createObjectURL(uploadFile)).then(res => {
    imageUrl.value = res.base64
    axios.post('http://localhost:8081/graduation-project/AdminMenu/avatar/AvatarUpload.php', Qs.stringify({
      img: res.base64,
      institutionId: sessionStorage.getItem('currentAdminId')
    })).then(function (response) {
      console.log(response.data)
      if (response.data === 1) {
        ElMessage({
          message: '上传头像成功.',
          type: 'success'
        })
      }
    })
    // 这里的res.base64就是图片的base64
    // 你在这里发请求存起来就行
    // 显示的时候，拿到base64给imageURL赋值就可以
  })

  return false
}

// 转base64
const fileToBase64 = (url) => {
  const image = new Image()
  image.src = url
  return new Promise((resolve, reject) => {
    image.onload = () => {
      console.log(222)
      const canvas = document.createElement('canvas')
      canvas.height = image.height
      canvas.width = image.width
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve({
        success: true,
        base64: canvas.toDataURL()
      })
    }
  })
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar{
    width: 178px;
    height: 178px;
}
</style>
