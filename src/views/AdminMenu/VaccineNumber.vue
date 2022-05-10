<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗管理</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗余量</el-breadcrumb-item>
    <el-dropdown style=";margin-left:300px">
    <span style="font-size:20px">
      特殊功能
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="dialogFormVisible = true">新增疫苗</el-dropdown-item>
        <el-dropdown-item @click="bulkUpdate" divided>批量操作</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-upload
    class="upload-demo"
    style="display: inline-block;margin: 0 16px;"
    action="https://jsonplaceholder.typicode.com/posts/"
    :before-upload="beforeUpload"
    :on-success="uploadSuccess"
    :show-file-list="false"
  >
    <el-button type="primary">批量导入</el-button>
  </el-upload>

  <a href="/疫苗模板.xls" download>
    <el-button >
    模板下载
    </el-button>
  </a>
  </el-breadcrumb>
  <el-divider/>
  <div style="width:100%;height:50px;margin-botton:0px">
    <el-dialog v-model="dialogFormVisible" title="新增疫苗">
    <el-form :model="form">
      <el-form-item label="疫苗名称" :label-width="formLabelWidth">
        <el-select v-model="form.vaccineId" size="large">
        <el-option
           v-for="item in vaccineNames"
           :key="item.vaccine_id"
           :label="item.vaccine_name"
           :value="item.vaccine_id"/>
      </el-select>
      </el-form-item>
      <el-form-item label="疫苗数量" :label-width="formLabelWidth">
        <el-input v-model="form.vaccineNumber" autocomplete="off" style="width:230px"></el-input>
      </el-form-item>
      <el-form-item label="疫苗价格" :label-width="formLabelWidth">
        <el-input v-model="form.price" autocomplete="off" style="width:230px"></el-input>
      </el-form-item>
      <el-form-item label="开始预约日期" :label-width="formLabelWidth">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" size="large"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addVaccine"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
  </div>
  <el-table :data="vaccines.slice((currentPage - 1) * pageSize, currentPage*pageSize)" style="margin-top:-60px">
    <el-table-column prop="vaccineId" label="疫苗编号" sortable />
    <el-table-column prop="vaccineName" label="疫苗名称"  />
    <el-table-column prop="number" label="疫苗余量"  />
    <el-table-column prop="price" label="价格"  />
    <el-table-column prop="date" label="上线时间"  />
    <el-table-column fixed="right" label="Operations" >
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button type="text" size="large" @click="updateFormVisible = true;updateForm.vaccineId = scope.row.vaccineId;
        updateForm.vaccineName = scope.row.vaccineName; updateForm.date = scope.row.date;updateForm.vaccineNumber = scope.row.number">修改</el-button>
        <el-dialog v-model="updateFormVisible" title="更新疫苗数量" append-to-body="true">
          <el-form :model="updateForm">
            <el-form-item label="疫苗编号" :label-width="formLabelWidth">
              <el-input v-model="updateForm.vaccineId" size="large" disabled/>
            </el-form-item>
            <el-form-item label="疫苗名称" :label-width="formLabelWidth">
              <el-input v-model="updateForm.vaccineName" size="large" disabled/>
            </el-form-item>
            <el-form-item label="疫苗数量" :label-width="formLabelWidth">
              <el-input v-model="updateForm.vaccineNumber" autocomplete="off" style="width:230px"></el-input>
            </el-form-item>
            <el-form-item label="疫苗价格" :label-width="formLabelWidth">
              <el-input v-model="updateForm.price" size="large"/>
            </el-form-item>
            <el-form-item label="上线时间" :label-width="formLabelWidth">
              <el-date-picker v-model="updateForm.date" type="date" value-format="YYYY-MM-DD" size="large" disabled/>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="updateFormVisible = false">Cancel</el-button>
              <el-button type="primary" @click="update(scope.$index,scope.row)">Confirm</el-button>
           </span>
          </template>
        </el-dialog>
        <el-button type="text" size="large" style="margin-left:20px" @click="deleteOpen(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination style="margin-left:300px;margin-top:50px"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  :current-page="currentPage"
  background=""
  :page-size="pageSize"
  layout="prev, pager, next, jumper"
  :total="totalCount">
</el-pagination>
  <el-dialog v-model="dialogTableVisible" title="批量预览">
    <el-table :data="excelTableData">
      <el-table-column v-for="item in excelHeader" :key="item" :prop="item" :label="item" > </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="handelSubmit"
          >确定导入</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
/* eslint-disable */
import { ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import { useRouter } from 'vue-router'
import { useReadRawData } from '@/hooks/useReadyExcel'
const search = ref('')

const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const handleCurrentChange = (val) => {
  currentPage.value = val
}

const router = useRouter()
const bulkUpdate = () => {
  router.push({ path: '/BulkUpdate' })
}

const vaccines = reactive([])
const vaccineNames = reactive([])
const dialogFormVisible = ref(false)
const updateFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  vaccineId: '',
  vaccineNumber: '',
  date: '',
  price: ''
})

const updateForm = reactive({
  vaccineId: '',
  vaccineName: '',
  date: '',
  vaccineNumber: '',
  price: ''
})

