//响应拦截
import axios from 'axios'
//const axios = require('axios');
//axios拦截请求器，创建http请求，支持promise
// 创建默认实例,timeout为响应超时时间
let service = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000
})
//export default 是导出模块中的一个默认值的语法。只能有一个default，无需{}
//使用 export default 时，可以在其他文件中通过 import 语句导入这个默认值，不需要知道它的具体名称。
export default service
