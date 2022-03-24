// 引入
import { createStore } from "vuex";
import request from '../tool/axios';

const api = "http://localhost:2333"

export default createStore({
    // 声明变量
    state: {
        "name": 'xxxxx',
        "api": api,
        "fileApi": `${api}/file/`,
        "userData": {},
        "searchValue": ""
    },
    // 修改变量（state不能直接赋值修改，只能通过mutations）
    mutations: {
        // 参数一：state，参数二：新值
        getUser(state, newValue) {
            state.userData = newValue
        },
        setUser(state, newValue) {
            state.userData = newValue
        },
        setSearch(state, newValue) {
            state.searchValue = newValue
        }
    },
    // mutations的值由actions传入
    actions: {
        // 参数一：自带属性，参数二：新值
        setUser(context, value) {
            // 修改getname的值
            context.commit('setUser', value)
        },
        setSearch(context, value) {
            context.commit("setSearch", value)
        },
        getUser(context) {
            // 返回一个Promise函数
            return new Promise((reslove, reject) => {
                // 请求
                request.get('/api/v1/user/me').then(res => {
                    // 修改getAData的值
                    context.commit('getAData', res)
                    reslove(res)
                }).catch(res => { reject(res) })
            })
        },

    },
    modules: {},
});
