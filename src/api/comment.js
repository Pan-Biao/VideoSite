import api from "./api"

function getUrl(str) {
    return `/api/v1/comment/${str}`
}


//获取评论列表
async function useGetListComment(data) {
    return await api.useFetch(api.POST, getUrl("list"), data)
}
//添加评论
async function useCreateComment(id, data) {
    return await api.useFetch(api.POST, getUrl(id), data)
}
//删除评论
async function useDeleteComment(id) {
    return await api.useFetch(api.DELETE, getUrl(id))
}


export {
    useGetListComment, useCreateComment, useDeleteComment
}




