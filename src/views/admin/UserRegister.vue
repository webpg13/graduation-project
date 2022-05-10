<template>
  <div>
      <el-container class="container">
        <el-header height="70px" class="header">
          <p class="pPosition">| 账号激活</p>
        </el-header>
        <el-divider></el-divider>
        <el-main class="main">
          <el-steps :active="active" finish-status="success" style="margin-top:30px" align-center>
            <el-step title="信息校检" />
            <el-step title="绑定用户" />
            <el-step title="设置密码" />
            <el-step title="激活完成" />
          </el-steps>
          <el-form :model="form" >
            <el-form-item v-show="show.name">
              <el-input v-model="form.name" placeholder="请输入姓名" clearable/>
            </el-form-item>
            <el-form-item v-show="show.sex">
              <el-radio v-model="form.sex" label="1">男</el-radio>
              <el-radio v-model="form.sex" label="0">女</el-radio>
            </el-form-item>
            <el-form-item v-show="show.IDSelect">
              <el-select v-model="form.IDSelect" placeholder="请选择证件类型">
                <el-option v-for="item in indentify"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item v-show="show.IDNumber">
              <el-input v-model="form.IDNumber" placeholder="请输入证件号" clearable/>
            </el-form-item>
            <el-form-item v-show="show.area">
              <el-cascader v-model="form.area" :options="options" placeholder="请选择所在地"/>
            </el-form-item>
            <el-form-item v-show="show.phoneNumber">
              <el-input v-model="form.phoneNumber"  placeholder="请输入手机号" clearable/>
            </el-form-item>
            <el-form-item v-show="show.email">
              <el-input v-model="form.email" placeholder="请输入邮箱" clearable/>
            </el-form-item>
            <el-form-item v-show="show.password">
              <el-input v-model="form.password"  placeholder="请输入密码" clearable/>
            </el-form-item>
            <el-form-item v-show="show.againPassword">
              <el-input v-model="form.againPassword" placeholder="请再次输入密码" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="margin-top: 12px" @click="firstNext" v-show="show.firstNextButton">Next step</el-button>
              <el-button type="primary" style="margin-top: 12px" @click="secondLast" v-show="show.secondLastButton">Last step</el-button>
              <el-button type="primary" style="margin-top: 12px" @click="secondNext" v-show="show.secondNextButton">Next step</el-button>
              <el-button type="primary" style="margin-top: 12px" @click="thirdLast" v-show="show.thirdLastButton">Last step</el-button>
              <el-button type="primary" style="margin-top: 12px" @click="submit" v-show="show.submitButton">注册</el-button>
            </el-form-item>
          </el-form>
          <el-result icon="success" title="注册成功" sub-title="您可以用身份证号或手机号进行登录" v-show="show.registerSuccess">
            <template #extra>
              <el-link type="success" href="./#/UserLogin">返回登录界面</el-link>
            </template>
          </el-result>
        </el-main>
      </el-container>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import { ElMessage } from 'element-plus'

const show = reactive({
  name: true,
  sex: true,
  IDSelect: true,
  IDNumber: true,
  area: true,
  phoneNumber: false,
  email: false,
  password: false,
  againPassword: false,
  firstNextButton: true,
  secondLastButton: false,
  secondNextButton: false,
  thirdLastButton: false,
  submitButton: false,
  registerSuccess: false
})

const form = reactive({
  name: '',
  sex: '',
  IDSelect: '',
  IDNumber: '',
  area: [],
  phoneNumber: '',
  email: '',
  password: '',
  againPassword: ''
})

const indentify = [
  {
    value: 0,
    label: '居民身份证'
  },
  {
    value: 1,
    label: '护照'
  },
  {
    value: 2,
    label: '港澳台居民身份证'
  },
  {
    value: 3,
    label: '旅行证据'
  },
  {
    value: 4,
    label: '其他'
  }
]

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

const active = ref(0)

