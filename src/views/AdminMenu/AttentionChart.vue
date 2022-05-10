<template>
  <div class="contetn">
    <div id="main" ref="chart" style="width: 60%; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts' // 引用echarts
import axios from 'axios'
import Qs from 'qs'

export default {
  data () {
    return {
      myChart: '',
      data1: '',
      data2: '',
      data3: '',
      data4: ''
    }
  },
  mounted () {
    axios.post('http://localhost:8081/graduation-project/AdminMenu/chart/AttentionChart.php', Qs.stringify({
      institutionId: sessionStorage.getItem('currentAdminId')
    })).then((res) => {
      this.data1 = res.data[1]
      this.data2 = res.data[2]
      this.data3 = res.data[3]
      this.data4 = res.data[4]
      this.init()
    })
  },
  methods: {
    init () {
      this.myChart = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '疫苗关注量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['', '新冠疫苗', '9价疫苗', '4价疫苗', '2价疫苗', '']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '新冠疫苗',
            type: 'bar',
            stack: '总量',
            areaStyle: {},
            data: ['', this.data1, this.data2, this.data3, this.data4, '']
          }
        ]
      }
      this.myChart.setOption(option)
    }
  }
}

</script>
