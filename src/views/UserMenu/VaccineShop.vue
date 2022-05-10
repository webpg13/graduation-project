<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗选购</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <el-table :data="vaccines" style="width: 100%" size="large">
    <el-table-column prop="id" label="疫苗编号" width="100px"/>
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="introduce" label="简介" width="150px"/>
    <el-table-column prop="kind" label="种类"  width="120px"/>
    <el-table-column prop="suitSex" label="适合性别" width="100px"/>
    <el-table-column prop="suitAge" label="适合年龄" />
    <el-table-column prop="specialIntroduce" label="特别说明"/>
    <el-table-column fixed="right" label="Operations" >
      <template #default="scoped">
        <el-button type="text" size="small" @click="checkClick(scoped.row.id,scoped.row.name)"
          >查看详情</el-button
        >
        <el-button type="text" size="small" @click="click(scoped.row.id,scoped.row.name)">选择机构</el-button>
      </template>
    </el-table-column>
    <!-- 暂无数据时显示 -->
    <template v-slot:empty>
      <el-empty :image-size="200" description="暂无数据"></el-empty>
    </template>
  </el-table>
  <el-pagination style="margin-left:300px;margin-top:50px"
  @current-change="handleCurrentChange"
  :current-page="currentPage"
  background=""
  :page-size="pageSize"
  layout="prev, pager, next, jumper"
  :total="count">
  </el-pagination>
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
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const imageUrl = ref('')
const imageUrl1 = ref('')

const drawerTitle = ref('')
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

const drawer = ref(false)

const sexArray = [
  '女', '男', '男女通用'
]

const router = useRouter()

const click = (id, name) => {
  router.push({ path: '/VaccineInstitution', query: { vaccineId: id, vaccineName: name } })
}

const vaccines = reactive([])
const currentPage = ref(1)
const pageSize = ref(10)
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const count = ref(0)

axios.get('http://localhost:8081/graduation-project/UserMenu/VaccineShop.php')
  .then(function (response) {
    console.log(response.data)
    const sum = response.data[0]
    for (let i = 1; i <= sum; i++) {
      const vaccine = {
        id: response.data[i][0],
        name: response.data[i][1],
        introduce: response.data[i][2],
        kind: kindArray[parseInt(response.data[i][7])],
        suitSex: sexArray[response.data[i][4]],
        suitAge: response.data[i][5],
        specialIntroduce: response.data[i][6]
      }
      vaccines.push(vaccine)
    }
  })
const kindArray = [
  '新冠疫苗', 'HPV疫苗', '肺炎疫苗', '乙肝疫苗'
]
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  display: flex;
  flex-direction: column;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 60%;
  height: 60%;
  margin: 0 auto;
}
.el-col{
    display: flex;
    flex-direction: row;
}
.test{
    width: 60px;
    height: 100%;
}
.avatar{
  width: 600px;
}
.avatar1{
  width: 550px;
  height: 800px;
}
</style>
