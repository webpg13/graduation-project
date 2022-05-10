<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">用户请求</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">预约信息</el-breadcrumb-item>
    <el-button @click="bulkDelete">批量删除</el-button>
    <el-button @click="click">批量完成</el-button>
    <el-date-picker v-model="date" type="date" value-format="YYYY-MM-DD" @change="dateChange"/>
    <el-button @click="checkAll">查看所有</el-button>
    <el-button @click="exportExcelClick">导出</el-button>
  </el-breadcrumb>
  <el-divider/>
  <el-table :data="bookingDatas.slice((currentPage - 1) * pageSize, currentPage*pageSize)" style="width: 100%"
  @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column fixed label="疫苗名称" prop="vaccineName" width="180px" :filters="vaccines" :filter-method="vaccineFilter"/>
    <el-table-column label="疫苗编号" prop="vaccineId" sortable width="150px"/>
    <el-table-column prop="userId" v-if="false"/>
    <el-table-column label="姓名" prop="bookingPersonName" />
    <el-table-column label="身份证号" prop="IDNumber" width="180px"/>
    <el-table-column label="联系电话" prop="phone" width="120px"/>
    <el-table-column label="预约日期" prop="date" width="120px" sortable/>
    <el-table-column label="位次" prop="rank" />
    <el-table-column label="价格" prop="price" />
    <el-table-column  fixed="right" align="right" width="200px">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="updateDialog(scope.$index,scope.row)">修改</el-button>
        <el-dialog v-model="dialogFormVisible" title="Shipping address" append-to-body=true>
          <el-form :model="form">
            <el-form-item label="疫苗名称" :label-width="formLabelWidth">
              <el-input v-model="form.vaccineName" autocomplete="off" disabled/>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="form.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="预约日期" :label-width="formLabelWidth">
              <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
            </span>
          </template>
        </el-dialog>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          style="margin-left:10px"
          >删除</el-button
        >
        <el-button
          size="small"
          type="success"
          @click="handleComplete(scope.$index, scope.row)"
          >完成</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="el-pagination_cls"
  @current-change="handleCurrentChange"
  :current-page="currentPage"
  background=""
  :page-size="pageSize"
  layout="prev, pager, next, jumper"
  :total="count">
  </el-pagination>
  <el-dialog v-model="completeDialogVisible" title="完成预约">
    <el-form v-model="completeForm" style="margin-left:220px">
      <el-form-item label="疫苗名称">
        <el-input v-model="completeForm.vaccineName" disabled style="width:200px"/>
      </el-form-item>
      <el-form-item label="姓名" style="margin-left:23px">
        <el-input v-model="completeForm.personName" disabled style="width:200px"/>
      </el-form-item>
      <el-form-item label="身份证号" style="margin-left:-3px">
        <el-input v-model="completeForm.IDNumber" disabled style="width:200px"/>
      </el-form-item>
      <el-form-item label="日期" style="margin-left:23px">
        <el-input v-model="completeForm.date" disabled style="width:200px"/>
      </el-form-item>
      <el-form-item label="特殊说明" style="margin-left:-3px">
        <el-input v-model="completeForm.description" style="width:200px"/>
      </el-form-item>
      <el-form-item style="margin-left:100px">
        <el-button size="large" @click="completeSubmit">提交</el-button>
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
import { xlsx } from '@/hooks/exportXlsx'

const date = ref('')
const dateChange = () => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/Booking/DateChange.php', Qs.stringify({
    institutionId: sessionStorage.getItem('currentAdminId'),
    date: date.value
  })).then(function (response) {
    bookingDatas.length = 0
    const vaccineSum = response.data[0]
    for (let i = 1; i <= vaccineSum; i++) {
      const bookingData = {
        vaccineName: response.data[i][0],
        bookingPersonName: response.data[i][1],
        IDNumber: response.data[i][2],
        phone: response.data[i][3],
        date: response.data[i][4],
        rank: response.data[i][5],
        price: response.data[i][6],
        vaccineId: response.data[i][7],
        userId: response.data[i][8]
      }
      bookingDatas.push(bookingData)
      count.value = vaccineSum
    }
  })
}

