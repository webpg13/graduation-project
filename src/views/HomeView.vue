<template>
  <el-container class="outerContainer">
    <el-header height="320px">
      <el-row class="module-row">
        <el-col :span="6">
          <div class="loginModule" onclick="window.location.href='./#/UserLogin';">
            <i class="iconfont icon-dengluyemianyonghuming"/>
            <div class="loginModuleText">
              <p>用户登录</p>
              <p>UserLogin</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="loginModule" onclick="window.location.href='./#/UserRegister';">
            <i class="iconfont icon-zhuce"/>
            <div class="loginModuleText">
              <p>用户激活</p>
              <p>UserRegister</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="loginModule" onclick="window.location.href='./#/AdminLogin';">
            <i class="iconfont icon-guanliyuan"/>
            <div class="loginModuleText">
              <p>管理员登录</p>
              <p>AdminLogin</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="border-right: 0px">
          <div class="loginModule">
            <i class="iconfont icon-sousuo" style="font-size:3.2em"/>
            <div class="loginModuleText">
              <p>信息查询</p>
              <p>Search</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-carousel class="el-carousel_cls" :interval="4000" type="card" height="200px">
        <el-carousel-item>
          <el-image style="width: 750px; height: 200px" :src="require('@/assets/home/c1.png')" :fit="cover" />
        </el-carousel-item>
        <el-carousel-item>
          <el-image style="width: 750px; height: 200px" :src="require('@/assets/home/c2.jpg')" :fit="cover" />
        </el-carousel-item>
        <el-carousel-item>
          <el-image style="width: 750px; height: 200px" :src="require('@/assets/home/c3.jpg')" :fit="cover" />
        </el-carousel-item>
        <el-carousel-item>
          <el-image style="width: 750px; height: 200px" :src="require('@/assets/home/c4.png')" :fit="cover" />
        </el-carousel-item>
      </el-carousel>
    </el-header>
    <el-container class="interContainer">
      <el-aside width="75%" >
        <el-container>
          <el-header height="60px">
            <p class="messageText">最新资讯</p>
          </el-header>
          <el-main>
            <el-tabs type="border-card">
              <el-tab-pane label="全球疫情动态">
                <el-table :data="firstData" style="width: 100%" @row-click="tabClick">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message" label="要闻"/>
                  <el-table-column prop="date" label="Date" width="180"/>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="再现新毒株">
                <el-table :data="secondData" style="width: 100%" @row-click="tabClick">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message" label="要闻"/>
                  <el-table-column prop="date" label="Date" width="180"/>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="新冠改变了世界">
                <el-table :data="thirdData" style="width: 100%" @row-click="tabClick">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message" label="要闻"/>
                  <el-table-column prop="date" label="Date" width="180"/>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="病毒更温和了？">
                <el-table :data="lastData" style="width: 100%" @row-click="tabClick">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message" label="要闻"/>
                  <el-table-column prop="date" label="Date" width="180"/>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-aside>
      <el-main>
        <p class="rankingText">实时疫情统计</p>
        <el-table :data ="illData.arr" style="width:100%;margin-top:17px">
          <el-table-column prop="area" label="地区" />
          <el-table-column prop="addNumber" label="新增" />
          <el-table-column prop="sumNumber" label="累计" />
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import axios from 'axios'
import { reactive } from 'vue'

const illData = reactive({
  arr: []
})

axios.get('http://localhost:8081/graduation-project/HomeIndex/illRankings.php')
  .then(function (response) {
    /** @var int[][] */
    const illRankings = response.data
    const sum = illRankings[0]
    for (let i = 1; i <= sum; i++) {
      illData.arr.push({
        area: illRankings[i][0],
        addNumber: illRankings[i][1],
        sumNumber: illRankings[i][2]
      })
    }
  })
const firstData = [
  {
    id: 0,
    message: '意大利新增新冠肺炎确诊病例40757例 累计确诊超1650万例',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-05-02/detail-imcwipii7581420.d.html'
  },
  {
    id: 1,
    message: '福奇：新冠大流行尚未结束 美国不太可能消除疫情',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-30/detail-imcwiwst4814494.d.html'
  },
  {
    id: 2,
    message: '疫情何以致近两亿美国人感染？诺奖得主斯蒂格利茨：政府未发挥应有作用',
    date: '2022-05-02',
    address: 'https://news.sina.cn/2022-04-28/detail-imcwipii7008363.d.html'
  },
  {
    id: 3,
    message: '英法院裁定：英政府未经新冠检测把出院患者送回养老院的做法违法',
    date: '2022-05-02',
    address: 'https://k.sina.cn/article_5044281310_12ca99fde02001t4tk.html?from=news&subch=onews'
  }
]

