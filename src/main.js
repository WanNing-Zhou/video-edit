import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import '@/components/main/videoTrack/CropTool/CropTool.scss'
import {store} from './store/index'

const app = createApp(App)

app.use(store)
app.use(ElementPlus)
app.mount('#app')
