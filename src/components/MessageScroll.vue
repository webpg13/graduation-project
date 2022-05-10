<template>
  <vue3-seamless-scroll :list="list" class="scroll" direction='down'>
    <div class="item" v-for="(item, index) in list" :key="index">
      <span>{{item.title}}</span>
      <span>{{item.date}}</span>
    </div>
  </vue3-seamless-scroll>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import axios from 'axios'
import Qs from 'qs'

export default defineComponent({
  name: 'App',
  components: {
    Vue3SeamlessScroll
  },
  setup () {
    const list = ref([
      {
      }
    ])
    axios.post('http://localhost:8081/graduation-project/Utils/GetRateText.php', Qs.stringify({
      vaccineId: 2,
      institutionId: 5
    })).then(function (response) {
      list.value[1] = {
        title: response.data[1][0],
        date: response.data[1][1]
      }
      list.value[2] = {
        title: response.data[1][0],
        date: response.data[1][1]
      }
      list.value[3] = {
        title: response.data[1][0],
        date: response.data[1][1]
      }
      list.value[4] = {
        title: response.data[1][0],
        date: response.data[1][1]
      }
      list.value[5] = {
        title: response.data[1][0],
        date: response.data[1][1]
      }
    })
    return { list }
  }
})
</script>

<style>
.scroll {
  height: 70px;
  width: 500px;
  margin: 0px auto;
}

.scroll .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}
</style>