const checkAll = () => {
  date.value = ''
  bookingDatas.length = 0
  axios.post('http://localhost:8081/graduation-project/AdminMenu/BookingInit.php', Qs.stringify({
    institutionId: sessionStorage.getItem('currentAdminId')
  })).then(function (response) {
    const vaccineSum = response.data[0]
    for (let i = 1; i <= vaccineSum; i++) {
      const bookingData = {
        vaccineName: response.data[i][0],
        bookingPersonName: response.data[i][1],
        IDNumber: response.data[i][2],
        phone: response.data[i][3],
        date: response.data[i][4],
        rank: response.data[i][5],
        price: response.data[i][6],
        vaccineId: response.data[i][7],
        userId: response.data[i][8]
      }
      bookingDatas.push(bookingData)
      count.value = vaccineSum
    }
  })
}

const vaccines = reactive([])
axios.post('http://localhost:8081/graduation-project/Utils/GetVaccine.php').then(function (response) {
  vaccines.length = 0
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const vaccine = {
      text: response.data[i][1],
      value: response.data[i][0]
    }
    vaccines.push(vaccine)
  }
})

const listHand = {
  vaccineName: '疫苗名称',
  bookingPersonName: '预约人',
  IDNumber: '身份证号',
  phone: '联系电话',
  rank: '预约位次',
  price: '价格'
}

const exportDatas = reactive([])

const exportExcelClick = () => {
  const sum = bookingDatas.length
  for (let i = 0; i < sum; i++) {
    const exportData = {
      vaccineName: bookingDatas[i].vaccineName,
      bookingPersonName: bookingDatas[i].bookingPersonName,
      IDNumber: bookingDatas[i].IDNumber,
      phone: bookingDatas[i].phone,
      rank: bookingDatas[i].rank,
      price: bookingDatas[i].price
    }
    exportDatas.push(exportData)
  }
  xlsx(exportDatas, listHand, '疫苗')
}

const vaccineFilter = (value, row, column) => {
  return row.vaccineId === value
}

const multipleSelection = ref([])

const bulkDelete = () => {
  const sum = multipleSelection.value.length
  if (sum === 0) {
    ElMessage({
      type: 'error',
      message: '选择为空!'
    })
  } else {
    ElMessageBox.confirm(
      '您确定要删除这些预约吗?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(() => {
        for (let i = 0; i < sum; i++) {
          axios.post('http://localhost:8081/graduation-project/AdminMenu/Booking/BookingDelete.php', Qs.stringify({
            vaccineName: multipleSelection.value[i].vaccineName,
            IDNumber: multipleSelection.value[i].IDNumber,
            institutionId: sessionStorage.getItem('currentAdminId'),
            userId: multipleSelection.value[i].userId,
            vaccineId: multipleSelection.value[i].vaccineId
          })).then(function (response) {
            if (i === sum - 1) {
              ElMessage({
                type: 'success',
                message: '批量删除预约成功!'
              })
              bookingDatas.length = 0
              axios.post('http://localhost:8081/graduation-project/AdminMenu/BookingInit.php', Qs.stringify({
                institutionId: sessionStorage.getItem('currentAdminId')
              })).then(function (response) {
                const vaccineSum = response.data[0]
                for (let i = 1; i <= vaccineSum; i++) {
                  const bookingData = {
                    vaccineName: response.data[i][0],
                    bookingPersonName: response.data[i][1],
                    IDNumber: response.data[i][2],
                    phone: response.data[i][3],
                    date: response.data[i][4],
                    rank: response.data[i][5],
                    price: response.data[i][6],
                    vaccineId: response.data[i][7],
                    userId: response.data[i][8]
                  }
                  bookingDatas.push(bookingData)
                  count.value = vaccineSum
                }
              })
            }
          })
        }
      })
  }
}

