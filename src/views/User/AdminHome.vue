<template>
  <el-container class="outContainer" direction="vertical">
      <!-- <el-header class="el-header_cls">
        <div class="VMSWDiv">
          <el-image :src="require('@/assets/VMSW.png')" :fit="cover"/>
        </div>
        <div style="flex;flex-direction:row">
          <p style="color:rgb(192, 156, 156);margin-left:180px;font-size:30px;margin-top:15px">{{nowTime}}</p>
        </div>
        <div class="nav-cls">
          <el-row>
            <el-col :span="6"><router-link to="/" target="_blank" ><p style="color: rgb(192, 156, 156);">首页</p></router-link></el-col>
            <el-col :span="6"><p><a href="/vue3+TS.md" download style="cursor:pointer;color:rgb(192, 156, 156)">文档</a></p></el-col>
            <el-col :span="6"><p>博客</p></el-col>
            <el-col :span="6"><p>社区</p></el-col>
          </el-row>
        </div>
        <div>
          <p style="color:rgb(192, 156, 156);margin-left:160px">欢迎您，{{name}}</p>
        </div>
        <div>
          <el-button type="text" style="margin-left:10px;margin-top:12px" @click="exit">退出</el-button>
        </div>
        <div>
          <img :src="imageUrl" class="avatar"/>
        </div>
      </el-header> -->
      <Header></Header>
      <el-container>
          <el-aside>
            <el-menu class="el-menu_cls" default-active="/SystemIntroduce" :background-color="color"
                     text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
                     <el-color-picker v-model="color" show-alpha :predefine="predefineColors"/>
              <el-sub-menu index="1">
                <template #title>
                  <span>首页</span>
                </template>
                <el-menu-item index="/SystemIntroduce">
                  <span>系统简介</span>
                </el-menu-item>
                <el-menu-item index="/AdminIntroduce">
                  <span>机构简介</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <span>用户请求</span>
                </template>
                <el-menu-item index="/BookingMessage">
                  <span>预约信息</span>
                </el-menu-item>
                <el-menu-item index="/LackVaccineMessage">
                  <span>缺苗信息</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <span>机构请求</span>
                </template>
                <el-menu-item index="/VaccineRequest">
                  <span>疫苗请求</span>
                </el-menu-item>
                <el-menu-item index="/RequestReply">
                  <span>请求答复</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="4">
                <template #title>
                  <span>疫苗管理</span>
                </template>
                <el-menu-item index="/VaccineNumber">
                  <span>疫苗余量</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="5">
                <template #title>
                  <span>数据统计</span>
                </template>
                <el-menu-item index="/DataCompute">
                  <span>预约数据</span>
                </el-menu-item>
                <el-menu-item index="/AttentionChart">
                  <span>关注数据</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item index="/AdminForNm">
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
/* import axios from 'axios'
import Qs from 'qs' */
import Header from '@/components/Header.vue'

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

/* const nowTime = ref('')
const name = ref('')

const exit = () => {
  router.push('/')
  sessionStorage.clear()
}

const imageUrl = ref('')
axios.post('http://localhost:8081/graduation-project/AdminMenu/avatar/AvatarInit.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  imageUrl.value = response.data[0][0]
})

axios.post('http://localhost:8081/graduation-project/Utils/GetAdminAccount.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  name.value = response.data[0][2]
  console.log(name.value)
})

setInterval(() => {
  nowTime.value = new Date().toLocaleString()
}, 1000)
 */
const router = useRouter()
document.querySelector('body').setAttribute('style', 'margin:0')
const handleSelect = (key, keyPath) => {
  router.push({
    path: key,
    params: { data: 'query' }
  })
}
</script>

<style scoped>
.el-menu{
  min-height: 680px;
}

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
