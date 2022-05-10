<template>
<el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">预约管理</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">预约评价</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <el-table :data="messages" style="width: 100%">
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="date" label="日期" />
    <el-table-column prop="vaccineName" label="疫苗" />
    <el-table-column prop="institutionName" label="机构" />
    <el-table-column prop="description" label="特殊说明" />
    <el-table-column prop="vaccineId" v-if="false" />
    <el-table-column prop="institutionId" v-if="false" />
    <el-table-column prop="completeId" v-if="false" />
    <el-table-column prop="assess" v-if="false" />
    <el-table-column label="评分">
      <template #default="scope">
        <el-rate v-model="scope.row.assess" v-if="scope.row.assess !== '0'" disabled/>
        <p v-if="scope.row.assess === '0'">未评价</p>
      </template>
    </el-table-column>
    <el-table-column prop="vaccineId" v-if="false"/>
    <el-table-column prop="institutionId" v-if="false"/>
    <el-table-column prop="completeId" v-if="false"/>
    <el-table-column fixed="right" label="Operations">
      <template #default="scope">
        <el-button type="text" @click ="checkClick(scope.row)">
          查看详情
        </el-button>
        <el-button type="text" v-if="scope.row.assess === '0'" @click="rateClick(scope.row)">
          评分
        </el-button>
      </template>
    </el-table-column>
    <!-- 暂无数据时显示 -->
    <template v-slot:empty>
      <el-empty :image-size="200" description="暂无数据"></el-empty>
    </template>
  </el-table>
  <el-dialog v-model="rateDialog" title="评价">
      <el-form v-model="rateForm">
          <el-form-item label="评分">
              <el-rate v-model="rateForm.rateScore" :texts="['oops', 'disappointed', 'normal', 'good', 'great']" show-text />
          </el-form-item>
          <el-form-item label="评价">
              <el-input v-model="rateForm.rateText" type="textarea" :rows="3"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="rateSubmit">提交</el-button>
          </el-form-item>
      </el-form>
  </el-dialog>
  <el-drawer
    v-model="drawer"
    title="查看详情"
    :direction="ltr"
  >
  <div style="display:flex;flex-direction:column">
  <span style="margin-top:20px">姓名：{{detailForm.name}}</span>
  <span style="margin-top:20px">身份证号：{{detailForm.IDNumber}}</span>
  <span style="margin-top:20px">联系电话:{{detailForm.phone}}</span>
  <span style="margin-top:20px">机构：{{detailForm.institutionName}}</span>
  <span style="margin-top:20px">疫苗：{{detailForm.vaccineName}}</span>
  <span style="margin-top:20px">日期：{{detailForm.date}}</span>
  <span style="margin-top:20px">特别说明：{{detailForm.description}}</span>
  <span style="margin-top:20px">地址：{{detailForm.address}}</span>
  <span style="margin-top:20px">机构联系电话：{{detailForm.IPhone}}</span>
  </div>
  </el-drawer>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'
import Qs from 'qs'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const drawer = ref(false)

const messages = reactive([])

const rateDialog = ref(false)
const data = ref()

const rateForm = reactive({
  rateScore: '',
  rateText: ''
})

const detailForm = reactive({
  name: '',
  IDNumber: '',
  phone: '',
  institutionName: '',
  address: '',
  IPhone: '',
  vaccineName: '',
  description: '',
  date: ''
})

const rateClick = (row) => {
  data.value = row
  rateDialog.value = true
}

const checkClick = (row) => {
  data.value = row
  axios.post('http://localhost:8081/graduation-project/Utils/GetComplete.php', Qs.stringify({
    completeId: data.value.completeId
  })).then(function (response) {
    detailForm.name = response.data[0][5]
    detailForm.IDNumber = response.data[0][3]
    detailForm.phone = response.data[0][2]
    detailForm.institutionName = response.data[0][12]
    detailForm.address = response.data[0][13]
    detailForm.IPhone = response.data[0][14]
    detailForm.vaccineName = response.data[0][10]
    detailForm.description = response.data[0][10]
    detailForm.date = response.data[0][6]
  })
  drawer.value = true
}

const rateSubmit = () => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/CompleteControl/CompleteRate.php', Qs.stringify({
    rateScore: rateForm.rateScore,
    rateText: rateForm.rateText,
    completeId: data.value.completeId,
    userId: sessionStorage.getItem('currentUserId'),
    vaccineId: data.value.vaccineId,
    institutionId: data.value.institutionId
  })).then(function (response) {
    rateDialog.value = false
    ElMessage({
      type: 'success',
      message: '感谢您的评价'
    })
    axios.post('http://localhost:8081/graduation-project/UserMenu/GetComplete.php', Qs.stringify({
      userId: sessionStorage.getItem('currentUserId')
    })).then(function (response) {
      messages.length = 0
      const count = response.data[0]
      for (let i = 1; i <= count; i++) {
        const message = {
          name: response.data[i][0],
          institutionName: response.data[i][1],
          date: response.data[i][2],
          description: response.data[i][3],
          assess: response.data[i][4],
          institutionId: response.data[i][5],
          completeId: response.data[i][6],
          vaccineId: response.data[i][7],
          vaccineName: response.data[i][8]
        }
        messages.push(message)
      }
    })
  })
}

axios.post('http://localhost:8081/graduation-project/UserMenu/GetComplete.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const message = {
      name: response.data[i][0],
      institutionName: response.data[i][1],
      date: response.data[i][2],
      description: response.data[i][3],
      assess: response.data[i][4],
      institutionId: response.data[i][5],
      completeId: response.data[i][6],
      vaccineId: response.data[i][7],
      vaccineName: response.data[i][8]
    }
    messages.push(message)
  }
})
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
</style>