// 文件上传部分
const beforeUpload = async (file) => {
  const { excelData, header } = await useReadRawData(file)
  excelTableData.value=excelData
  excelHeader.value=header
  dialogTableVisible.value = true
}
const uploadSuccess = (res, file) => {
}
// 弹框
const dialogTableVisible=ref(false)
// 表头
const excelHeader=ref([])
const excelTableData=ref([])
// 点击确认
const  handelSubmit=()=>{
  // 你在这里把数据对应好上传就可以了
  const data=[]
  excelTableData.value.forEach(item=>{
    axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineControl/addVaccine.php',Qs.stringify({
      institutionId :sessionStorage.getItem('currentAdminId'),
      vaccineId:item["疫苗编号"],
      vaccineName:item["疫苗名称"],
      number:item["疫苗数量"],
      price:item["价格"],
      date:item["上线时间"]
    })).then(function(response){
      vaccines.length = 0
      axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
        institutionId: sessionStorage.getItem('currentAdminId')
      })).then(function (response) {
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const vaccine = {
            vaccineId: response.data[i][0],
            vaccineName: response.data[i][1],
            number: response.data[i][2],
            date: response.data[i][3],
            price: response.data[i][4]
          }
          vaccines.push(vaccine)
          totalCount.value = count
        }
      })
    })
    data.push(
      {vaccineId:item['疫苗编号'],vaccineName:item['疫苗名称'],vaccineNumber:item['疫苗数量'],price:item['价格'],date:item['上线时间']}
    )
  })
  dialogTableVisible.value= false
}

axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  console.log(response.data)
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const vaccine = {
      vaccineId: response.data[i][0],
      vaccineName: response.data[i][1],
      number: response.data[i][2],
      date: response.data[i][3],
      price: response.data[i][4]
    }
    vaccines.push(vaccine)
    totalCount.value = count
  }
})

axios.post('http://localhost:8081/graduation-project/Utils/GetVaccine.php').then((response) => {
  const sum = response.data[0]
  for (let i = 1; i <= sum; i++) {
    const vaccine = {
      vaccine_id: response.data[i][0],
      vaccine_name: response.data[i][1]
    }
    vaccineNames.push(vaccine)
  }
})

const update = (index, row) => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineNumberControl/VaccineNumberUpdate.php', Qs.stringify({
    institutionId: sessionStorage.getItem('currentAdminId'),
    vaccineId: updateForm.vaccineId,
    vaccineNumber: updateForm.vaccineNumber,
    price: updateForm.price
  })).then(function (response) {
    console.log(response.data)
    if (response.data === 1) {
      vaccines.length = 0
      axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
        institutionId: sessionStorage.getItem('currentAdminId')
      })).then(function (response) {
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const vaccine = {
            vaccineId: response.data[i][0],
            vaccineName: response.data[i][1],
            number: response.data[i][2],
            date: response.data[i][3],
            price: response.data[i][4]
          }
          vaccines.push(vaccine)
        }
      })
      updateFormVisible.value = false
      ElMessage({
        message: '更新疫苗数量成功.',
        type: 'success'
      })
    } else {
      ElMessage({
        message: '更新疫苗数量失败.',
        type: 'error'
      })
    }
  })
}

const deleteOpen = (row) => {
  ElMessageBox.confirm(
    '您确定要下线这支疫苗吗?',
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
}

const deleteVaccine = (row) => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineNumberControl/VaccineNumberDelete.php', Qs.stringify({
    institutionId: sessionStorage.getItem('currentAdminId'),
    vaccineId: row.vaccineId
  })).then(function (response) {
    if (response.data === 1) {
      vaccines.length = 0
      axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
        institutionId: sessionStorage.getItem('currentAdminId')
      })).then(function (response) {
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const vaccine = {
            vaccineId: response.data[i][0],
            vaccineName: response.data[i][1],
            number: response.data[i][2],
            date: response.data[i][3],
            price: response.data[i][4]
          }
          vaccines.push(vaccine)
          totalCount.value = count
        }
      })
      ElMessage({
        message: '下线疫苗成功.',
        type: 'success'
      })
    }
  })
}

const addVaccine = () => {
  axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineControl/addVaccine.php', Qs.stringify({
    institutionId: sessionStorage.getItem('currentAdminId'),
    vaccineId: form.vaccineId,
    number: form.vaccineNumber,
    date: form.date,
    price: form.price
  })).then(function (response) {
    console.log(response.data)
    if (response.data !== 0) {
      vaccines.length = 0
      axios.post('http://localhost:8081/graduation-project/Utils/GetVaccineNumber.php', Qs.stringify({
        institutionId: sessionStorage.getItem('currentAdminId')
      })).then(function (response) {
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const vaccine = {
            vaccineId: response.data[i][0],
            vaccineName: response.data[i][1],
            number: response.data[i][2],
            date: response.data[i][3],
            price: response.data[i][4]
          }
          vaccines.push(vaccine)
          totalCount.value = count
        }
      })
      dialogFormVisible.value = false
      form.vaccineId = ''
      form.vaccineNumber = ''
      form.date = ''
      form.price = ''
      ElMessage({
        message: '新增疫苗成功.',
        type: 'success'
      })
    } else {
      form.vaccineId = ''
      form.vaccineNumber = ''
      form.date = ''
      ElMessage({
        message: '新增疫苗失败,请重新输入.',
        type: 'erroe'
      })
    }
  })
}

</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
