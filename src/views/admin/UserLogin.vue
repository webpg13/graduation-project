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
          <el-header height="30px" class="loginHeader">账号登录</el-header>
          <el-divider class="divider" />
          <el-main>
            <el-form :model="form" label-width="60px">
              <el-form-item label="用户名">
                <el-input v-model="form.name" placeholder="请输入手机号或者身份证号" :prefix-icon="Avatar" clearable/>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock" show-password clearable/>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="checked" style="margin-left:10px">7天内免登录</el-checkbox>
                <el-link href="www.baidu.com" style="margin-left:100px">忘记密码</el-link>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width:80%" @click="login">登录</el-button>
              </el-form-item>
              <el-form-item>
                <el-link href="www.baidu.com" style="margin-left:15px">登录帮助</el-link>
                <el-link href="./#/AdminRegister" style="margin-left:140px">账号激活</el-link>
              </el-form-item>
              <el-divider>联合登陆方式</el-divider>
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
import { ref, reactive } from 'vue'
import Qs from 'qs'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const form = reactive({
  name: '',
  password: ''
})

const checked = ref(false)

/* const onSubmit = () => {
  console.log('submit!')
} */

const login = () => {
  axios.post('http://localhost:8081/graduation-project/UserLogin/LoginResult.php', Qs.stringify({
    name: form.name,
    password: form.password
  })).then(function (response) {
    switch (response.data) {
      case 'A': {
        ElMessage.error('用户名为空，请重新输入.')
        break
      }
      case 'B': {
        ElMessage.error('密码为空，请重新输入.')
        break
      }
      case 'C': {
        ElMessage.error('账号不存在，请重新输入.')
        break
      }
      case 'D': {
        ElMessage.error('密码错误，请重新输入.')
        break
      }
      default: {
        sessionStorage.setItem('currentUserId', response.data)
        sessionStorage.setItem('isLogin', true)
        store.dispatch('setCurrentUserId', response.data)
        store.dispatch('changeLoginState', true)
        router.push({
          path: '/BasicInformation'
        })
      }
    }
  })
}
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
