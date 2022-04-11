import api from "./api"

function getUrlVideo(str) {
    return `/api/v1/video/like/${str}`
}
function getUrlComment(str) {
    return `/api/v1/comment/like/${str}`
}

//点赞视频
async function useLikeVideo(id) {
    return await api.useFetch(api.POST, getUrlVideo(["like", id].join("/")))
}
//不点赞视频
async function useUnLikeVideo(id) {
    return await api.useFetch(api.POST, getUrlVideo(["unlike", id].join("/")))
}
//查询点赞视频
async function useIsLikeVideo(id) {
    return await api.useFetch(api.GET, getUrlVideo(["islike", id].join("/")))
}
//点赞评论
async function useLikeComment(id) {
    return await api.useFetch(api.POST, getUrlComment(["like", id].join("/")))
}
//不点赞评论
async function useUnLikeComment(id) {
    return await api.useFetch(api.POST, getUrlComment(["unlike", id].join("/")))
}
//查询点赞评论
async function useIsLikeComment(id) {
    return await api.useFetch(api.GET, getUrlComment("islike"))
}

export { useLikeVideo, useUnLikeVideo, useIsLikeVideo, useLikeComment, useUnLikeComment, useIsLikeComment }




