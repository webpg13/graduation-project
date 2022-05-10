<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">缺苗登记</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class="container">
    <el-card class="card-wrap" style="width: 800px">
      <el-form label-width="120px" :model="form">
        <el-form-item label="疫苗名称" style="margin-top:30px;color:red" >
            <el-select v-model="form.vaccineId" size="large">
            <el-option
              v-for="item in vaccines"
              :key="item.vaccine_id"
              :label="item.vaccine_name"
              :value="item.vaccine_id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="意向地区" style="margin-top:30px">
          <el-cascader v-model="form.area" :options="options" @change="selectChange" size="large"/>
        </el-form-item>
        <el-form-item label="意向接种机构" style="margin-top:30px">
          <el-select v-model="form.institutionId" size="large">
            <el-option
              v-for="item in institutions"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId"/>
            </el-select>
        </el-form-item>
        <el-form-item label="联系人姓名" style="margin-top:30px">
          <el-input v-model="form.name" size="large"/>
        </el-form-item>
        <el-form-item label="联系电话" style="margin-top:30px">
          <el-input v-model="form.phone" size="large"/>
        </el-form-item>
        <el-form-item label="身份证号" style="margin-top:30px">
          <el-input v-model="form.IDNumber" size="large"/>
        </el-form-item>
        <el-form-item>
        <el-button @click="click">订阅到苗提醒</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const vaccines = reactive([])
const institutions = reactive([])

axios.post('http://localhost:8081/graduation-project/Utils/GetUserAccount.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  form.name = response.data[0][1]
  form.IDNumber = response.data[0][4]
  form.phone = response.data[0][5]
})

axios.post('http://localhost:8081/graduation-project/Utils/GetVaccine.php').then((response) => {
  const sum = response.data[0]
  for (let i = 1; i <= sum; i++) {
    const vaccine = {
      vaccine_id: response.data[i][0],
      vaccine_name: response.data[i][1]
    }
    vaccines.push(vaccine)
  }
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

const click = () => {
  ElMessageBox.confirm(
    '您确定要提交缺苗登记?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/UserMenu/LackRegister.php', Qs.stringify({
        vaccineId: form.vaccineId,
        area: form.area[0] + '_' + form.area[1] + '_' + form.area[2],
        institutionId: form.institutionId,
        name: form.name,
        phone: form.phone,
        IDNumber: form.IDNumber
      })).then(function (response) {
        if (response.data !== 0) {
          ElMessage({
            message: '提交成功，请等待回复.',
            type: 'success'
          })
          form.vaccineId = ''
          form.area = []
          form.institutionId = ''
          form.name = ''
          form.phone = ''
          form.IDNumber = ''
        }
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
  kind: '',
  vaccineId: '',
  area: [],
  institutionId: '',
  name: '',
  phone: '',
  IDNumber: ''
})

const selectChange = (value) => {
  institutions.length = 0
  axios.post('http://localhost:8081/graduation-project/Vaccine/VaccineChangeArea.php', Qs.stringify({
    area: value[0] + '_' + value[1] + '_' + value[2]
  })).then(function (response) {
    console.log(response.data)
    const sum = response.data[0]
    for (let i = 1; i <= sum; i++) {
      const institution = {
        institutionId: response.data[i][0],
        institutionName: response.data[i][2]
      }
      institutions[i - 1] = institution
    }
    console.log(institutions)
  })
}

</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.container{
  /* background-image: url(@/assets/user/LackRegister.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center, 0; */
  margin: 20px 0;
  height: 620px;
  display: flex;
  justify-content: space-around;
}
</style>
