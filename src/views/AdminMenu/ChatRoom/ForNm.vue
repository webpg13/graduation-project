<template>
<el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb_cls">
    <el-breadcrumb-item class="el-breadcrumb-item">论坛</el-breadcrumb-item>
    <el-button style="margin-left:600px;" size="small" @click="click">发表</el-button>
  </el-breadcrumb>
  <el-divider style="margin-bottom:0px;margin-top:0px"/>
  <div class="wrapper">
    <ul class="main-wrap">
      <li v-for="item in texts" :key="item.id" class="main-item">
        <div class="li-top">
          <a :href="`#/AdminforDetail?id=${item.id}`" class="title">
            <h3>{{item.title}}</h3>
          </a>
          <div class="source">{{item.type}}</div>
        </div>
        <div class="li-middle">
          {{item.main}}
        </div>
        <div class="li-bottom">
          <div class="liBottomLeft">
            <img class="user-icon" src="data:image/png;base64,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"/>
            <span>{{item.person}}</span>
            <label>发布时间：</label>
            <span>{{item.time}}</span>
          </div>
          <div class="liBottomRight">
            <span class="read">{{item.read}}</span>阅读 ·
            <span class="comment">{{item.comment}}</span>评论
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { L2Dwidget } from 'live2d-widget'

const texts = reactive([])
L2Dwidget.init({
  model: {
    jsonPath: 'https://cdn.jsdelivr.net/gh/wangsrGit119/wangsr-image-bucket/L2Dwidget/live2d-widget-model-hijiki/assets/hijiki.model.json'
  }
})

axios.post('http://localhost:8081/graduation-project/UserMenu/ChatRoom/GetChat.php').then(function (response) {
  const count = response.data[0]
  for (let i = 1; i <= count; i++) {
    const text = {
      id: response.data[i][0],
      title: response.data[i][1],
      type: response.data[i][2],
      main: response.data[i][3],
      time: response.data[i][4],
      person: response.data[i][5],
      read: response.data[i][6],
      comment: response.data[i][7]

    }
    texts.push(text)
  }
})

const router = useRouter()

const click = () => {
  router.push('/AdminChatPublication')
}

</script>
<style>
div{
  box-sizing: border-box;
}
a{
  text-decoration:none;
}
.main-wrap{
  list-style: none;
  text-align: left;
}
.main-item{
  border-bottom: 1px solid #dcdfe6;
  padding: 18px 24px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 4%);
  position: relative;
  top: 0;
  left: 0;
}
.title{
  max-width: 92%;
  height: 24px;
  line-height: 24px;
  color: #303133;
  cursor: pointer;
}
.title h3{
  margin: 0;
  padding: 0;
}
.li-top{
  display: flex;
}
.source{
  height: 20px;
  padding: 0 5px;
  border: 1px solid #409eff;
  border-radius: 4px;
  color: #409eff;
  font-size: 12px;
  margin-top: 3px;
  margin-left: 10px;
}
.li-middle{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 24px;
  line-height: 24px;
  margin-bottom: 4px;
  color: #606266;
  font-size: 14px;
}
.li-bottom{
  display: flex;
  position: relative;
  left: 0;
  top: 0;
  height: 24px;
  line-height: 24px;
}
.user-icon{
  height: 20px;
  width: 20px;
  margin-right: 10px;
}
.liBottomLeft{
  display: flex;
}
.liBottomLeft span,
.liBottomLeft  label{
  height: 24px;
  display: block;
  line-height: 24px;
  margin-right: 6px;
  font-size: 14px;
  color: #303133;
}
.liBottomRight{
  position: absolute;
  right: 20px;
  line-height: 24px;
  font-size: 14px;
  color: #909399;
}
.read,.comment{
  color: #409eff;
  margin-right: 5px;
}
.el-breadcrumb-item{
    font-size: 30px;
    margin:6px;
    padding:0
}

</style>
