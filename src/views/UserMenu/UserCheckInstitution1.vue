<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">订单管理</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/MyBookingMessage' }">预约信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">机构简介</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div style="display:flex;flex-direction:row">
  <div>
    <p style="text-shadow: 2px 2px;font-size:40px;color:red;position:relative;left:100px">{{form.specialName}}</p>
  <el-form :model="form" label-width="100px" style="width:400px;position:relative;left:80px">
      <el-form-item label="名称：">
          <el-input v-model="form.name" size="large" disabled></el-input>
      </el-form-item>
      <div style="margin-top:0px;margin-left:20px">
          <el-tag type="success" effect="dark" round size="large">
              {{form.local}}
          </el-tag>
          <el-tag type="success" effect="dark" round size="large" style="margin:20px">
              {{form.level}}
          </el-tag>
          <el-tag type="success" effect="dark" round size="large">
              {{form.kind}}
          </el-tag>
      </div>
      <el-form-item label="所在地区：">
        <el-cascader v-model="form.area" :options="options" size="large" disabled/>
      </el-form-item>
      <el-form-item label="地址：">
          <el-input v-model="form.address" size="large" disabled></el-input>
      </el-form-item>
      <el-form-item label="营业时间：">
          <el-input v-model="form.date" size="large" disabled></el-input>
      </el-form-item>
      <el-form-item label="联系电话：">
          <el-input v-model="form.phone" size="large" disabled></el-input>
      </el-form-item>
  </el-form>
  </div>
  <div style="margin-left:-30px">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
  <div style="width:600px;height:400px;margin-left:200px;white-space:pre-line;text-align:left;color:blue">
      {{form.introduce}}
  </div>
  </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import { useRoute } from 'vue-router'

const route = useRoute()

const institutionId = route.query.institutionId

axios.post('http://localhost:8081/graduation-project/AdminMenu/avatar/AvatarInit.php', Qs.stringify({
  institutionId: institutionId
})).then(function (response) {
  imageUrl.value = response.data[0][0]
})

const imageUrl = ref('')

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

const form = reactive({
  name: '',
  area: [],
  address: '',
  date: '',
  phone: '',
  local: '',
  level: '',
  kind: '',
  introduce: '',
  avator: '',
  specialName: ''
})

axios.post('http://localhost:8081/graduation-project/AdminMenu/InstitutionIntroduce.php', Qs.stringify({
  institutionId: institutionId
})).then(function (response) {
  form.name = response.data[1]
  form.area = response.data[0].split('_')
  for (let i = 0; i < 3; i++) {
    form.area[i] = parseInt(form.area[i])
  }
  form.address = response.data[2]
  form.date = response.data[3]
  form.phone = response.data[4]
  form.local = response.data[5]
  form.level = response.data[6]
  form.kind = response.data[7]
  form.introduce = response.data[8]
  form.avator = response.data[9]
  form.specialName = response.data[10]
})
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
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
    margin-left:150px
}
</style>
