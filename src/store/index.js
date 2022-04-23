// 引入
import { createStore } from "vuex";
import request from '../tool/axios';
import { useGetMe } from "../api/user"

const api = process.env.BASE_API

export default createStore({
    // 声明变量
    state: {
        "name": 'xxxxx',
        "api": api,
        "fileApi": `${api}/file/`,
        "assetsApi": `${api}/assets/`,
        "userData": {
            id: 0,
            info: "",
            root: false,
            nickname: "",
            head_portrait: "",
        },
        "searchValue": ""
    },
    getters: {
        userData: (state) => {
            return state.userData
        }
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
            context.commit('setUser', value)
        },
        setSearch(context, value) {
            context.commit("setSearch", value)
        },
        getUser({ commit }) {
            // 返回一个Promise函数
            return new Promise((reslove, reject) => {
                // 请求
                useGetMe().then(res => {
                    // 修改getAData的值
                    commit('setUser', res)
                    reslove(res)
                }).catch(res => { reject(res) })
            })
        },
    },
    modules: {},
});
