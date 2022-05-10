<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
  <el-breadcrumb-item class="el-breadcrumb-item">疫苗信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/VaccineShop' }">疫苗选购</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item" :to="{ path: '/VaccineInstitution',query: { vaccineId: vaccineId, vaccineName: vaccineName } }">接种机构</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">{{vaccineName}}</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class="introduce">
    <img :src="src[vaccineId-1]" style="position:relative;margin-top:100px"/>
    <div style="margin-top:100px">
      <p class="introduceP">名称：{{vaccineName}}</p>
      <p class="introduceP">价格：{{vaccineData.price}}</p>
      <p class="introduceP">疫苗余量：{{vaccineData.number}}</p>
      <p class="introduceP">简介：{{vaccineData.concreteIntroduce}}</p>
      <p class="introduceP">适用性别：{{vaccineData.suitSex}}</p>
      <p class="introduceP">上线日期：{{vaccineData.date}}</p>
      <div style="display:flex;flex-direction:row;margin-left:20px;text-align:left;margin-top:5px">
      <p style="margin-left:10xpx;margin-top:0px">评分：</p><el-rate v-model="star" disabled style="margin-top:-5px"/>
      </div>
    </div>
    <div style="height:600px;width:500px;display:flex;flex-direction:column;margin-left:80px">
      <div style="width:100%;height:200px">
        <Message-scroll :vaccineId='vaccineId' :institutionId='institutionId'/>
      </div>
      <div>
        <p style="font-size:30px;color:gold">注意事项</p>
        <el-input v-model="textArea" type="textarea" style ="margin-top:20px;white-space:pre-line;font-size:18px" :rows="11" disabled></el-input>
      </div>
    </div>
  </div>
  <div class="buttonGroup">
    <el-button type="primary" size="large"  @click="vaccineAttention" round style="font-size:20px">{{attention}}</el-button>
    <el-button type="primary" size="large"  round @click="dialogFormVisible = true" style="font-size:20px;margin-left:50px">预约</el-button>
  <el-dialog v-model="dialogFormVisible" title="预约">
    <el-form :model="dateForm" label-width="150px" style="margin-left:125px" label-position='right'>
      <el-form-item label="请选择预约日期：">
      <el-date-picker
        v-model="dateForm.date"
        type="date"
        value-format="YYYY-MM-DD"
      />
      </el-form-item>
      <el-form-item label="姓名" style="margin-left:0px">
        <el-select v-model="dateForm.name" @change="nameChange">
          <el-option
             v-for="item in selectNames"
             :key="item.value"
             :label="item.label"
             :value="{ value: item.value, label: item.label }"/>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号：">
        <el-input v-model="dateForm.IDNumber" placeholder="Please input" clearable disabled/>
      </el-form-item>
      <el-form-item label="请输入联系电话：">
        <el-input v-model="dateForm.phone" placeholder="Please input" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitDate"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import MessageScroll from '@/components/MessageScroll.vue'

const route = useRoute()

const vaccineId = route.query.vaccineId
const vaccineName = route.query.vaccineName
const institutionId = route.query.institutionId

const messages = reactive([])

axios.post('http://localhost:8081/graduation-project/Utils/GetRateText.php', Qs.stringify({
  vaccineId: vaccineId,
  institutionId: institutionId
})).then(function (response) {
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const message = {
      message: response.data[i][0],
      name: response.data[i][1]
    }
    messages.push(message)
  }
})

const imageUrl = ref('')

const star = ref(0)

const dialogFormVisible = ref(false)

const dateForm = reactive({
  date: '',
  phone: '',
  name: '',
  IDNumber: ''
})

const submitDate = () => {
  axios.post('http://localhost:8081/graduation-project/Vaccine/VaccineBooking.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    vaccineId: vaccineId,
    institutionId: institutionId,
    IDNumber: dateForm.IDNumber,
    date: dateForm.date,
    phone: dateForm.phone,
    name: dateForm.name.label
  })).then(function (response) {
    if (response.data === 0) {
      ElMessage({
        type: 'error',
        message: '暂时无法预约此疫苗！'
      })
      dialogFormVisible.value = false
    } else {
      axios.post('http://localhost:8081/graduation-project/Utils/UserGetVaccineMessage.php', Qs.stringify({
        vaccineId: vaccineId,
        institutionId: institutionId
      })).then(function (response) {
        console.log(response.data)
        vaccineData.number = response.data[0]
        vaccineData.date = response.data[2]
        vaccineData.price = response.data[1]
      })
      dialogFormVisible.value = false
      ElMessage({
        type: 'success',
        message: '预约成功！' + '您排在当天第' + response.data + '位'
      })
    }
  })
}

