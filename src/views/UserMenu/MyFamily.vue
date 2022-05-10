<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">个人信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">我的家人</el-breadcrumb-item>
    <el-dropdown style="margin-left:300px">
      <el-button type="primary"  @click="addFamily" style="margin-left:300px;margin-top:3px">
        添加家人<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
<!--           <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item>Action 4</el-dropdown-item>
          <el-dropdown-item>Action 5</el-dropdown-item> -->
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class="familyDiv">
  <el-card v-for="family in familys" :key="family.name" shadow="always" class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{family.name}}</span>
        <el-button class="button" type="text" @click="deleteClick(family.IDNumber)">删除</el-button>
      </div>
    </template>
    <div style="display:flex;flex-direction:column;margin-top:30px">
    <span style="text-align:left;margin-left:60px;margin-top:10px">身份证号：{{family.IDNumber}}</span>
    <span style="text-align:left;margin-left:60px;margin-top:10px">性别：{{family.sex}}</span>
    <span style="text-align:left;margin-left:60px;margin-top:10px">与本人关系：{{family.relation}}</span>
    <span style="text-align:left;margin-left:60px;margin-top:10px">联系电话：{{family.phone}}</span>
    </div>
  </el-card>
  </div>
  <el-dialog v-model="addFamilyVisible" label-width="120px">
      <el-form :model="addFamilyForm">
          <p style="font-size:25px;color:blue;margin-top:10px">基本信息</p>
          <el-form-item label="姓名" style="margin-left:246px">
              <el-input v-model="addFamilyForm.familyName" style="width:250px"/>
          </el-form-item>
          <el-form-item label="性别" style="margin-left:246px">
              <el-radio v-model="addFamilyForm.familySex" label="1">男</el-radio>
              <el-radio v-model="addFamilyForm.familySex" label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="身份证号" style="margin-left:220px">
              <el-input v-model="addFamilyForm.familyIDNumber" style="width:250px"/>
          </el-form-item>
          <el-form-item label="与本人关系" style="margin-left:220px">
              <el-radio v-model="addFamilyForm.relation" label="0">子女</el-radio>
              <el-radio v-model="addFamilyForm.relation" label="1">父母</el-radio>
              <el-radio v-model="addFamilyForm.relation" label="2">其他</el-radio>
          </el-form-item>
          <p style="font-size:25px;color:blue">联系信息</p>
          <el-form-item label="联系手机" style="margin-left:220px">
              <el-input v-model="addFamilyForm.phone" style="width:250px"/>
          </el-form-item>
          <el-button size="large" @click="addFamilySubmit">提交</el-button>
      </el-form>
  </el-dialog>
</template>

<script setup>
import { ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios'
import { reactive, ref } from 'vue-demi'
import Qs from 'qs'
import { ElMessage, ElMessageBox } from 'element-plus'

const familys = reactive([])
const addFamilyVisible = ref(false)
const addFamily = () => {
  addFamilyVisible.value = true
}

const addFamilyForm = reactive({
  familyName: '',
  familySex: '',
  familyIDNumber: '',
  relation: '',
  phone: ''
})

const deleteClick = (val) => {
  ElMessageBox.confirm(
    '您确定要继续删除这条家人吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/UserMenu/FamilyControl/DeleteFamily.php', Qs.stringify({
        userId: sessionStorage.getItem('currentUserId'),
        IDNumber: val
      })).then(function (response) {
        if (response.data === 1) {
          ElMessage({
            type: 'success',
            message: '删除家人成功!'
          })
          familys.length = 0
          axios.post('http://localhost:8081/graduation-project/UserMenu/FamilyControl/FamilyInit.php', Qs.stringify({
            userId: sessionStorage.getItem('currentUserId')
          })).then(function (response) {
            const count = response.data[0]
            for (let i = 1; i <= count; i++) {
              const family = {
                name: response.data[i][0],
                sex: response.data[i][1],
                IDNumber: response.data[i][2],
                relation: response.data[i][3],
                phone: response.data[i][4]
              }
              familys.push(family)
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

const addFamilySubmit = () => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/FamilyControl/AddFamily.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    familyName: addFamilyForm.familyName,
    familySex: addFamilyForm.familySex,
    familyIDNumber: addFamilyForm.familyIDNumber,
    relation: addFamilyForm.relation,
    phone: addFamilyForm.phone
  })).then(function (response) {
    if (response.data === 1) {
      ElMessage({
        type: 'success',
        message: '添加家人成功!'
      })
      familys.length = 0
      axios.post('http://localhost:8081/graduation-project/UserMenu/FamilyControl/FamilyInit.php', Qs.stringify({
        userId: sessionStorage.getItem('currentUserId')
      })).then(function (response) {
        const count = response.data[0]
        for (let i = 1; i <= count; i++) {
          const family = {
            name: response.data[i][0],
            sex: response.data[i][1],
            IDNumber: response.data[i][2],
            relation: response.data[i][3],
            phone: response.data[i][4]
          }
          familys.push(family)
        }
      })
      addFamilyForm.familyName = ''
      addFamilyForm.familySex = ''
      addFamilyForm.familyIDNumber = ''
      addFamilyForm.relation = ''
      addFamilyForm.phone = ''
      addFamilyVisible.value = false
    }
  })
}

axios.post('http://localhost:8081/graduation-project/UserMenu/FamilyControl/FamilyInit.php', Qs.stringify({
  userId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const family = {
      name: response.data[i][0],
      sex: response.data[i][1],
      IDNumber: response.data[i][2],
      relation: response.data[i][3],
      phone: response.data[i][4]
    }
    familys.push(family)
  }
})
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  height: 300px;
  margin-top: 50px;
  margin-left: 60px;
  display: inline-block;
}
.familyDiv{
  background-image: url(@/assets/user/MyFamily.jfif);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center, 0;
  height: 620px;
}
</style>
