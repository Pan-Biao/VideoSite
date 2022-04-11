import { createApp } from 'vue'
import VueRouter from './routes/index'
import App from './App.vue'
import naive from 'naive-ui'
import { useTable } from './plugins/vxe-table'

// 全局ctx(this) 上挂载 $axios
const app = createApp(App)
// app.use(naive)
app.use(VueRouter)
app.use(useTable)
app.mount('#app')