axios.post('http://localhost:8081/graduation-project/UserMenu/avatar/VaccineImg.php', Qs.stringify({
  vaccineId: vaccineId
})).then(function (response) {
  imageUrl.value = response.data[0][2]
})

const attention = ref('')

const textArea = ref('')
axios.post('http://localhost:8081/graduation-project/Utils/GetTextArea.php', Qs.stringify({
  vaccineId: vaccineId
})).then(function (response) {
  textArea.value = response.data
})

const src = [
  require('@/assets/vaccine/xinguan.jpg'),
  require('@/assets/vaccine/jiujia.jpg'),
  require('@/assets/vaccine/sijia.jpg'),
  require('@/assets/vaccine/erjia.jpg'),
  require('@/assets/vaccine/yigan.jpg'),
  require('@/assets/vaccine/23jia.jpg')
]

const vaccineData = reactive({
  vaccineName: vaccineName,
  price: '',
  number: '',
  concreteIntroduce: '',
  suitSex: '',
  suit_min_age: 0,
  suit_max_age: '',
  date: ''
})

axios.post('http://localhost:8081/graduation-project/Utils/UserGetVaccineMessage.php', Qs.stringify({
  vaccineId: vaccineId,
  institutionId: institutionId
})).then(function (response) {
  if (response.data[0] === null) {
    vaccineData.number = '暂未上线'
    vaccineData.date = '暂未上线'
    vaccineData.price = '暂未上线'
  } else {
    vaccineData.number = response.data[0]
    vaccineData.date = response.data[2]
    vaccineData.price = response.data[1]
  }
})

axios.post('http://localhost:8081/graduation-project/Utils/GetRate.php', Qs.stringify({
  vaccineId: vaccineId,
  institutionId: institutionId
})).then(function (response) {
  star.value = response.data
})

axios.post('http://localhost:8081/graduation-project/Vaccine/VaccineItem.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId'),
  vaccineId: vaccineId,
  institutionId: institutionId
})).then(function (response) {
  vaccineData.concreteIntroduce = response.data[0][3]
  switch (response.data[0][4]) {
    case '0' : {
      vaccineData.suitSex = '仅适用于女性'
      break
    }
    case '1' : {
      vaccineData.suitSex = '仅适用于男性'
      break
    }
    case '2' : {
      vaccineData.suitSex = '男女都适用'
      break
    }
  }
  vaccineData.suit_min_age = response.data[0][5]
  if (response.data[0][6] !== '0') {
    vaccineData.suit_max_age = '，' + response.data[0][6] + '周岁以下'
  }
  if (response.data[1] === 0) {
    attention.value = '关注'
  } else {
    attention.value = '取消关注'
  }
})

const vaccineAttention = () => {
  /* const currentDate = new Date() */
  axios.post('http://localhost:8081/graduation-project/Vaccine/VaccineAttention.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    vaccineId: vaccineId,
    institutionId: institutionId,
    attentionIf: attention.value,
    /* date: currentDate, */
    price: vaccineData.price
  })).then(function (response) {
    console.log(response.data)
    if (response.data === 1) {
      ElMessageBox.alert('关注成功，您可在关注疫苗列表中查看！', vaccineName, {
        confirmButtonText: 'OK'
      })
      attention.value = '取消关注'
    } else {
      ElMessageBox.alert('您是否要取消关注', vaccineName, {
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(() => {
        axios.post('http://localhost:8081/graduation-project/Vaccine/VaccineCancelAttention.php', Qs.stringify({
          userId: sessionStorage.getItem('currentUserId'),
          vaccineId: vaccineId,
          institutionId: institutionId
        })).then(function (response) {
          console.log(response.data)
          if (response.data === 1) {
            ElMessage({
              type: 'success',
              message: '取消关注成功！'
            })
            attention.value = '关注'
          } else {
            ElMessage({
              type: 'success',
              message: '取消关注失败，请尝试重连网络！'
            })
          }
        })
      })
    }
  })
}

const selectNames = reactive([])

axios.post('http://localhost:8081/graduation-project/Utils/GetFamily.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  console.log(response.data)
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const seleceName = {
      label: response.data[i][2],
      value: response.data[i][1]
    }
    selectNames.push(seleceName)
  }
})

const nameChange = (val) => {
  const { value, label } = val
  dateForm.IDNumber = value
  console.log(label)
}
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.introduce{
    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: 100px;
}
.buttonGroup{
  display: flex;
  flex-direction: row;
  position: relative;
  left: 50px;
  top: 120px;
  margin-left: 120px;
}
.introduceP{
  text-align: left;
  margin-left: 20px;
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.avatar{
  width: 600px;
  height: 600px;
}
.scroll {
  height: 200px;
  width: 500px;
  margin: 100px auto;
  overflow: hidden;
}

.scroll .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}
</style>
