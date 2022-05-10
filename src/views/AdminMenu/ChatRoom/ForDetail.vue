<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">个人信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class="wrapper">
    <div class="titleWrapper">
      {{detailData.title}}
    </div>
    <div class="line"></div>
    <div class="contet">
      {{detailData.main}}
    </div>
    <div class="contentDivider el-divider el-divider--horizontal">
      <div data-v-c30d9bac="" class="el-divider__text is-center">……</div>
    </div>
    <div>
      <el-input
      v-model="comment"
      :rows="3"
      type="textarea"
      placeholder="留下你的评论吧..."
     />
      <div class="comment-operate" style="overflow:hidden">
        <el-button type="primary" class="sub-btn fr" @click="subComment">发表评论</el-button>
        <el-button type="text" class="fr" style="margin:10px" @click="clear">清空</el-button>
      </div>
   </div>
   <div class="comment-wrap">
     <div class="bottom-title">
       <div  class="iconfont icon-biaoti"></div>
       <div class="title-msg">全部留言</div>
       <div class="remarkCount">共{{commennList.length}}条</div>
     </div>
     <div class="comment-content">
       <ul class="comment-box">
         <li v-for="item in commennList" :key="item.id">
           <div class="comment-item">
             <div class="item-title">{{item.personal}}
               <div class="fr">{{item.time}}</div>
             </div>
             <div class="item-content">{{item.content}}</div>
           </div>
         </li>
       </ul>
     </div>
   </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import Qs from 'qs'

const comment = ref('')
const detailId = useRoute().query.id

const detailData = reactive({
  title: '',
  main: ''
})

const commennList = reactive([])

axios.post('http://localhost:8081/graduation-project/UserMenu/ChatRoom/GetChatDetail.php', Qs.stringify({
  id: detailId
})).then(function (response) {
  detailData.title = response.data[0][1]
  detailData.main = response.data[0][3]
})

axios.post('http://localhost:8081/graduation-project/UserMenu/ChatRoom/GetComment.php', Qs.stringify({
  id: detailId
})).then(function (response) {
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const comment = {
      personal: response.data[i][2],
      time: response.data[i][4],
      content: response.data[i][3]
    }
    commennList.push(comment)
  }
})

// 清空输入框
const clear = () => {
  comment.value = ''
}
// 提交输入
const subComment = () => {
  ElMessageBox.confirm(
    '您确定要发表评论吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      axios.post('http://localhost:8081/graduation-project/AdminMenu/ChatRoom/AddComment.php', Qs.stringify({
        institutionId: sessionStorage.getItem('institutionId'),
        comment: comment.value,
        id: detailId,
        date: new Date()
      })).then(function (response) {
        commennList.length = 0
        axios.post('http://localhost:8081/graduation-project/UserMenu/ChatRoom/GetComment.php', Qs.stringify({
          id: detailId
        })).then(function (response) {
          const count = response.data[0]
          for (let i = 1; i <= count; i++) {
            const comment = {
              personal: response.data[i][2],
              time: response.data[i][4],
              content: response.data[i][3]
            }
            commennList.push(comment)
          }
        })
        clear()
        ElMessage({
          type: 'success',
          message: '发表评论成功！'
        })
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
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}
.fr{
    float:right;
}
.wrapper{
  text-align: left;
}
.titleWrapper{
  font-size: 28px;
  word-wrap: break-word;
  font-weight: 500;
}
.line{
  height: 2px;
  margin: 20px 0;
  background: #409eff;
}
.sub-btn{
  margin-top: 10px;
}

.bottom-title {
  display: flex;
  height: 30px;
  line-height: 30px;
  color: #303133;
}
.bottom-title .iconfont {
  color: #409eff;
  font-size: 26px;
  margin-right: 6px;
}
.icon-biaoti:before {
  content: "\e628";
}
.title-msg{
  flex: 1;
  font-weight: 700;
}
.remarkCount {
  color: #e6a23c;
  margin-left: 20px;
}
.comment-box{
  list-style: none;
}
.comment-item{
  border-bottom: 1px solid #dcdfe6;
  margin-top: 20px;
}

.item-content{
  margin: 10px 0;
}
</style>
