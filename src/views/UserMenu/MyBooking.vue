<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">我的预约</el-breadcrumb-item>
    <el-button type="text" @click="addMessage">添加备忘录</el-button>
    <el-button type="text" @click="deleteView">删除备忘录</el-button>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <el-calendar v-model="value" style="margin-top:0px">
      <template #dateCell="{data}" >
        {{select(data.day)}}
        <div :style="color">
          <p :style="left">{{ data.day.split('-').slice(1).join('-') }}</p>
          <p style="font-size:10px;margin-top:15px;color:blue">{{ vaccineName }}</p>
        </div>
      </template>
  </el-calendar>
  <el-dialog v-model="addDialog">
    <el-form v-model="message">
      <el-form-item label="日期" :label-width="formLabelWidth">
        <el-date-picker v-model="message.date" type="date" value-format="YYYY-MM-DD"/>
      </el-form-item>
      <el-form-item label="消息">
        <el-input v-model="message.message"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="addSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="deleteDialog">
    <el-form v-model="deleteMessage">
    <el-form-item label="日期" :label-width="formLabelWidth">
        <el-date-picker v-model="deleteMessage.date" type="date" value-format="YYYY-MM-DD"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="deleteSubmit">提交</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'
import Qs from 'qs'
import { ElMessage } from 'element-plus'

/* const dateArray = reactive([]) */
const number = ref(0)
const color = ref('')
const left = ref('')
const messages = reactive([])

const addDialog = ref(false)
const deleteDialog = ref(false)

const deleteMessage = reactive({
  date: ''
})

const deleteView = () => {
  deleteDialog.value = true
}

const deleteSubmit = () => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/CalendarControl/deleteMessage.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    date: deleteMessage.date
  })).then(function (response) {
    deleteDialog.value = false
    deleteMessage.date = ''
    ElMessage({
      type: 'success',
      message: '删除成功！'
    })
  })
}

const message = reactive({
  date: '',
  message: ''
})

const addMessage = () => {
  addDialog.value = true
}

const addSubmit = () => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/CalendarControl/addMessage.php', Qs.stringify({
    date: message.date,
    message: message.message,
    userId: sessionStorage.getItem('currentUserId')
  })).then(function (response) {
    addDialog.value = false
    message.message = ''
    message.date = ''
    ElMessage({
      type: 'success',
      message: '添加成功！'
    })
  })
}

axios.post('http://localhost:8081/graduation-project/UserMenu/CalendarControl/getMessage.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  console.log(response.data)
  const sum = response.data[0]
  number.value = sum
  for (let i = 1; i <= sum; i++) {
    const message = {
      date: response.data[i][0],
      message: response.data[i][1]
    }
    messages.push(message)
  }
})

const value = ref(new Date())
const vaccineName = ref('')

const select = (day) => {
  for (let i = 0; i < number.value; i++) {
    if (messages[i].date === day) {
      vaccineName.value = messages[i].message
      color.value = 'background-color: #fef2f2;border: 3px solid #fb0;border-radius: 20px;color:blue'
      left.value = 'margin-left:0px'
      break
    } else {
      vaccineName.value = ''
      color.value = 'width:100px;height:60px'
      left.value = 'margin-left:40px'
    }
  }
}

</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
</style>
