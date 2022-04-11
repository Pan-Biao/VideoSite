import api from "./api"

function getUrl(str) {
    return `/api/v1/video/${str}`
}
function getUrlRoot(str) {
    return `/api/root/video/${str}`
}

//获取视频信息
async function useGetVideo(id) {
    return await api.useFetch(api.GET, getUrl(id))
}
//增加视频播放数
async function usePlayVideo(id) {
    return await api.useFetch(api.POST, getUrl(["play", id].join("/")))
}
//获取视频列表
async function useGetVideoList(data) {
    return await api.useFetch(api.POST, getUrl("list"), data)
}
//创建视频
async function useCreateVideo(data, func) {
    return await api.useFetchFormData(api.POST, getUrl("create"), data, func)
}
//更新视频
async function useUpdateVideo(id, data, func) {
    return await api.useFetchFormData(api.PUT, getUrl(id), data, func)
}
//删除视频
async function useDeleteVideo(id, data) {
    return await api.useFetch(api.DELETE, getUrl(id), data)
}
//禁用视频
async function useVideoSuspend(id) {
    return await api.useFetch(api.POST, getUrlRoot(["suspend", id].join("/")))
}
//解禁视频
async function useVideoUnseal(id) {
    return await api.useFetch(api.POST, getUrlRoot(["unseal", id].join("/")))
}

export { useGetVideo, usePlayVideo, useGetVideoList, useCreateVideo, useUpdateVideo, useDeleteVideo, useVideoUnseal, useVideoSuspend }




