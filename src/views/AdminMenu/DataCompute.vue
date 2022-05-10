<template>
  <div class="contetn">
    <div id="main" ref="chart" style="width: 100%; height: 400px"></div>
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
      xData: [], // x轴数据
      vaccine1: [],
      vaccine2: [],
      vaccine3: [],
      vaccine4: []
    }
  },
  mounted () {
    axios.post('http://localhost:8081/graduation-project/AdminMenu/chart/BookingChart.php', Qs.stringify({
      institutionId: sessionStorage.getItem('currentAdminId')
    })).then((res) => {
      console.log(res.data)
      this.xData = res.data[0]
      this.vaccine1 = res.data[1]
      this.vaccine2 = res.data[2]
      this.vaccine3 = res.data[3]
      this.vaccine4 = res.data[4]
      this.init()
    })
  },
  methods: {
    init () {
      this.myChart = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '疫苗预约量'
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
        legend: {
          data: ['新冠疫苗', '9价疫苗', '4价疫苗', '2价疫苗']
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
            data: this.xData
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
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.vaccine1
          },
          {
            name: '9价疫苗',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.vaccine2
          },
          {
            name: '4价疫苗',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.vaccine3
          },
          {
            name: '2价疫苗',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.vaccine4
          }
        ]
      }
      this.myChart.setOption(option)
    }
  }
}

</script>
