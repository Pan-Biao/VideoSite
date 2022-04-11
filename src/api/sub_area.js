import api from "./api"

function getUrl(str) {
    return `/api/v1/sub_area/${str}`
}
function getUrlRoot(str) {
    return `/api/root/sub_area/${str}`
}

//获取分区列表
async function useGetListSubArea() {
    return await api.useFetch(api.GET, getUrl("list"))
}
//添加分区
async function useCreateSubArea(data) {
    return await api.useFetch(api.POST, getUrlRoot("add"), data)
}
//更新分区
async function useUpdateSubArea(id, data) {
    return await api.useFetch(api.PUT, getUrlRoot(id), data)
}
//删除分区
async function useDeleteSubArea(id) {
    return await api.useFetch(api.DELETE, getUrlRoot(id))
}


export {
    useGetListSubArea, useCreateSubArea, useUpdateSubArea, useDeleteSubArea
}




