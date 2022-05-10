<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">订单管理</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">预约信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <el-table :data="bookings">
    <el-table-column fixed prop="name" label="姓名" width="150px"/>
    <el-table-column prop="vaccineName" label="疫苗" width="200px"/>
    <el-table-column prop="institutionName" label="机构" width="200px"/>
    <el-table-column prop="date" label="日期"  width="150px"/>
    <el-table-column prop="vaccineId" label="Address" v-if="false"/>
    <el-table-column prop="institutionId" label="Address" v-if="false"/>
    <el-table-column prop="phone" label="联系电话" width="150px"/>
    <el-table-column prop="rank" label="排队号" width="110px"/>
    <el-table-column prop="price" label="价格" />
    <el-table-column fixed="right" label="Operations" width="250px">
      <template #default = "scope">
        <el-button type="text"  @click="checkInstitution(scope.row.institutionId)">查看机构</el-button>
        <el-button type="text" @click="checkClick(scope.row.vaccineId,scope.row.vaccineName)">了解疫苗</el-button>
        <el-button type="text" @click="updateBooking(scope.row)">修改</el-button>
        <el-button type="text" @click="deleteBooking(scope.row)">退订</el-button>
      </template>
    </el-table-column>
    <!-- 暂无数据时显示 -->
    <template v-slot:empty>
      <el-empty :image-size="200" description="暂无数据"></el-empty>
    </template>
  </el-table>
  <el-drawer
    v-model="drawer"
    :title="drawerTitle"
    direction="ltr"
    :before-close="handleClose"
    size="40%"
  >
    <img :src="imageUrl" class="avatar"/>
    <img :src="imageUrl1" class="avatar1"/>
  </el-drawer>
  <el-dialog v-model="updateVisible" title="修改预订">
    <el-form :model="form">
      <el-form-item label="联系电话" style="margin-left:220px">
        <el-input v-model="form.phone" style="width:220px"/>
      </el-form-item>
      <el-form-item label="预订时间" style="margin-left:220px">
        <el-date-picker v-model="form.newDate" type="date" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button @click="updateSubmit" style="margin-left:300px">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import Qs from 'qs'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const form = reactive({
  phone: '',
  newDate: '',
  vaccineId: '',
  institutionId: '',
  rank: '',
  date: ''
})

const router = useRouter()

const updateVisible = ref(false)

const bookings = reactive([])
const drawer = ref(false)
const drawerTitle = ref('')

const imageUrl = ref('')
const imageUrl1 = ref('')

const checkInstitution = (institutionId) => {
  router.push({ path: '/UserCheckInstitution1', query: { institutionId: institutionId } })
}

const checkClick = (id, name) => {
  drawer.value = true
  drawerTitle.value = name
  axios.post('http://localhost:8081/graduation-project/UserMenu/avatar/VaccineImg.php', Qs.stringify({
    vaccineId: id
  })).then(function (response) {
    imageUrl.value = response.data[0][0]
    imageUrl1.value = response.data[0][1]
  })
}

axios.post('http://localhost:8081/graduation-project/Utils/GetUserBooking.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  const sum = response.data[0]
  for (let i = 1; i <= sum; i++) {
    console.log(1)
    const booking = {
      date: response.data[i][0],
      vaccineName: response.data[i][1],
      institutionName: response.data[i][2],
      vaccineId: response.data[i][3],
      institutionId: response.data[i][4],
      name: response.data[i][5],
      phone: response.data[i][6],
      rank: response.data[i][7],
      price: response.data[i][8]
    }
    bookings.push(booking)
  }
})

const deleteBooking = (row) => {
  ElMessageBox.confirm(
    '您确定要退订吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/UserMenu/BookingControl/DeleteBooking.php', Qs.stringify({
        userId: sessionStorage.getItem('currentUserId'),
        vaccineId: row.vaccineId,
        institutionId: row.institutionId,
        date: row.date,
        rank: row.rank
      })).then(function (response) {
        if (response.data === 1) {
          ElMessage({
            type: 'success',
            message: '退订成功！'
          })
          bookings.length = 0
          axios.post('http://localhost:8081/graduation-project/Utils/GetUserBooking.php', Qs.stringify({
            userId: sessionStorage.getItem('currentUserId')
          })).then(function (response) {
            const sum = response.data[0]
            for (let i = 1; i <= sum; i++) {
              const booking = {
                date: response.data[i][0],
                vaccineName: response.data[i][1],
                institutionName: response.data[i][2],
                vaccineId: response.data[i][3],
                institutionId: response.data[i][4],
                name: response.data[i][5],
                phone: response.data[i][6],
                rank: response.data[i][7],
                price: response.data[i][8]
              }
              bookings.push(booking)
            }
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

const updateBooking = (row) => {
  updateVisible.value = true
  form.phone = row.phone
  form.newDate = row.date
  form.vaccineId = row.vaccineId
  form.institutionId = row.institutionId
  form.rank = row.rank
  form.date = row.date
}

const updateSubmit = () => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/BookingControl/UpdateBooking.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    institutionId: form.institutionId,
    vaccineId: form.vaccineId,
    rank: form.rank,
    phone: form.phone,
    newDate: form.newDate,
    date: form.date
  })).then(function (response) {
    bookings.length = 0
    axios.post('http://localhost:8081/graduation-project/Utils/GetUserBooking.php', Qs.stringify({
      userId: sessionStorage.getItem('currentUserId')
    })).then(function (response) {
      const sum = response.data[0]
      for (let i = 1; i <= sum; i++) {
        console.log(1)
        const booking = {
          date: response.data[i][0],
          vaccineName: response.data[i][1],
          institutionName: response.data[i][2],
          vaccineId: response.data[i][3],
          institutionId: response.data[i][4],
          name: response.data[i][5],
          phone: response.data[i][6],
          rank: response.data[i][7],
          price: response.data[i][8]
        }
        bookings.push(booking)
      }
    })
    updateVisible.value = false
    ElMessage({
      type: 'success',
      message: '预约成功！' + '您排在当天第' + response.data + '位'
    })
  })
}
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
</style>
