<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">疫苗信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">关注疫苗</el-breadcrumb-item>
    <el-badge :hidden="show" is-dot style="margin-top:5px;margin-left:200px">
      <el-button class="share-button" :icon="Message" type="primary" @click="clickMessage"/>
     </el-badge>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <el-container>
      <el-main>
        <el-table :data="vaccines" style="width: 100%">
          <el-table-column fixed prop="vaccineName" label="疫苗名称" width="180px"/>
          <el-table-column prop="vaccineId" label="疫苗编号"  width="100px"/>
          <el-table-column prop="simpleIntroduce" label="简介" width="200px"/>
          <el-table-column prop="institutionName" label="机构名称" width="180px"/>
          <el-table-column prop="address" label="地址" width="220px"/>
          <el-table-column prop="phone" label="联系电话" width="140px"/>
          <el-table-column prop="oldPrice" label="价格" />
          <el-table-column prop="newPrice" label="最新价格" />
          <el-table-column prop="institutionId" v-if="false" label="价格" />
          <el-table-column fixed="right" label="Operations" width="180px">
            <template #default="scope">
              <el-button type="text"  @click="handleClick">查看详情</el-button>
              <el-button type="text"  @click="cancelAttention(scope.row)">取消关注</el-button>
            </template>
          </el-table-column>
          <!-- 暂无数据时显示 -->
          <template v-slot:empty>
            <el-empty :image-size="200" description="暂无数据"></el-empty>
          </template>
        </el-table>
      </el-main>
  </el-container>
  <el-drawer
    v-model="drawer"
    title="通知"
    direction="rtl"
    :before-close="handleClose"
  >
    <span>Hi!</span>
    <div v-for="message in messages" :key="message.id">
      <p>您关注的{{message.institutionName}}的{{message.vaccineName}}价格改变啦！</p>
    </div>
  </el-drawer>
</template>

<script setup>
import axios from 'axios'
import Qs from 'qs'
import { reactive, ref } from 'vue'
import { ArrowRight, Message } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
/* import { useRouter } from 'vue-router' */

const drawer = ref(false)

const show = ref(false)
const vaccines = reactive([])
const messages = reactive([])
/* const router = useRouter() */

axios.post('http://localhost:8081/graduation-project/Utils/GetMessage.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  if (response.data === 0) {
    show.value = true
  } else {
    show.value = false
    const count = response.data[0]
    for (let i = 1; i <= count; i++) {
      const message = {
        institutionName: response.data[i][0],
        vaccineName: response.data[i][1]
      }
      messages.push(message)
    }
  }
})

axios.post('http://localhost:8081/graduation-project/UserMenu/AttentionList/AttentionInit.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  const sum = response.data[0]
  for (let i = 1; i <= sum; i++) {
    const vaccine = {
      vaccineId: response.data[i][0],
      vaccineName: response.data[i][1],
      simpleIntroduce: response.data[i][2],
      institutionName: response.data[i][3],
      address: response.data[i][4],
      phone: response.data[i][5],
      oldPrice: response.data[i][6],
      newPrice: response.data[i][7],
      institutionId: response.data[i][8]
    }
    vaccines.push(vaccine)
  }
})

const clickMessage = () => {
  drawer.value = true
  axios.post('http://localhost:8081/graduation-project/UserMenu/AttentionList/DeleteMessage.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId')
  })).then(function (response) {
    show.value = true
  })
}
/*
const handleChange = () => {
  axios.post('', Qs.stringify({
    area: area.value
  })).then(function (response) {
    attentionList.length = 0
    const sum = response.data[0]
    for (let i = 1; i <= sum; i++) {
      const attention = {
        vaccineName: response.data[i][0],
        introduce: response.data[i][5],
        suitSex: response.data[i][6],
        suitAge: response.data[i][7],
        date: response.data[i][8]
      }
      attentionList.push(attention)
    }
    for (let i = 1; i <= sum; i++) {
      const attentionMessage = {
        institutionName: response.data[i][12],
        institutionPhone: response.data[i][15],
        institutionAddress: response.data[i][13],
        price: response.data[i][4],
        date: response.data[i][14]
      }
      attentionMessages.push(attentionMessage)
    }
  })
} */

const cancelAttention = (row) => {
  ElMessageBox.confirm(
    '您确定要取消关注吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/UserMenu/AttentionList/CancelAttention.php', Qs.stringify({
        userId: sessionStorage.getItem('currentUserId'),
        vaccineId: row.vaccineId,
        institutionId: row.institutionId
      })).then(function (response) {
        vaccines.length = 0
        if (response.data === 1) {
          axios.post('http://localhost:8081/graduation-project/UserMenu/AttentionList/AttentionInit.php', Qs.stringify({
            userId: sessionStorage.getItem('currentUserId')
          })).then(function (response) {
            ElMessage({
              type: 'success',
              message: '取消关注成功！'
            })
            const sum = response.data[0]
            for (let i = 1; i <= sum; i++) {
              const vaccine = {
                vaccineId: response.data[i][0],
                vaccineName: response.data[i][1],
                simpleIntroduce: response.data[i][2],
                institutionName: response.data[i][3],
                address: response.data[i][4],
                phone: response.data[i][5],
                oldPrice: response.data[i][6],
                newPrice: response.data[i][7],
                institutionId: response.data[i][8]
              }
              vaccines.push(vaccine)
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
</script>

<style scoped>
.image {
  width: 80%;
  height: 80%;
  margin: 0 auto;
}
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.el-header{
  display: flex;
  flex-direction: row;
}
</style>
