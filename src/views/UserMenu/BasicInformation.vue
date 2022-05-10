<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">个人信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">基本信息</el-breadcrumb-item>
    <el-dropdown trigger="click" class="el-dropdown_cls">
        <span class="el-dropdown-link">
          修改信息<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="passwordDrawer = true">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="areaDrawer = true">
              修改个人信息
            </el-dropdown-item>
            <el-dropdown-item @click="uploadDrawer = true">
              上传头像
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <el-drawer v-model="uploadDrawer" title="修改个人信息" direction="ttb" :with-header="false">
    <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  </el-drawer>
  <el-drawer v-model="areaDrawer" title="修改个人信息" direction="ttb" :with-header="false">
    <el-form :model="accountForm">
      <el-form-item label="所在地" style="margin-left:600px;margin-top:50px">
      <el-cascader v-model="accountForm.area" :options="options" placeholder="请选择所在地"/>
    </el-form-item>
    <el-button @click="areaSubmit">提交</el-button>
    </el-form>
  </el-drawer>
  <el-drawer v-model="passwordDrawer" title="I am the title" :with-header="false" @close="passwordDrawerClose">
    <div style="display:flex;flex-direction:column;color:blue">
    <span style="font-size:20px">Hi there!</span>
    <span style="margin-top:30px;font-size:20px">修改密码</span>
    </div>
    <el-form :model="passwordForm" label-width="120px" style="margin-top:50px">
      <el-form-item label="身份证号">
        <el-input v-model="passwordForm.IDNumber"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input style="width:200px" v-model="passwordForm.phone"/>
        <el-button @click="click" plain style="margin-left:30px" type="text">发送短信</el-button>
      </el-form-item>
       <el-slider v-model="value" v-show="show" :show-tooltip="false" @change="sliderChange"/>
      <el-form-item label="验证码">
        <el-input v-model ="passwordForm.test"/>
      </el-form-item>
      <el-form-item label="请输入旧密码">
        <el-input v-model="passwordForm.oldPassword"/>
      </el-form-item>
      <el-form-item label="请输入新密码">
        <el-input v-model="passwordForm.newPassword"/>
      </el-form-item>
      <el-form-item label="请重新输入密码">
        <el-input v-model="passwordForm.newPasswordAgain"/>
      </el-form-item>
      <el-button plain style="margin-top:50px" size="large" @click="passwordSubmit">提交</el-button>
    </el-form>
  </el-drawer>
  <el-container class="container">
    <!-- <el-aside width="800px"> -->
    <el-card class="card-wrap" style="width: 700px">
      <el-form :model="form" label-width="120px">
        <img :src="imageUrl" class="avatar"/>
        <el-form-item label="姓名" style="margin-top:20px">
          <el-input v-model="form.name" style="width:200px" disabled/>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="form.sex" label="1" disabled>男</el-radio>
          <el-radio v-model="form.sex" label="0" disabled>女</el-radio>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="form.IDNumber" style="width:200px" disabled/>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phoneNumber" style="width:200px" disabled/>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="form.email" style="width:200px" disabled/>
        </el-form-item>
        <el-form-item label="所在地">
          <el-cascader v-model="form.area" :options="options" placeholder="请选择所在地" disabled/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- </el-aside> -->
    <el-card class="card-wrap" style="width: 700px">
      <el-main style="display:flex;flex-direction:column">
        <p style="font-size:30px">功能介绍</p>
        <p style="font-size:20px">个人信息</p>
        <p style="margin-top:5px">提供您和您的家人的信息的统计</p>
        <p style="font-size:20px">订单管理</p>
        <p style="margin-top:5px">处理您的预约以及对机构的评价</p>
        <p style="font-size:20px">疫苗信息</p>
        <p style="margin-top:5px">您可以在此处查询以及预约疫苗</p>
      </el-main>
    </el-card>
  </el-container>
</template>

<script setup>
import { ArrowRight, ArrowDown, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const accountForm = reactive({
  area: []
})

axios.post('http://localhost:8081/graduation-project/UserMenu/avatar/AvatarInit.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  imageUrl.value = response.data[0][0]
})

