import messageApi from "../tool/message-api.vue";
import { axios } from "../tool"
import store from '../store'

export default {
    useFetch,
    useFetchFormData,
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete"
}

//获取
function useFetch(type, url, parameter) {

    let http = null

    switch (type) {
        case "get":
            http = axios.get
            break;
        case "post":
            http = axios.post
            break;
        case "put":
            http = axios.put
            break;
        case "delete":
            http = axios.delete
            break;
        default:
            break;
    }

    function rehttp() {
        if (parameter) {
            return http(url, parameter)
        } else {
            return http(url)
        }
    }

    return rehttp()
        .catch(err => {
            console.log(err)
            window.$message.error("无法连接服务器");
        })
        .then((res) => {
            res = res.data
            console.log(res)
            return new Promise((resolve, reject) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else if (res.code == 401) {
                    window.$message.error(res.msg);
                    store.dispatch("setUser", {})
                    reject(res)
                } else if (res.code == 77777 || res.code == 66666) {
                    window.$message.info(res.msg);
                    reject(res)
                } else {
                    window.$message.error(res.msg);
                    reject(res)
                }
            })
        })
}

//formData获取
function useFetchFormData(type, url, formData, func, cancelToken) {

    let http = null

    switch (type) {
        case "get":
            http = axios.get
            break;
        case "post":
            http = axios.post
            break;
        case "put":
            http = axios.put
            break;
        case "delete":
            http = axios.delete
            break;
        default:
            break;
    }

    function rehttp() {
        if (cancelToken && formData) {
            return http(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data;charset=UTF-8",
                },
                cancelToken,
                timeout: 0,
                onUploadProgress: func
            })
        }
        if (formData) {
            return http(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data;charset=UTF-8",
                },
                timeout: 0,
                onUploadProgress: func
            })
        } else {
            return http(url, {
                headers: {
                    "Content-Type": "multipart/form-data;charset=UTF-8",
                },
                onUploadProgress: func,
                timeout: 0,
            })
        }
    }

    return rehttp()
        .catch(err => {
            console.log(err)
            if (err.message) {
                window.$message.error(err.message);
                return
            }
            window.$message.error("无法连接服务器");
        })
        .then((res) => {
            res = res.data
            console.log(res)
            return new Promise((resolve, reject) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else if (res.code == 401) {
                    window.$message.error(res.msg);
                    store.dispatch("setUser", {})
                    reject(res)
                } else if (res.code == 77777 || res.code == 66666) {
                    window.$message.info(res.msg);
                    reject(res)
                }
                else {
                    window.$message.error(res.msg);
                    reject(res)
                }
            })
        })
}
