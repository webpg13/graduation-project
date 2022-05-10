<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗管理</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/VaccineNumber' }">疫苗余量</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/BulkUpdate' }">批量操作</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">操作结果</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-result
        icon="success"
        :title="title"
        sub-title="您可以点击按钮或者导航栏跳转页面"
      />
    <el-button @click="back">返回疫苗余量</el-button>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Qs from 'qs'

const imageUrl = ref('')

const back = () => {
  router.push({ path: '/VaccineNumber' })
}

axios.post('http://localhost:8081/graduation-project/AdminMenu/avatar/AvatarInit.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  imageUrl.value = response.data[0][0]
})
const route = useRoute()
const router = useRouter()

const title = ref('')
const id = route.query.id

if (id === '1') {
  title.value = '下线相关疫苗成功！'
} else if (id === '2') {
  title.value = '更新疫苗上线日期成功！'
} else if (id === '3') {
  title.value = '更新疫苗数量成功！'
}
</script>
