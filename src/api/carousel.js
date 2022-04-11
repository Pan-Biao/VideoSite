import api from "./api"


function getUrl(str) {
    return `/api/v1/carousel/${str}`
}
function getUrlRoot(str) {
    return `/api/root/carousel/${str}`
}

//获取轮播图
async function useGetCarousel() {
    return await api.useFetch(api.GET, getUrl("list"))
}
//添加轮播图
async function useAddCarousel(data) {
    return await api.useFetchFormData(api.POST, getUrlRoot("add"), data)
}
//删除轮播图
async function useDeleteCarousel(id) {
    return await api.useFetch(api.DELETE, getUrlRoot(id))
}


export { useGetCarousel, useAddCarousel, useDeleteCarousel }




