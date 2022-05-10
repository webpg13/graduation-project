<template>
  <el-container class="outContainer">
      <el-header class="el-header_cls">
        <div class="VMSWDiv">
          <el-image :src="require('@/assets/VMSW.png')" :fit="cover"/>
        </div>
        <div style="display: flex; align-items: center;">
          <p class=" text_black" style="margin-left:200px;font-size:30px;">{{nowTime}}</p>
        </div>
        <div class="nav-cls">
          <el-row>
            <el-col :span="6"><router-link to="/" target="_blank" ><p class=" text_black">首页</p></router-link></el-col>
            <el-col :span="6"><p><a class=" text_black cursor_pointer" href="/vue3+TS.md" download>文档</a></p></el-col>
            <el-col :span="6"><p class=" text_black">博客</p></el-col>
            <el-col :span="6"><p class=" text_black">社区</p></el-col>
          </el-row>
        </div>
        <div>
          <p class=" text_black" style="margin-left:200px">欢迎您，{{name}}</p>
        </div>
        <div>
          <el-button type="text" style="margin-left:10px;margin-top:12px" @click="exit">退出</el-button>
        </div>
        <div>
          <img :src="imageUrl" class="avatar"/>
        </div>
      </el-header>
      <el-container>
          <el-aside>
            <el-menu class="el-menu_cls" default-active="/MenuTest" :background-color="color"
                     text-color="#fff" active-text-color="#0d63fa" @select="handleSelect">
                     <el-color-picker v-model="color" show-alpha :predefine="predefineColors"/>
              <el-sub-menu index="1">
                <template #title>
                  <span >个人信息</span>
                </template>
                <el-menu-item index="/BasicInformation">
                  <span>基本信息</span>
                </el-menu-item>
                <el-menu-item index="/MyFamily">
                  <span>我的家人</span>
                </el-menu-item>
                <el-menu-item index="/VaccingRecord">
                  <span>疫苗记录</span>
                </el-menu-item>
                <el-menu-item index="/AllergyRegister">
                  <span>过敏登记</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <span>订单管理</span>
                </template>
                <el-menu-item index="/MyBookingMessage">
                  <span>预约信息</span>
                </el-menu-item>
                <el-menu-item index="/MyBooking">
                  <span>我的预约</span>
                </el-menu-item>
                <el-menu-item index="/CompleteBooking">
                  <span>完成预约</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <span>疫苗信息</span>
                </template>
                <el-menu-item index="/VaccineShop">
                  <span>疫苗选购</span>
                </el-menu-item>
                <el-menu-item index="/VaccineAttentionList">
                  <span>关注疫苗</span>
                </el-menu-item>
                <el-menu-item index="/LackRegister">
                  <span>缺苗登记</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item index="/ForNm">
                  <span>论坛</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="el-main_cls">
            <div class="grid-bg"></div>
            <router-view></router-view>
          </el-main>
      </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const router = useRouter()

const nowTime = ref('')
const name = ref('')

const exit = () => {
  router.push('/')
  sessionStorage.clear()
}

const imageUrl = ref('')
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
setInterval(() => {
  nowTime.value = new Date().toLocaleString()
}, 1000)

document.querySelector('body').setAttribute('style', 'margin:0')
const handleSelect = (key, keyPath) => {
  router.push({
    path: key,
    params: { data: 'query' }
  })
}

const color = ref('#50c1e9')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
</script>

<style lang="scss" scoped>
.outContainer{
  position: relative;
}
.VMSWDiv{
  height: 60px;
  width: 120px;
  position: relative;
  top:12px;
  left: 80px;
}
.avatar{
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
}
</style>>
