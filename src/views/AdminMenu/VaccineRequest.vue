<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">机构信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗请求</el-breadcrumb-item>
    <el-button @click="check" style="font-size:30px" type="text">查看进程</el-button>
  </el-breadcrumb>
  <el-divider/>
  <el-container style="height:560px">
    <el-aside style="width:700px;">
      <p style="font-size:25px;color:blue;margin-right:50px">{{institutionName}}</p>
  <el-form :model="form" style="margin-left:120px;margin-top:20px" label-width="120px">
    <el-form-item label="请求地区">
      <el-cascader v-model="form.area" :options="options" @change="selectChange" size="large"/>
    </el-form-item>
    <el-form-item label="请求机构">
      <el-select v-model="form.institutionId" size="large">
        <el-option
           v-for="item in institutions"
           :key="item.institutionId"
           :label="item.institutionName"
           :value="item.institutionId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="请求疫苗">
      <el-select v-model="form.vaccineId" size="large" @change="vaccineChange">
        <el-option
           v-for="item in vaccines"
           :key="item.vaccine_id"
           :label="item.vaccine_name"
           :value="item.vaccine_id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="请求数量">
      <el-slider v-model="form.number" show-input max="100" style="width:300px" size="large"/>
    </el-form-item>
    <el-form-item label="请求单价">
      <el-input-number v-model="form.price" :precision="2" :step="0.1" :max="500" size="large"/>
    </el-form-item>
    <el-form-item label="请求到达日期">
      <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" size="large"/>
    </el-form-item>
    <el-form-item>
      <el-button round @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
  </el-aside>
  <el-main>
        <p style="text-align:center">市内疫苗统计</p>
        <el-table :data ="areaVaccines" style="width:100%;margin-top:10px">
          <el-table-column prop="area" label="地区" width="150px"/>
          <el-table-column prop="name" label="机构名称" width="150px"/>
          <el-table-column prop="number" label="疫苗余量" />
        </el-table>
      </el-main>
  </el-container>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const institutionName = ref('')
const vaccines = reactive([])
const institutions = reactive([])
const areaVaccines = reactive([])
const router = useRouter()

const check = () => {
  router.push({
    path: '/RequestProcess'
  })
}

const form = reactive({
  area: [],
  institutionId: '',
  vaccineId: '',
  number: '',
  date: '',
  price: ''
})

const submit = () => {
  ElMessageBox.confirm(
    '您确定要提交这份订单吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      if (form.area === [] || form.institutionId === '' || form.vaccineId === '' || form.number === '' || form.date === '' || parseInt(form.price) < 0) {
        ElMessage({
          type: 'error',
          message: '您输入的信息不完整，请重新输入！'
        })
      } else {
        axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/VaccineRequestSubmit.php', Qs.stringify({
          sendInstitutionId: sessionStorage.getItem('currentAdminId'),
          getInstitutionId: form.institutionId,
          vaccineId: form.vaccineId,
          number: form.number,
          price: form.price,
          requestDate: new Date(),
          sendDate: form.date
        })).then(function (response) {
          console.log(response.data)
          if (response.data === 1) {
            ElMessage({
              message: '提交成功,等待回复.',
              type: 'success'
            })
          }
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'submit canceled'
      })
    })
}

axios.post('http://localhost:8081/graduation-project/Utils/GetInstitution.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  institutionName.value = response.data[0][2]
})

const vaccineChange = (value) => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/VaccineNumberRank.php', Qs.stringify({
    institutionId: sessionStorage.getItem('currentAdminId'),
    vaccineId: value
  })).then(function (response) {
    areaVaccines.length = 0
    const count = response.data[0]
    for (let i = 1; i <= count; i++) {
      const areaVaccine = {
        area: response.data[i][0],
        name: response.data[i][1],
        number: response.data[i][2]
      }
      areaVaccines.push(areaVaccine)
    }
  })
}

axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/VaccineNumberRank.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId'),
  vaccineId: 1
})).then(function (response) {
  areaVaccines.length = 0
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const areaVaccine = {
      area: response.data[i][0],
      name: response.data[i][1],
      number: response.data[i][2]
    }
    areaVaccines.push(areaVaccine)
  }
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
.el-breadcrumb-item{
    font-size: 30px;
}
</style>
