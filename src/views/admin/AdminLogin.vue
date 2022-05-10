<template>
  <div>
    <el-container class="container" >
      <el-header class="header" >
        <div class="VMSWDiv">
          <el-image :src="require('@/assets/VMSW.jpg')" :fit="cover"/>
        </div>
      </el-header>
      <el-main class='main'>
        <el-container class='loginContainer'>
          <el-header height="30px" class="loginHeader">管理员登录</el-header>
          <el-divider class="divider" />
          <el-main>
            <el-form :model="form" label-width="60px">
              <el-form-item label="地区" style="margin-top:30px">
                <el-cascader v-model="form.area" :options="options" placeholder="请选择地区"/>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="form.name" placeholder="请输入账号" :prefix-icon="Avatar" clearable/>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock" show-password clearable/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width:80%" @click="login">登录</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-main>
      <el-footer class='footer'>
        <p></p>
      </el-footer>
    </el-container>
  </div>
</template>
<script setup>
import { Avatar, Lock } from '@element-plus/icons-vue'
import axios from 'axios'
import { reactive, ref } from 'vue'
import Qs from 'qs'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  area: [],
  name: '',
  password: ''
})
const areaTool = ref('')

const login = () => {
  if (form.area.length !== 0) {
    areaTool.value = form.area[0] + '_' + form.area[1] + '_' + form.area[2]
  } else {
    areaTool.value = ''
  }
  axios.post('http://localhost:8081/graduation-project/AdminLogin/AdminLoginResult.php', Qs.stringify({
    area: areaTool.value,
    name: form.name,
    password: form.password
  })).then(function (response) {
    console.log(response.data)
    switch (response.data) {
      case 'A': {
        ElMessage.error('未选择地区，请重新输入.')
        break
      }
      case 'B': {
        ElMessage.error('账号为空，请重新输入.')
        break
      }
      case 'C': {
        ElMessage.error('密码为空，请重新输入.')
        break
      }
      case 'D': {
        ElMessage.error('账号不存在，请重新输入.')
        break
      }
      case 'E': {
        ElMessage.error('密码错误，请重新输入.')
        break
      }
      default: {
        sessionStorage.setItem('currentAdminId', response.data)
        router.push({
          path: '/SystemIntroduce'
        })
      }
    }
  })
}

const options = [
  {
    value: 0,
    label: '浙江省',
    children: [
      {
        value: 0,
        label: '宁波市',
        children: [
          {
            value: 0,
            label: '鄞州区'
          },
          {
            value: 1,
            label: '海曙区'
          }
        ]
      }
    ]
  }
]
</script>

<style scoped>
.VMSWDiv{
  height: 60px;
  width: 120px;
  position: relative;
  top:12px;
  left: 80px;
}
.container{
  height: 730px;
}
.header{
  background-color: black;
}
.main{
  background-color: white;
  background-image: url(@/assets/loginBody.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center, 0;
}
.footer{
  background-color: black;
}
.loginContainer{
  position: relative;
  margin-left: 40%;
  border-radius: 20px;
  border: 2px solid black;
  background-color: white;
  opacity: 0.8;
  height: 450px;
  width: 450px;
  top: 20px;
}
.loginHeader{
  font-size: 30px;
}
</style>
