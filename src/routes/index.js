
import { Robot } from '@vicons/fa'
import { createRouter, createWebHashHistory } from 'vue-router'

// 1. 定义路由组件.
// 也可以从其他文件导入
import Home from "../components/Home.vue"
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
    { path: '/', name: "Home", component: Home },
    {
        path: '/root', name: "Root", meta: { flag: true }, component: () => import("../components/root/Root.vue"), children: [
            { path: "carousel", name: "Carousel", component: () => import("../components/root/Carousel.vue") },
            { path: "users", name: "Users", component: () => import("../components/root/Users.vue") },
            { path: "videos", name: "Videos", component: () => import("../components/root/Videos.vue") },
            { path: "subarea", name: "SubArea", component: () => import("../components/root/SubArea.vue") },
        ]
    },
    { path: '/login', name: "Login", meta: { flag: true }, component: () => import("../components/Login.vue") },
    { path: "/space/:uid", name: "Space", component: () => import("../components/Space.vue") },
    { path: "/contribution", name: "Contribution", component: () => import("../components/Contribution.vue") },
    { path: "/contribution/modify/:vid", name: "ContributionModify", meta: { modify: true }, component: () => import("../components/Contribution.vue") },
    { path: "/contribution/list", name: "ContributionList", component: () => import("../components/ContributionList.vue") },
    { path: "/user/modify/:uid", name: "UserModify", component: () => import("../components/UserModify.vue") },
    { path: "/search", name: "Search", component: () => import("../components/Search.vue") },
    { path: '/video/:vid', name: "Video", component: () => import("../components/PlayVideo.vue") },
    { path: '/test', name: "test", component: () => import("../components/test.vue") },
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    { path: '/:pathMatch(.*)*', name: 'NotFound', meta: { flag: true }, component: () => import("../components/NotFound.vue") },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router
