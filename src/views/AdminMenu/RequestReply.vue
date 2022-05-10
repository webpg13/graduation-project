<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">机构请求</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">请求答复</el-breadcrumb-item>
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
    <el-table-column fixed="right" prop="state" label="状态" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button type="text" size="large" @click="check(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
    <!-- 暂无数据时显示 -->
    <template v-slot:empty>
      <el-empty :image-size="200" description="暂无数据"></el-empty>
    </template>
  </el-table>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Qs from 'qs'

const requests = reactive([])
const router = useRouter()
const check = (row) => {
  router.push({ path: '/RequestDetail', query: { row: Object.values(row) } })
}

axios.post('http://localhost:8081/graduation-project/AdminMenu/VaccineRequestControl/RequestReply.php', Qs.stringify({
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