const secondData = [
  {
    id: 0,
    message: '奥密克戎又进化两个新变体，美专家称“群体免疫”或不再适用',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-17/detail-imcwipii4751475.d.html'
  },
  {
    id: 1,
    message: 'XE、XF、XL……什么是新冠重组毒株？如何应对？一图读懂',
    date: '2022-05-02',
    address: 'https://news.sina.cn/2022-04-20/detail-imcwiwst2896397.d.html'
  },
  {
    id: 2,
    message: '韩国首次发现XE、XM毒株感染病例 此前发现XL病例',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-19/detail-imcwiwst2699535.d.html'
  },
  {
    id: 3,
    message: '日韩首现奥密克戎重组毒株之际，世卫密切追踪两个新亚种',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-12/detail-imcwipii3859132.d.html'
  }
]

const thirdData = [
  {
    id: 0,
    message: '疫情中，这些弱势群体处境更难了',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-27/detail-imcwipii6672792.d.html'
  },
  {
    id: 1,
    message: '美国新冠死亡人数逼近百万，最危险的还在后面',
    date: '2022-05-02',
    address: 'https://news.sina.cn/2022-04-24/detail-imcwipii6150921.d.html'
  },
  {
    id: 2,
    message: '美媒：疫情期间美国贫富分化加剧 亿万富翁财富飙升62%',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-21/detail-imcwiwst3099311.d.htmll'
  },
  {
    id: 3,
    message: '感染率、死亡人数增加 南非疫情防控形势不容乐观',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-21/detail-imcwipii5516054.d.html'
  }
]

const lastData = [
  {
    id: 0,
    message: '新加坡卫生部长：新冠比流感危害大得多',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-04-22/detail-imcwiwst3292550.d.html'
  },
  {
    id: 1,
    message: '英国科学家最新研究：感染普通冠状病毒不会产生有效新冠抗体',
    date: '2022-05-02',
    address: 'https://news.sina.cn/2022-04-01/detail-imcwipii1734177.d.html'
  },
  {
    id: 2,
    message: '牛津大学报告：即便是轻症病例，新冠也可致大脑萎缩、记忆丧失',
    date: '2022-05-02',
    address: 'https://news.sina.cn/gj/2022-03-08/detail-imcwiwss4891068.d.html'
  },
  {
    id: 3,
    message: '奥地利计划暂停强制接种疫苗法：奥密克戎的危险低于先前毒株',
    date: '2022-05-02',
    address: 'https://k.sina.cn/article_5044281310_12ca99fde02001rxgj.html?from=news&subch=onews'
  }
]
const tabClick = (row) => {
  window.location.href = row.address
}
</script>

<style scoped lang="scss">
.module-row {
  position: relative;
  min-height: 120px;
  margin: 20px 0 0;
  z-index: 2;
  .el-col{
    background-color: #409eff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    border-right: 2px solid var(--el-color-white);
    padding: 10px 0;
    transition: background 0.6s;
    // height: 120px;
    .loginModule{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      // width:136px;
      cursor:pointer;
      .iconfont{
        font-size:2.8em;
        background-color: var(--el-color-white);
        border-radius: 50%;
        padding: 10px;
      }
      .loginModuleText {
        margin: 10px 0 0;
        p{
          color: var(--el-color-white);
          margin: 0;
        }
      }
    }
    &:hover{
      background-color: #0d63fa;
    }
  }
}

.el-carousel{
  position: relative;
  margin: 30px auto;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.outerContainer{
  height: 100%;
  // background-image: linear-gradient(45deg, #d3eef9, #d3eef9);
  /* background: url("@/assets/home/bg.jpg");
  background-size: cover; */
}

.interContainer{
  margin: 100px 0 0;
  background: #d3eef9;
  /* background: url("@/assets/home/bg2.jpg");
  background-size: cover; */
  &::before{
    content: "";
    background: url("@/assets/home/dots-arrow-right-side-large.png");
    background-repeat: no-repeat;
    right: 0;
    top: 2.5%;
    z-index: 0;
    height: 793px;
    width: 400px;
    position: absolute;
  }
}

.messageText{
  position: relative;
  left:-460px;
  margin-top: 10px;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 30px;
  font-style:italic;
  font-weight:bold;
}

.rankingText{
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 30px;
  font-style:italic;
  font-weight:bold;
  margin: 0px;
}
</style>
