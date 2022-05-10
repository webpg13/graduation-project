<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">首页</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/VaccineNumber' }">机构简介</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">批量操作</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <div class="testContainer">
  <el-transfer v-model="value" :data="vaccines" style="margin-top:50px;padding-top:50px" filterable></el-transfer>
  <el-button @click="vaccineDelete" style="margin-top:30px">下线</el-button>
  <el-button @click="UpdateDate" style="margin-top:30px">更新上线日期</el-button>
  <el-button @click="updateNumber" style="margin-top:30px">更新数量</el-button>
  </div>
  <el-dialog v-model="updateDialog">
    <el-form v-model="form">
      <el-tag v-for="vaccineName in vaccineNames" :key="vaccineName.index" style="margin-left:10px">{{vaccineName.name}}</el-tag>
      <el-form-item label="请选择日期" style="margin-left:200px;width:300px;margin-top:20px">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD"/>
      </el-form-item>
      <el-form-item>
      <el-button style="margin-left:325px" size="large" @click="updateDateSubmit">提交</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import { useRouter } from 'vue-router'

const form = reactive({
  date: ''
})

const vaccines = reactive([])
const value = ref([])
const router = useRouter()
const updateDialog = ref(false)
const vaccineNames = reactive([])

const UpdateDate = () => {
  updateDialog.value = true
  const count = value.value.length
  for (let i = 0; i < count; i++) {
    axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineName.php', Qs.stringify({
      vaccineId: value.value[i]
    })).then(function (response) {
      const vaccineName = {
        name: response.data
      }
      vaccineNames.push(vaccineName)
    })
  }
}

const updateDateSubmit = () => {
  const count = value.value.length
  for (let i = 0; i < count; i++) {
    axios.post('http://localhost:8081/graduation-project/AdminMenu/Bulk/UpdateDate.php', Qs.stringify({
      date: form.date,
      vaccineId: value.value[i],
      institutionId: sessionStorage.getItem('currentAdminId')
    })).then(function (response) {
      router.push({ path: '/BulkResult', query: { id: 2 } })
    })
  }
}

const updateNumber = () => {
  ElMessageBox.confirm(
    '您确定要更新这些疫苗的数量吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      const count = value.value.length
      for (let i = 0; i < count; i++) {
        axios.post('http://localhost:8081/graduation-project/AdminMenu/Bulk/UpdateInsertNumber.php', Qs.stringify({
          institutionId: sessionStorage.getItem('currentAdminId'),
          vaccineId: value.value[i]
        }))
      }
      router.push({ path: '/BulkResult', query: { id: 3 } })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const vaccineDelete = () => {
  const count = value.value.length
  for (let i = 0; i < count; i++) {
    axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineNumberControl/VaccineNumberDelete.php', Qs.stringify({
      institutionId: sessionStorage.getItem('currentAdminId'),
      vaccineId: value.value[i]
    }))
  }
  router.push({ path: '/BulkResult', query: { id: 1 } })
}

axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  console.log(response.data)
  const sum = response.data[0]
  for (let i = 1; i <= sum; i++) {
    const vaccine = {
      key: response.data[i][0],
      label: response.data[i][1]
    }
    vaccines.push(vaccine)
  }
})

</script>

<style>
.el-breadcrumb-item{
    font-size: 30px;
}
.testContainer{
  background-color: aqua;
  height: 550px;
  position: relative;
  top: -40px;
}

.el-transfer-panel{
    width: 6000px ;
    height: 400px ;
}

</style>
