import api from "./api"

function getUrl(str) {
    return `/api/v1/follow/${str}`
}

//获取关注列表
async function useGetFollower(id) {
    return await api.useFetch(api.GET, getUrl(["follower", id].join("/")))
}
//获取粉丝列表
async function useGetFans(id) {
    return await api.useFetch(api.GET, getUrl(["fans", id].join("/")))
}
//查询关注
async function useIsFollow(id) {
    return await api.useFetch(api.GET, getUrl(["isfollow", id].join("/")))
}
//添加关注
async function useCreateFollow(id, data) {
    return await api.useFetch(api.POST, getUrl(id), data)
}
//删除关注
async function useDeleteFollow(id) {
    return await api.useFetch(api.DELETE, getUrl(id))
}


export { useGetFollower, useGetFans, useCreateFollow, useDeleteFollow, useIsFollow }




