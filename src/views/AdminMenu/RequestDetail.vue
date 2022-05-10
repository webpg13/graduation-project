<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">机构请求</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/RequestReply' }">请求答复</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">订单详情</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <div style="display : flex;flex-direction:row">
    <div style="height:500px;width:800px">
  <el-form style="width:350px;margin-left:200px;margin-top:50px">
    <el-form-item label="订单编号">
      <el-input v-model="row[10]" disabled/>
    </el-form-item>
    <el-form-item label="请求机构">
      <el-input v-model="row[0]" disabled/>
    </el-form-item>
    <el-form-item label="疫苗编号">
      <el-input v-model="row[2]" disabled/>
    </el-form-item>
    <el-form-item label="疫苗名称">
      <el-input v-model="row[3]" disabled/>
    </el-form-item>
    <el-form-item label="请求数量">
      <el-input v-model="row[4]" disabled/>
    </el-form-item>
    <el-form-item label="请求单价">
      <el-input v-model="row[5]" disabled/>
    </el-form-item>
    <el-form-item label="请求总价">
      <el-input v-model="row[6]" disabled/>
    </el-form-item>
    <el-form-item label="请求到达时间">
      <el-input v-model="row[7]" disabled/>
    </el-form-item>
    <el-form-item>
      <p style="margin-left:120px;font-size:30px;color:blue" v-show="pShow">{{pData}}</p>
      <el-button v-show="buttonShow" @click = "approval" size="large" style="margin-left:50px">同意</el-button>
      <el-button v-show="buttonShow" @click = "refuse" size="large" style="margin-left:50px">拒绝</el-button>
    </el-form-item>
  </el-form>
    </div>
  <el-table :data="vaccines" style="margin-left:100px;margin-top:50px">
    <el-table-column prop="vaccineId" label="编号" width="180" />
    <el-table-column prop="vaccineName" label="名称" width="180" />
    <el-table-column prop="vaccineNumber" label="数量" />
  </el-table>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import Qs from 'qs'

const vaccines = reactive([])

axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const vaccine = {
      vaccineId: response.data[i][0],
      vaccineName: response.data[i][1],
      vaccineNumber: response.data[i][2]
    }
    vaccines.push(vaccine)
  }
})

const refuse = () => {
  ElMessageBox.confirm(
    '您确定要拒绝这张订单吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/AdminMenu/RequestControl/RequestRefuse.php', Qs.stringify({
        requestId: row[10]
      })).then(function (response) {
        if (response.data === 1) {
          pShow.value = true
          buttonShow.value = false
          pData.value = '已拒绝'
          ElMessage({
            type: 'success',
            message: '拒绝成功！'
          })
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

const approval = () => {
  ElMessageBox.confirm(
    '您确定要同意这张订单吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/AdminMenu/RequestControl/RequestApproval.php', Qs.stringify({
        requestId: row[10]
      })).then(function (response) {
        if (response.data === 1) {
          pShow.value = true
          buttonShow.value = false
          pData.value = '已同意'
          ElMessage({
            type: 'success',
            message: '接受成功，请及时发货！'
          })
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

const route = useRoute()
const row = route.query.row
const pShow = ref(false)
const buttonShow = ref(false)
const pData = ref('')
if (row[9] === '未回复') {
  buttonShow.value = true
} else {
  pShow.value = true
  pData.value = row[9]
}

console.log(row)
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
}
</style>
