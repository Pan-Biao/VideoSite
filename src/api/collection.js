import api from "./api"

function getUrl(str) {
    return `/api/v1/collection/${str}`
}


//获取收藏列表
async function useGetListCollection(id) {
    return await api.useFetch(api.GET, getUrl(["list", id].join("/")))
}
//是否收藏
async function useIsCollection(id) {
    return await api.useFetch(api.GET, getUrl(["iscollection", id].join("/")))
}
//添加收藏
async function useCreateCollection(data) {
    return await api.useFetch(api.POST, getUrl("add"), data)
}
//删除收藏
async function useDeleteCollection(id) {
    return await api.useFetch(api.DELETE, getUrl(id))
}


export {
    useGetListCollection, useCreateCollection, useDeleteCollection, useIsCollection
}




