import api from "./api"

function getUrl(str) {
    return `/api/v1/collection/${str}`
}

const collectionApi = {
    //获取收藏列表
    async getListCollection(id) {
        return await api.useFetch(api.GET, getUrl(["list", id].join("/")))
    },
    //添加收藏
    async createCollection(data) {
        return await api.useFetch(api.POST, getUrl("add"), data)
    },
    //删除收藏
    async deleteCollection(id) {
        return await api.useFetch(api.DELETE, getUrl(id))
    },
}

export default {
    ...collectionApi
}




