<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">用户请求</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">缺苗信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <div class="lack-vaccine-message">
    <div class="search-wrap">
      <el-input v-model="keywords" placeholder="请输入疫苗名称" style="width:300px"></el-input>
    </div>
    <el-table :data="datas.filter(item=>item.includes(keywords))" style="width: 100%" >
      <el-table-column type="expand">
        <template #default="props">
          <div v-for="user in props.row.userMessage" :key="user.phone" style="display:flex;flex-direction:row">
              <p style="margin-left:50px">联系姓名：{{user.name}}</p>
              <p style="position:absolute;left:200px">联系电话：{{user.phone}}</p>
              <p style="position:absolute;left:400px">联系人身份证号：{{user.IDNumber}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="疫苗名称" prop="vaccineName" />
      <el-table-column label="请求人数" prop="number" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button  @click="handle(scope.$index, scope.row)">完成</el-button>
        </template>
      </el-table-column>
      <!-- 暂无数据时显示 -->
      <template v-slot:empty>
        <el-empty :image-size="200" description="暂无数据"></el-empty>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import axios from 'axios'
import Qs from 'qs'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const keywords = ref('')
const handle = (index, row) => {
  ElMessageBox.confirm(
    '您确定要删除这条预约吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    axios.post('http://localhost:8081/graduation-project/AdminMenu/LackVaccine/LackVaccineComplete.php', Qs.stringify({
      institutionId: sessionStorage.getItem('currentAdminId'),
      vaccineName: row.vaccineName
    })).then(function (response) {
      console.log(response.data)
      if (response.data === 1) {
        ElMessage({
          message: '清除完成.',
          type: 'success'
        })
        datas.length = 0
        axios.post('http://localhost:8081/graduation-project/AdminMenu/LackVaccineInit.php', Qs.stringify({
          institutionId: sessionStorage.getItem('currentAdminId')
        })).then(function (response) {
          const count = response.data[0]
          const firstData = {
            vaccineName: response.data[1][0],
            number: 1,
            userMessage: [
              {
                phone: response.data[1][1],
                name: response.data[1][2],
                IDNumber: response.data[1][3]
              }
            ]
          }
          datas.push(firstData)
          for (let i = 2; i <= count; i++) {
            if (response.data[i][0] === response.data[i - 1][0]) {
              const data = {
                phone: response.data[i][1],
                name: response.data[i][2],
                IDNumber: response.data[i][3]
              }
              datas[index.value].userMessage.push(data)
              datas[index.value].number = datas[index.value].number + 1
            } else {
              index.value = index.value++
              const firstData = {
                vaccineName: response.data[i][0],
                number: 1,
                userMessage: [
                  {
                    phone: response.data[i][1],
                    name: response.data[i][2],
                    IDNumber: response.data[i][3]
                  }
                ]
              }
              datas.push(firstData)
            }
          }
        })
      }
    })
  })
}

const index = ref(0)
const datas = reactive([])
axios.post('http://localhost:8081/graduation-project/AdminMenu/LackVaccineInit.php', Qs.stringify({
  institutionId: sessionStorage.getItem('currentAdminId')
})).then(function (response) {
  console.log(response.data)
  const count = response.data[0]
  const firstData = {
    vaccineName: response.data[1][0],
    number: 1,
    userMessage: [
      {
        phone: response.data[1][1],
        name: response.data[1][2],
        IDNumber: response.data[1][3]
      }
    ]
  }
  datas.push(firstData)
  for (let i = 2; i <= count; i++) {
    if (response.data[i][0] === response.data[i - 1][0]) {
      const data = {
        phone: response.data[i][1],
        name: response.data[i][2],
        IDNumber: response.data[i][3]
      }
      datas[index.value].userMessage.push(data)
      datas[index.value].number = datas[index.value].number + 1
    } else {
      index.value = index.value++
      const firstData = {
        vaccineName: response.data[i][0],
        number: 1,
        userMessage: [
          {
            phone: response.data[i][1],
            name: response.data[i][2],
            IDNumber: response.data[i][3]
          }
        ]
      }
      datas.push(firstData)
    }
  }
})

</script>
<style scoped>
.lack-vaccine-message{
}
</style>