const firstNext = () => {
  axios.post('http://localhost:8081/graduation-project/UserRegister/FirstStep.php', Qs.stringify({
    name: form.name,
    sex: form.sex,
    IDType: form.IDSelect,
    IDNumber: form.IDNumber,
    area: form.area
  })).then(function (response) {
    switch (response.data) {
      case 0: {
        show.name = false
        show.sex = false
        show.IDSelect = false
        show.IDNumber = false
        show.area = false
        show.phoneNumber = true
        show.email = true
        show.firstNextButton = false
        show.secondLastButton = true
        show.secondNextButton = true
        active.value++
        break
      }
      case 1: {
        ElMessage.error('姓名为空，请重新输入.')
        break
      }
      case 2: {
        ElMessage.error('请选择证件类型.')
        break
      }
      case 3: {
        ElMessage.error('证件号为空，请重新输入.')
        break
      }
      case 4: {
        ElMessage.error('证件号格式不正确，请重新输入.')
        break
      }
      case 5: {
        ElMessage.error('性别未选择，请重新输入.')
        break
      }
      case 6: {
        ElMessage.error('未选择所在地，请重新输入.')
        break
      }
    }
  })
}

const secondNext = () => {
  axios.post('http://localhost:8081/graduation-project/UserRegister/SecondStep.php', Qs.stringify({
    phoneNumber: form.phoneNumber,
    email: form.email
  })).then(function (response) {
    switch (response.data) {
      case 0: {
        show.phoneNumber = false
        show.email = false
        show.password = true
        show.againPassword = true
        show.nextButton = false
        show.submitButton = true
        show.secondLastButton = false
        show.secondNextButton = false
        show.thirdLastButton = true
        show.submitButton = true
        active.value++
        break
      }
      case 1: {
        ElMessage.error('手机号为空，请重新输入.')
        break
      }
      case 2: {
        ElMessage.error('邮箱为空，请重新输入.')
        break
      }
      case 3: {
        ElMessage.error('手机号格式不正确，请重新输入.')
        break
      }
      case 4: {
        ElMessage.error('邮箱格式不正确，请重新输入.')
        break
      }
    }
  })
}

const secondLast = () => {
  show.name = true
  show.sex = true
  show.IDSelect = true
  show.IDNumber = true
  show.area = true
  show.phoneNumber = false
  show.email = false
  show.firstNextButton = true
  show.secondLastButton = false
  show.secondNextButton = false
  active.value--
}

const thirdLast = () => {
  show.phoneNumber = true
  show.email = true
  show.password = false
  show.againPassword = false
  show.secondLastButton = true
  show.secondNextButton = true
  show.thirdLastButton = false
  show.submitButton = false
  active.value--
}

const submit = () => {
  axios.post('http://localhost:8081/graduation-project/UserRegister/RegisterResult.php', Qs.stringify({
    name: form.name,
    sex: form.sex,
    IDType: form.IDSelect,
    IDNumber: form.IDNumber,
    area: form.area,
    phoneNumber: form.phoneNumber,
    email: form.email,
    password: form.password,
    againPassword: form.againPassword
  })).then(function (response) {
    switch (response.data) {
      case 0: {
        show.password = false
        show.againPassword = false
        show.thirdLastButton = false
        show.submitButton = false
        show.registerSuccess = true
        break
      }
      case 1: {
        ElMessage.error('密码为空，请重新输入.')
        break
      }
      case 2: {
        ElMessage.error('再次输入密码为空，请重新输入.')
        break
      }
      case 3: {
        ElMessage.error('两次密码不一样，请重新输入.')
        break
      }
      case 4: {
        ElMessage.error('服务器连接失败，请重试网络.')
        break
      }
    }
  })
}
</script>

<style scoped>
.container{
  position: fixed;
  top:0;
  height: 750px;
  width: 100%;
}
.header{
  font-size: 20px;
  text-align: left;
}
.pPosition{
  margin-left: 250px;
}
.main{
  width: 100%;
  height: 100%;
}
.el-divider{
  margin: 0px 0;
  background: 0 0;
  border-top: 1px solid #E6EBF5;
}
.el-form-item{
  position: relative;
  top :100px
}
.el-form{
  width: 360px;
  position: relative;
  margin: 0 auto;
}
.example-block {
  margin: 1rem;
}
.example-demonstration {
  margin: 1rem;
}
</style>
