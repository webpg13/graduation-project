<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin:0;padding:0;background-color:#1877ef">
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/VaccineShop' }">疫苗选购</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">接种机构</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin:0;padding:0;background-color:#1877ef"/>
  <div class="divContainer">
  <div style="display:flex;flex-direction:row">
    <span style="margin-left:200px;margin-top:20px;font-size:20px;color:black">请选择地区：</span>
    <el-cascader v-model="area" :options="options" @change="handleChange"  style="margin-right:400px;margin-top:20px"/>
    <el-switch v-model="switchValue" active-text="显示全部机构" inactive-text="不显示" size="large" style="margin-top:20px;margin-left:-200px" @change="switchChange"/>
  </div>
  <div class="container">
  <el-card class="box-card" v-for="institution in institutions" :key="institution.institutionId">
    <template #header>
      <div class="card-header">
        <span>{{institution.name}}</span>
        <el-button style="margin-left:150px" @click="checkInstitution(institution.institutionId)">查看</el-button>
        <el-button style="margin-left:10px" @click="click(institution.institutionId)">预约</el-button>
      </div>
    </template>
    <p>地址：{{institution.address}}</p>
    <p>营业时间：{{institution.date}}</p>
    <p>联系电话：{{institution.phoneNumber}}</p>
  </el-card>
  </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import Qs from 'qs'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'

const area = ref([])
const route = useRoute()
const router = useRouter()
const switchValue = ref(false)

const institutions = reactive([])

const vaccineId = route.query.vaccineId
const vaccineName = route.query.vaccineName

axios.post('http://localhost:8081/graduation-project/Vaccine/InstitutionInit.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId'),
  vaccineId: vaccineId
})).then(function (response) {
  console.log(response.data)
  area.value = response.data[1].split('_')
  for (let i = 0; i < 3; i++) {
    area.value[i] = parseInt(area.value[i])
  }
  const sum = response.data[0]
  for (let i = 2; i <= sum + 1; i++) {
    const institution = {
      institutionId: response.data[i][0],
      name: response.data[i][2],
      address: response.data[i][3],
      date: response.data[i][4],
      phoneNumber: response.data[i][5]
    }
    institutions.push(institution)
  }
})

const switchChange = (val) => {
  institutions.length = 0
  if (val === true) {
    axios.post('http://localhost:8081/graduation-project/Vaccine/SwitchChange.php', Qs.stringify({
      vaccineId: vaccineId,
      area: area.value[0] + '_' + area.value[1] + '_' + area.value[2],
      message: 1
    })).then(function (response) {
      console.log(response.data)
      const sum = response.data[0]
      for (let i = 1; i <= sum; i++) {
        const institution = {
          institutionId: response.data[i][0],
          name: response.data[i][2],
          address: response.data[i][3],
          date: response.data[i][4],
          phoneNumber: response.data[i][5]
        }
        institutions.push(institution)
      }
    })
  } else {
    axios.post('http://localhost:8081/graduation-project/Vaccine/SwitchChange.php', Qs.stringify({
      vaccineId: vaccineId,
      area: area.value[0] + '_' + area.value[1] + '_' + area.value[2],
      message: 0
    })).then(function (response) {
      const sum = response.data[0]
      for (let i = 1; i <= sum; i++) {
        const institution = {
          institutionId: response.data[i][0],
          name: response.data[i][2],
          address: response.data[i][3],
          date: response.data[i][4],
          phoneNumber: response.data[i][5]
        }
        institutions.push(institution)
      }
    })
  }
}

const click = (institutionId) => {
  router.push({ path: '/VaccineItem', query: { vaccineId: vaccineId, vaccineName: vaccineName, institutionId: institutionId } })
}

const checkInstitution = (institutionId) => {
  router.push({ path: '/UserCheckInstitution', query: { institutionId: institutionId, vaccineId: vaccineId, vaccineName: vaccineName } })
}

const handleChange = (value) => {
  institutions.length = 0
  axios.post('http://localhost:8081/graduation-project/Vaccine/VaccineChangeArea.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    vaccineId: vaccineId,
    area: value[0] + '_' + value[1] + '_' + value[2],
    message: switchValue.value
  })).then(function (response) {
    const sum = response.data[0]
    for (let i = 1; i <= sum; i++) {
      const institution = {
        institutionId: response.data[i][0],
        name: response.data[i][2],
        address: response.data[i][3],
        date: response.data[i][4],
        phoneNumber: response.data[i][5]
      }
      institutions.push(institution)
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
.divContainer{
  background-image: url(@/assets/user/VaccineRecord.jfif);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center, 0;
  height: 620px
}
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: inline-block;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  margin-left: 80px;
  margin-top: 50px;
}
.container{
    display: flex;
    flex-direction: row;
}
</style>
