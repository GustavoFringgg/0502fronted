import { createApp} from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import VueInputAutowidth from 'vue-input-autowidth'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import axios from 'axios';

import './assets/index.postcss' // tailwind 基本設定
import './styles/element/index.scss' // element plus custom CSS

import 'vfonts/Lato.css' // 通用字體
import 'vfonts/FiraCode.css' // 等寬字體
// import 'ckeditor5/build/ckeditor.css'
import '@fortawesome/fontawesome-free/css/all.css' // Font Awesome

const head = createHead()
const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(head)
app.use(createPinia())
app.use(createVfm())
app.use(VueInputAutowidth)

var host = process.env.NODE_ENV === 'production' ? `https://${location.host}` : `http://${location.host}`
var hostname = process.env.NODE_ENV === 'production' ? `https://${location.hostname}` : `https://erp.shinymark.com`
var host_cors = process.env.NODE_ENV === 'production' ? `https://${location.host}` : `https://erp.shinymark.com:3443`

let protocol = process.env.NODE_ENV === 'production' ? `https` : `http`
axios.defaults.baseURL = `${protocol}://${location.hostname}:3433/`

// 攔截 axios request 加入 local token
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// 攔截 axios respone 加入判斷是否加入登入驗證
axios.interceptors.response.use(response => {
  return response
},
err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
      case 401:
        localStorage.removeItem("access_token")
        location.reload()
        console.log('該頁面未驗證')
        break
      case 403:
        console.log('該頁面無權限')
        break
      case 404:
        console.log('找不到該頁面')
        break
      case 500:
        console.log('伺服器出錯')
        break
      case 503:
        console.log('服務失效')
        break
      default:
        console.log(`連接錯誤${err.response.status}`)
    }
  } else {
    console.log('連接到服務器失敗')
  }
  return Promise.reject(err)
})

app.mount('#app')



/* zvvcxzvzxcv
zcvzvz
 */
