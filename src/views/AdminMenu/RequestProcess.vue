<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">机构信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/VaccineRequest' }">疫苗请求</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">查看进程</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <el-table :data="requests" style="width: 100%" size="large">
    <el-table-column fixed prop="vaccineName" label="疫苗名称" width="150"/>
    <el-table-column prop="requestId" label="订单号" width="120" />
    <el-table-column prop="vaccineId" label="疫苗编号" width="120" />
    <el-table-column prop="sendInstitutionName" label="需求机构" width="180" />
    <el-table-column prop="getInstitutionName" label="请求机构" width="180" />
    <el-table-column prop="number" label="数量" width="120" />
    <el-table-column prop="price" label="单价" width="120" />
    <el-table-column prop="sumPrice" label="总价" width="120" />
    <el-table-column prop="sendDate" label="到达时间" width="120" />
    <el-table-column prop="requestDate" label="请求发送时间" width="120" />
    <el-table-column prop="state" label="状态" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button type="text" size="large" @click="updateForm(scope.row)">更改</el-button>
        <el-dialog v-model="formVisible" title="更新疫苗订单" append-to-body="true">
          <el-form :model="form">
            <el-form-item label="疫苗名称" :label-width="formLabelWidth">
              <el-input v-model="form.vaccineName" size="large" disabled />
            </el-form-item>
            <el-form-item label="单价" :label-width="formLabelWidth">
              <el-input v-model="form.price" size="large" @input="change($event)"/>
            </el-form-item>
            <el-form-item label="数量" :label-width="formLabelWidth">
              <el-input v-model="form.number" size="large" @input="change($event)"/>
            </el-form-item>
            <el-form-item label="到达时间" :label-width="formLabelWidth">
              <el-date-picker v-model="form.sendDate" type="date" value-format="YYYY-MM-DD" size="large" @change="change($event)"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="formVisible = false">Cancel</el-button>
              <el-button type="primary" @click="update(scope.row)">Confirm</el-button>
           </span>
          </template>
        </el-dialog>
        <el-button type="text" size="large" @click="deleteOpen(scope.row)" style="margin-left:20px">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, getCurrentInstance } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const requests = reactive([])
const formVisible = ref(false)
const form = {
  vaccineName: '',
  price: '',
  number: '',
  sendDate: ''
}

const change = (e) => {
  const { ctx: that } = getCurrentInstance()
  that.$forceUpdate()
}

const updateForm = (row) => {
  if (row.state === '未回复') {
    formVisible.value = true
    form.vaccineName = row.vaccineName
    form.price = row.price
    form.number = row.number
    form.sendDate = row.sendDate
  } else if (row.state === '已完成') {
    ElMessage({
      type: 'error',
      message: '订单已经完成,无法更新'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '订单正在进行中,无法更新'
    })
  }
}

const deleteOpen = (row) => {
  if (row.state === '未回复') {
    ElMessageBox.confirm(
      '您确定要删除订单吗?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(() => {
        deleteVaccine(row)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled'
        })
      })
  } else if (row.state === '已完成') {
    ElMessage({
      type: 'error',
      message: '订单已经完成,无法更新'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '订单正在进行中,无法删除'
    })
  }
}

const deleteVaccine = (row) => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/VaccineRequestDelete.php', Qs.stringify({
    requestId: row.requestId
  })).then(function (response) {
    if (response.data === 1) {
      requests.length = 0
      axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/SelectRequest.php', Qs.stringify({
        institutionId: sessionStorage.getItem('currentAdminId')
      })).then(function (response) {
        console.log(response.data)
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const request = {
            sendInstitutionName: response.data[i][0],
            getInstitutionName: response.data[i][1],
            vaccineId: response.data[i][2],
            vaccineName: response.data[i][3],
            number: response.data[i][4],
            price: response.data[i][5],
            sumPrice: response.data[i][6],
            sendDate: response.data[i][7],
            requestDate: response.data[i][8],
            state: response.data[i][9],
            requestId: response.data[i][10]
          }
          requests.push(request)
        }
      })
      ElMessage({
        message: '删除成功！.',
        type: 'success'
      })
    }
  })
}

const update = (row) => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/VaccineRequestUpdate.php', Qs.stringify({
    requestId: row.requestId,
    price: form.price,
    number: form.number,
    sendDate: form.sendDate
  })).then(function (response) {
    if (response.data === 1) {
      formVisible.value = false
      ElMessage({
        message: '更新成功,等待回复.',
        type: 'success'
      })
      requests.length = 0
      axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/SelectRequest.php', Qs.stringify({
        institutionId: sessionStorage.getItem('currentAdminId')
      })).then(function (response) {
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const request = {
            sendInstitutionName: response.data[i][0],
            getInstitutionName: response.data[i][1],
            vaccineId: response.data[i][2],
            vaccineName: response.data[i][3],
            number: response.data[i][4],
            price: response.data[i][5],
            sumPrice: response.data[i][6],
            sendDate: response.data[i][7],
            requestDate: response.data[i][8],
            state: response.data[i][9],
            requestId: response.data[i][10]
          }
          requests.push(request)
        }
      })
    }
  })
}

axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/SelectRequest.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  console.log(response.data)
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const request = {
      sendInstitutionName: response.data[i][0],
      getInstitutionName: response.data[i][1],
      vaccineId: response.data[i][2],
      vaccineName: response.data[i][3],
      number: response.data[i][4],
      price: response.data[i][5],
      sumPrice: response.data[i][6],
      sendDate: response.data[i][7],
      requestDate: response.data[i][8],
      state: response.data[i][9],
      requestId: response.data[i][10]
    }
    requests.push(request)
  }
})
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
}
</style>
