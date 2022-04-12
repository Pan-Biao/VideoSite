/*
 * Axios封装
 */
import axios from 'axios';
import store from "../store/index";
import { Cookies } from "../tool";

//数据请求字符
axios.defaults.baseURL = process.env.BASE_API2,
    // 如果请求话费了超过 `timeout` 的时间，请求将被中断
    axios.defaults.timeout = 5000;
// 表示跨域请求时是否需要使用凭证
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// 允许跨域
// axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 若是有做鉴权token , 就给头部带上token
    if (Cookies.get("X-Token")) {
        config.headers.Authorization = Cookies.get("X-Token")
    }
    return config;
}, error => {
    return Promise.reject(error.data.error.message);
})

export default axios
