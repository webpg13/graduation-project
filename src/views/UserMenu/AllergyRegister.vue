<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">个人信息</el-breadcrumb-item>
    <el-breadcrumb-item class="el-breadcrumb-item">过敏登记</el-breadcrumb-item>
    <el-select v-model="value" placeholder="请选择家庭成员"  @change="selectChange" style="margin-left:300px;margin-top:3px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-button type="success" round style="margin-left:30px" @click="addRecord">添加记录</el-button>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class = "vaccineRecord">
  <el-empty description="空" v-show="emptyShow"/>
  <el-descriptions
    class="margin-top"
    :column="3"
    border
    v-for="allergy in allergys"
    :key="allergy.id"
    style="margin-top:20px"
  >
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          姓名
        </div>
      </template>
      {{allergy.name}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          致敏源
        </div>
      </template>
      {{allergy.object}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          日期
        </div>
      </template>
      {{allergy.date}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          过敏种类
        </div>
      </template>
      {{allergy.allergyKind}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          过敏原分类
        </div>
      </template>
      {{allergy.allergySource}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          症状
        </div>
      </template>
      {{allergy.symptom}}
    </el-descriptions-item>
  </el-descriptions>

  <el-pagination style="margin-left:400px;margin-top:50px"
  @current-change="handleCurrentChange"
  :current-page="currentPage"
  :page-size="pageSize"
  layout="prev, pager, next, jumper"
  :total="count">
  </el-pagination>
  </div>
  <el-dialog v-model="formVisible" title="过敏登记">
    <el-form style="margin-left:240px">
      <el-form-item label="姓名" style="margin-left:12px">
        <el-select v-model="form.name">
          <el-option
             v-for="item in selectNames"
             :key="item.value"
             :label="item.label"
             :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="过敏物">
        <el-input v-model="form.allergy" style="width:200px"/>
      </el-form-item>
      <el-form-item label="过敏种类" style="margin-left:-13px">
        <el-select v-model="form.kind">
          <el-option
             v-for="item in kindSelect"
             :key="item.value"
             :label="item.label"
             :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="过敏源">
        <el-select v-model="form.soucre">
          <el-option
             v-for="item in sourceSelect"
             :key="item.value"
             :label="item.label"
             :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择日期：" style="margin-left:-42px">
      <el-date-picker
        v-model="form.date"
        type="date"
        value-format="YYYY-MM-DD"
      />
      </el-form-item>
      <el-form-item label="症状" style="margin-left:15px">
        <el-input v-model="form.symptom" style="width:200px"/>
      </el-form-item>
    </el-form>
    <el-button @click="submit">提交</el-button>
  </el-dialog>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Qs from 'qs'
import { ElMessage, ElMessageBox } from 'element-plus'

const form = reactive({
  name: '',
  allergy: '',
  kind: '',
  source: '',
  symptom: '',
  date: ''
})

const submit = () => {
  if (form.name === '' || form.allergy === '' || form.kind === '' || form.source === '' || form.symptom === '' || form.date === '') {
    ElMessage({
      type: 'error',
      message: '输入为空，添加失败'
    })
  } else {
    ElMessageBox.confirm(
      'proxy will permanently delete the file. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(() => {
        axios.post('http://localhost:8081/graduation-project/UserMenu/Allergy/AddAllergy.php', Qs.stringify({
          userId: sessionStorage.getItem('currentUserId'),
          name: form.name,
          allergy: form.allergy,
          kind: form.kind,
          source: form.source,
          symptom: form.symptom,
          date: form.date
        })).then(function (response) {
          console.log(response.data)
          if (response.data === 1) {
            ElMessage({
              type: 'success',
              message: '添加成功!'
            })
            formVisible.value = false
            form.name = ''
            form.allergy = ''
            form.kind = ''
            form.source = ''
            form.symptom = ''
            form.date = ''
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消添加'
        })
      })
  }
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
      value: response.data[i][2]
    }
    selectNames.push(seleceName)
  }
  console.log(selectNames)
})

const formVisible = ref(false)

const addRecord = () => {
  formVisible.value = true
}

const currentPage = ref(1)
const pageSize = ref()
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const count = ref(0)

const emptyShow = ref(false)
const allergys = reactive([])
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

const kindSelect = [
  {
    value: '0',
    label: '食物过敏'
  },
  {
    value: '1',
    label: '绿色过敏'
  },
  {
    value: '2',
    label: '宠物过敏'
  },
  {
    value: '4',
    label: '螨虫过敏'
  }
]

const sourceSelect = [
  {
    value: '0',
    label: '饮食性过敏源'
  },
  {
    value: '1',
    label: '接触性过敏源'
  },
  {
    value: '2',
    label: '空气散播的过敏源'
  }
]

const allergyKind = [
  '食物过敏', '绿色过敏', '宠物过敏', '螨虫过敏'
]
const allergySource = [
  '饮食性过敏原', '接触性过敏原', '空气散播的过敏原'
]

axios.post('http://localhost:8081/graduation-project/UserMenu/AllergyRegister.php', Qs.stringify({
  currentUserId: sessionStorage.getItem('currentUserId')
})).then(function (response) {
  const sum = response.data[0]
  if (response.data !== 0) {
    for (let i = 1; i <= sum; i++) {
      const allergy = {
        object: response.data[i][1],
        date: response.data[i][2],
        allergyKind: allergyKind[response.data[i][3]],
        allergySource: allergySource[response.data[i][4]],
        symptom: response.data[i][5],
        name: response.data[i][6]
      }
      allergys.push(allergy)
    }
    count.value = allergys.length
  } else {
    emptyShow.value = true
  }
})

const selectChange = (val) => {
  axios.post('http://localhost:8081/graduation-project/UserMenu/AllergyChange.php', Qs.stringify({
    userId: sessionStorage.getItem('currentUserId'),
    relation: val
  })).then(function (response) {
    const sum = response.data[0]
    if (response.data !== 0) {
      allergys.length = 0
      for (let i = 1; i <= sum; i++) {
        const allergy = {
          object: response.data[i][1],
          date: response.data[i][2],
          allergyKind: allergyKind[response.data[i][3]],
          allergySource: allergySource[response.data[i][4]],
          symptom: response.data[i][5],
          name: response.data[i][6]
        }
        allergys.push(allergy)
      }
      emptyShow.value = false
      count.value = allergys.length
    } else {
      allergys.length = 0
      emptyShow.value = true
      count.value = 0
    }
  })
}
</script>

<style scoped>
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.p{
    text-align: left;
    margin-left: 30px;
    margin-top: 0px;
    font-size: 15px;
}
.vaccineRecord{
  background-image: url(@/assets/user/VaccineRecord.jfif);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center, 0;
  height: 620px;
}

</style>
