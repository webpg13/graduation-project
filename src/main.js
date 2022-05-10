import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/iconfont/iconfont.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import '@/assets/style.scss'

createApp(App).use(store).use(router, VueAxios, axios).use(ElementUI).mount('#app')
