<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">个人信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗记录</el-breadcrumb-item>
    <el-select v-model="value" placeholder="请选择家庭成员"  @change="selectChange" style="margin-left:300px;margin-top:3px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    </el-select>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class = "vaccineRecord">
  <el-empty description="空" v-show="emptyShow"/>
  <el-descriptions
    class="margin-top"
    :column="3"
    border
    v-for="vaccingMessage in  vaccingMessages.slice((currentPage - 1) * pageSize, currentPage*pageSize)"
    :key="vaccingMessage.id"
  >
    <el-descriptions-item width="200px">
      <template #label>
        <div class="cell-item">
          姓名
        </div>
      </template>
      {{vaccingMessage.name}}
    </el-descriptions-item>
    <el-descriptions-item width="200px">
      <template #label>
        <div class="cell-item">
          身份证号
        </div>
      </template>
      {{vaccingMessage.IDNumber}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          接种疫苗
        </div>
      </template>
      {{vaccingMessage.vaccing}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          接种地点
        </div>
      </template>
      {{vaccingMessage.area}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          接种时间
        </div>
      </template>
      {{vaccingMessage.date}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          关系
        </div>
      </template>
      {{relationArray[vaccingMessage.relation]}}
    </el-descriptions-item>
  </el-descriptions>
<el-pagination class="el-pagination_cls"
  @current-change="handleCurrentChange"
  :current-page="currentPage"
  :page-size="pageSize"
  layout="prev, pager, next, jumper"
  :total="count">
  </el-pagination>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import axios from 'axios'
import Qs from 'qs'

const currentPage = ref(1)
const pageSize = ref(4)
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const count = ref(0)

const relationArray = [
  '子女', '父母', '其他', '本人'
]

const value = ref('')
const emptyShow = ref(false)
const vaccingMessages = reactive([])

axios.post('http://localhost:8081/graduation-project/UserMenu/VaccingRecord.php', Qs.stringify({
  currentUserId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  console.log(response.data)
  const sum = response.data[0]
  if (response.data !== 0) {
    for (let i = 1; i <= sum; i++) {
      const vaccingMessage = {
        id: response.data[i][0],
        name: response.data[i][1],
        IDNumber: response.data[i][2],
        vaccing: response.data[i][3],
        area: response.data[i][4],
        date: response.data[i][5],
        description: response.data[i][6],
        relation: response.data[i][7]
      }
      vaccingMessages.push(vaccingMessage)
      count.value = vaccingMessages.length
    }
  } else {
    emptyShow.value = true
  }
})

const selectChange = (val) => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/VaccineRecordChange.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    relation: val
  })).then(function (response) {
    const sum = response.data[0]
    if (response.data !== 0) {
      emptyShow.value = false
      vaccingMessages.length = 0
      for (let i = 1; i <= sum; i++) {
        const vaccingMessage = {
          id: response.data[i][0],
          name: response.data[i][1],
          IDNumber: response.data[i][2],
          vaccing: response.data[i][3],
          area: response.data[i][4],
          date: response.data[i][5],
          description: response.data[i][6],
          relation: response.data[i][7]
        }
        vaccingMessages.push(vaccingMessage)
        count.value = vaccingMessages.length
      }
    } else {
      vaccingMessages.length = 0
      emptyShow.value = true
      count.value = 0
    }
  })
}

const options = [
  {
    value: '0',
    label: '子女'
  },
  {
    value: '1',
    label: '父母'
  },
  {
    value: '2',
    label: '其他'
  },
  {
    value: '3',
    label: '本人'
  },
  {
    value: '4',
    label: '全部'
  }
]

</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
.vaccineRecord{

}
</style>
