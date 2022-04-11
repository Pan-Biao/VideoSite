// user.js
import api from "./api"

function getUrl(str) {
    return `/api/v1/user/${str}`
}
function getUrlRoot(str) {
    return `/api/root/user/${str}`
}
//获取用户信息
async function useGetUserInformation(id) {
    return await api.useFetch(api.GET, getUrl(id))
}
//获取个人信息
async function useGetMe() {
    return await api.useFetch(api.GET, getUrl("me"))
}
//注册
async function useRegister(data) {
    return await api.useFetch(api.POST, getUrl("register"), data)
}
//登录
async function useLogin(data) {
    return await api.useFetch(api.POST, getUrl("login"), data)
}
//退出登录
async function useLoginOut() {
    return await api.useFetch(api.DELETE, getUrl("logout"))
}
//更新用户信息
async function useUpdateUser(data) {
    return await api.useFetch(api.PUT, getUrl("login"), data)
}
//获取用户列表
async function useGetUserList(data) {
    return await api.useFetch(api.POST, getUrlRoot("list"), data)
}
//禁用用户
async function useUserSuspend(id) {
    return await api.useFetch(api.POST, getUrlRoot(["suspend", id].join("/")))
}
//解禁用户
async function useUserUnseal(id) {
    return await api.useFetch(api.POST, getUrlRoot(["unseal", id].join("/")))
}
export {
    useGetUserInformation, useGetMe, useRegister, useLogin, useLoginOut, useUpdateUser, useUserSuspend, useUserUnseal, useGetUserList
}