const beforeUpload = (uploadFile) => {
  console.log(uploadFile, 1322)
  //   imageUrl.value = URL.createObjectURL(uploadFile)
  //   console.log(imageUrl, 123)
  fileToBase64(URL.createObjectURL(uploadFile)).then(res => {
    imageUrl.value = res.base64
    axios.post('http://localhost:8081/graduation-project/UserMenu/avatar/AvatarUpload.php', Qs.stringify({
      img: res.base64,
      userId: sessionStorage.getItem('currentUserId')
    })).then(function (response) {
      console.log(response.data)
      if (response.data === 1) {
        uploadDrawer.value = false
        ElMessage({
          message: '上传头像成功.',
          type: 'success'
        })
        axios.post('http://localhost:8081/graduation-project/UserMenu/avatar/AvatarInit.php', Qs.stringify({
          userId: sessionStorage.getItem('currentUserId')
        })).then(function (response) {
          imageUrl.value = response.data[0][0]
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

const areaSubmit = () => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/UpdateAccount/UpdateArea.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    area: accountForm.area
  })).then(function (response) {
    if (response.data === 1) {
      areaDrawer.value = false
      axios.post('http://localhost:8081/graduation-project/UserMenu/BasicInformation.php', Qs.stringify({
        currentUserId: currentUserId
      }))
        .then(function (response) {
          form.name = response.data[0][1]
          form.sex = response.data[0][2]
          form.IDNumber = response.data[0][4]
          form.phoneNumber = response.data[0][5]
          form.email = response.data[0][6]
          password.value = response.data[0][7]
          form.area = response.data[0][8].split('_')
          for (let i = 0; i < 3; i++) {
            form.area[i] = parseInt(form.area[i])
          }
        })
      ElMessage({
        type: 'success',
        message: '修改地区成功!'
      })
    }
  })
}
const imageUrl = ref('')

const passwordDrawerClose = () => {
  passwordForm.IDNumber = ''
  passwordForm.phone = ''
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.newPasswordAgain = ''
  passwordForm.test = ''
  value.value = 0
  show.value = false
}

const uploadDrawer = ref(false)

const passwordForm = reactive({
  IDNumber: '',
  phone: '',
  oldPassword: '',
  newPassword: '',
  newPasswordAgain: '',
  test: ''
})

const passwordSubmit = () => {
  if (passwordForm.IDNumber === '' || passwordForm.phone === '' || passwordForm.oldPassword === '' ||
  passwordForm.newPassword === '' || passwordForm.newPasswordAgain === '') {
    ElMessage({
      type: 'error',
      message: '输入为空，请重新输入!'
    })
  } else {
    if (passwordForm.IDNumber !== form.IDNumber || passwordForm.phone !== form.phoneNumber || passwordForm.oldPassword !== password.value) {
      ElMessage({
        type: 'error',
        message: '账号信息输入有误，请重新输入!'
      })
    } else {
      if (passwordForm.newPassword !== passwordForm.newPasswordAgain) {
        ElMessage({
          type: 'error',
          message: '两次输入密码不同，请重新输入!'
        })
      } else {
        axios.post('http://localhost:8081/graduation-project/UserMenu/UpdateAccount/UpdatePassword.php', Qs.stringify({
          userId: sessionStorage.getItem('currentUserId'),
          newPassword: passwordForm.newPassword
        })).then(function (response) {
          if (response.data === 1) {
            ElMessage({
              type: 'success',
              message: '修改密码成功!'
            })
            passwordDrawer.value = false
          }
        })
      }
    }
  }
}

const value = ref(0)
const passwordDrawer = ref(false)
const areaDrawer = ref(false)
const show = ref(false)
const password = ref('')

const click = () => {
  show.value = true
  value.value = 0
}

const sliderChange = (val) => {
  if (val === 100) {
    show.value = false
    ElMessage({
      type: 'success',
      message: '短信发送成功!'
    })
  }
}

const form = reactive({
  name: '',
  sex: '',
  IDNumber: '',
  phoneNumber: '',
  province: '',
  city: '',
  email: '',
  area: [],
  date1: '',
  date2: '',
  type: [],
  desc: ''
})

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

const currentUserId = sessionStorage.getItem('currentUserId')

axios.post('http://localhost:8081/graduation-project/UserMenu/BasicInformation.php', Qs.stringify({
  currentUserId: currentUserId
}))
  .then(function (response) {
    form.name = response.data[0][1]
    form.sex = response.data[0][2]
    form.IDNumber = response.data[0][4]
    form.phoneNumber = response.data[0][5]
    form.email = response.data[0][6]
    password.value = response.data[0][7]
    form.area = response.data[0][8].split('_')
    for (let i = 0; i < 3; i++) {
      form.area[i] = parseInt(form.area[i])
    }
  })

</script>

<style scoped>
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
.container{
  /* background-image: url(@/assets/user/BasicInformation.jfif);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center, 0; */
  margin: 20px 0;
  height: 620px;
  display: flex;
  justify-content: space-around;
}
</style>
