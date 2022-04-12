import api from "./api"

function getUrl(str) {
    return `/api/v1/favorite/${str}`
}


//获取收藏夹列表
async function useGetListFavorite() {
    return await api.useFetch(api.GET, getUrl("list"))
}
//添加收藏夹
async function useCreateFavorite(data) {
    return await api.useFetch(api.POST, getUrl("add"), data)
}
//更新收藏夹
async function useUpdateFavorite(id, data) {
    return await api.useFetch(api.PUT, getUrl(id), data)
}
//删除收藏夹
async function useDeleteFavorite(id) {
    return await api.useFetch(api.DELETE, getUrl(id))
}

export {
    useGetListFavorite, useCreateFavorite, useUpdateFavorite, useDeleteFavorite
}