const click = () => {
  console.log(multipleSelection.value[0])
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const count = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const handleCurrentChange = (val) => {
  currentPage.value = val
}

const bookingDatas = reactive([])

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const completeDialogVisible = ref(false)
const completeForm = reactive({
  vaccineName: '',
  personName: '',
  date: '',
  description: '',
  IDNumber: '',
  vaccineId: '',
  institutionId: '',
  userId: '',
  phone: '',
  rank: ''
})

const handleComplete = (index, row) => {
  completeDialogVisible.value = true
  completeForm.vaccineName = row.vaccineName
  completeForm.personName = row.bookingPersonName
  completeForm.date = row.date
  completeForm.IDNumber = row.IDNumber
  completeForm.vaccineId = row.vaccineId
  completeForm.institutionId = row.institutionId
  completeForm.userId = row.userId
  completeForm.phone = row.phone
  completeForm.rank = row.rank
}

const completeSubmit = () => {
  ElMessageBox.confirm(
    '您确定要完成这条预约吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/AdminMenu/Booking/BookingComplete.php', Qs.stringify({
        vaccineId: completeForm.vaccineId,
        IDNumber: completeForm.IDNumber,
        date: completeForm.date,
        vaccineName: completeForm.vaccineName,
        personName: completeForm.personName,
        institutionId: sessionStorage.getItem('currentAdminId'),
        userId: completeForm.userId,
        description: completeForm.description,
        phone: completeForm.phone,
        rank: completeForm.rank
      })).then(function (response) {
        console.log(response.data)
        completeDialogVisible.value = false
        bookingDatas.length = 0
        axios.post('http://localhost:8081/graduation-project/AdminMenu/BookingInit.php', Qs.stringify({
          institutionId: sessionStorage.getItem('currentAdminId')
        })).then(function (response) {
          const sum = response.data[0]
          for (let i = 1; i <= sum; i++) {
            const bookingData = {
              vaccineName: response.data[i][0],
              bookingPersonName: response.data[i][1],
              IDNumber: response.data[i][2],
              phone: response.data[i][3],
              date: response.data[i][4],
              rank: response.data[i][5],
              price: response.data[i][6],
              vaccineId: response.data[i][7],
              userId: response.data[i][8]
            }
            bookingDatas.push(bookingData)
            count.value = sum
          }
        })
        ElMessage({
          message: '完成疫苗注射成功.',
          type: 'success'
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const updateDialog = (index, row) => {
  dialogFormVisible.value = true
  form.vaccineName = row.vaccineName
  form.phone = row.phone
  form.date = row.date
}

const form = reactive({
  vaccineName: '',
  phone: '',
  date: ''
})

const handleDelete = (index, row) => {
  ElMessageBox.confirm(
    '您确定要删除这条预约吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      const vaccineName = row.vaccineName
      const IDNumber = row.IDNumber
      axios.post('http://localhost:8081/graduation-project/AdminMenu/Booking/BookingDelete.php', Qs.stringify({
        vaccineName: vaccineName,
        IDNumber: IDNumber,
        institutionId: sessionStorage.getItem('currentAdminId'),
        userId: row.userId,
        vaccineId: row.vaccineId
      })).then(function (response) {
        console.log(response.data)
        if (response.data !== 0) {
          ElMessage({
            message: '取消预约成功.',
            type: 'success'
          })
          bookingDatas.length = 0
          axios.post('http://localhost:8081/graduation-project/AdminMenu/BookingInit.php', Qs.stringify({
            institutionId: sessionStorage.getItem('currentAdminId')
          })).then(function (response) {
            const sum = response.data[0]
            for (let i = 1; i <= sum; i++) {
              const bookingData = {
                vaccineName: response.data[i][0],
                bookingPersonName: response.data[i][1],
                IDNumber: response.data[i][2],
                phone: response.data[i][3],
                date: response.data[i][4],
                rank: response.data[i][5],
                price: response.data[i][6],
                vaccineId: response.data[i][7],
                userId: response.data[i][8]
              }
              bookingDatas.push(bookingData)
              count.value = sum
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

axios.post('http://localhost:8081/graduation-project/AdminMenu/BookingInit.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  const sum = response.data[0]
  for (let i = 1; i <= sum; i++) {
    const bookingData = {
      vaccineName: response.data[i][0],
      bookingPersonName: response.data[i][1],
      IDNumber: response.data[i][2],
      phone: response.data[i][3],
      date: response.data[i][4],
      rank: response.data[i][5],
      price: response.data[i][6],
      vaccineId: response.data[i][7],
      userId: response.data[i][8]
    }
    bookingDatas.push(bookingData)
    count.value = sum
  }
})

</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
}
</style>
