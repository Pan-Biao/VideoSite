import api from "./api"

function getUrl(str) {
    return `/api/v1/favorite/${str}`
}

const favoriteApi = {
    //获取收藏夹列表
    async getListFavorite(id) {
        return await api.useFetch(api.GET, getUrl(["list", id].join("/")))
    },
    //添加收藏夹
    async createFavorite(data) {
        return await api.useFetch(api.POST, getUrl("add"), data)
    },
    //更新收藏夹
    async updateFavorite(id, data) {
        return await api.useFetch(api.PUT, getUrl(id), data)
    },
    //删除收藏夹
    async deleteFavorite(id) {
        return await api.useFetch(api.DELETE, getUrl(id))
    },
}

export default {
    ...favoriteApi
}




