import { createApp } from 'vue'
import VueRouter from './routes/index'
import App from './App.vue'
import naive from 'naive-ui'
import axios from './tool/axios'

// 全局ctx(this) 上挂载 $axios
const app = createApp(App)
window.$http = axios
app.use(naive)
app.use(VueRouter)
app.mount('#app')
