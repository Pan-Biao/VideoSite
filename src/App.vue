<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive, onMounted, ref, nextTick, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { darkTheme, zhCN } from "naive-ui";
import messageApi from "./tool/message-api.vue";
import store from "./store/index";
import { Icon } from "@vicons/utils";
import { Search, UserCircle } from "@vicons/fa";
import { useGetMe, useLoginOut, useRefreshToken } from "./api/user";
import { Cookies } from "./tool";
//主数据
const d = reactive({
  theme: null,
  activeTheme: false,
  isRouterAlive: true,
  active: false,
  router: useRouter(),
  searchValue: "",
  flag: false,
});
provide("reloadView", reloadView);
provide("getMe", getMe);
provide("setTheme", setTheme);
//运行时
onMounted(() => {
  if (Cookies.get("X-Token")) {
    getMe().then((res) => {
      useRefreshToken().then((res) => {
        let day = new Date(res.token_expire).getDay();
        Cookies.set("X-Token", res.token, { expires: day });
      });
    });
  }
});

// d.theme = useOsTheme();
//获取路由元数据
useRouter().beforeEach((to, from) => {
  d.flag = ref(to.meta.flag);
});

const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#000000";
  } else {
    style.background = "rgb(179, 179, 179)";
  }
  return style;
};
//头像下拉菜单
const options = [
  {
    label: "我的投稿",
    key: "投稿",
    props: {
      onClick: () => {
        d.router.push({
          name: "ContributionList",
        });
      },
    },
  },
  {
    label: "修改信息",
    key: "修改信息",
    props: {
      onClick: () => {
        d.router.push({
          name: "UserModify",
          params: {
            uid: store.state.userData.id,
          },
        });
      },
    },
  },
  {
    label: "退出登录",
    key: "退出登录",
    props: {
      onClick: () => {
        if (store.getters.userData.id) {
          useLoginOut().then((res) => {
            if (res) {
              Cookies.remove("X-Token");
              //用户数据初始化
              store.dispatch("setUser", {
                id: 0,
                info: "",
                root: false,
                nickname: "",
                head_portrait: "",
              });
              window.$message.success("退出登录成功")
              reloadView()
            }
          });
        }
      },
    },
  },
];
const searchKeyup = (value) => {
  if (value.keyCode == 13) {
    console.log(d.searchValue);
    d.router.push({
      name: "Search",
      params: {
        value: d.searchValue,
      },
    });
  }
};
const search = () => {
  d.router.push({
    name: "Search",
    params: {
      value: d.searchValue,
    },
  });
};

const handleSelect = (key) => {
  console.log(key);
};
function avaterClick() {
  if (store.getters.userData.id) {
    d.router.push({
      name: "Space",
      params: {
        uid: store.getters.userData.id,
      },
    });
  } else {
    d.router.push({
      name: "Login",
    });
  }
}
function logo() {
  reloadView();
  d.router.push({
    name: "Home",
  });
}
function contribution() {
  d.router.push({
    name: "Contribution",
  });
}
/**
 * 刷新 router-view
 */
function reloadView() {
  d.isRouterAlive = false;
  nextTick(() => {
    d.isRouterAlive = true;
  });
}
// 获取用户数据
async function getMe() {
  return useGetMe()
    .then((res) => {
      store.dispatch("setUser", res);
    })
    .catch((err) => {
      store.dispatch("setUser", {});
    });
}
//设置主题
function setTheme() {
  d.theme = null;
}
</script>

<template>
  <n-config-provider :locale="zhCN" :theme="d.theme">
    <!-- 顶部 -->
    <n-card v-show="!d.flag" content-style="padding: 0;" :bordered="false">
      <div class="header">
        <n-space justify="space-between" style="flex-wrap: nowrap">
          <div class="left">
            <n-image
              height="40"
              :src="`${store.state.assetsApi}/logo2.png`"
              style="cursor: pointer"
              @click="logo"
              preview-disabled
            />
            <n-input
              @keyup="searchKeyup"
              v-model:value="d.searchValue"
              round
              placeholder="搜索"
            >
              <template #suffix>
                <n-icon
                  style="cursor: pointer"
                  :component="Search"
                  @click="search"
                >
                </n-icon>
              </template>
            </n-input>
          </div>
          <div class="right">
            <div class="nickname">
              {{
                store.getters.userData.nickname
                  ? store.getters.userData.nickname
                  : "点击头像登录"
              }}
            </div>
            <n-dropdown
              trigger="hover"
              :options="store.getters.userData.id ? options : []"
              @select="handleSelect"
            >
              <n-avatar
                style="cursor: pointer"
                round
                :size="40"
                v-if="store.getters.userData.head_portrait"
                @click="avaterClick"
                :src="
                  store.state.fileApi + store.getters.userData.head_portrait
                "
              />
              <n-icon
                style="cursor: pointer; margin-right: 40px"
                @click="avaterClick"
                v-else
                size="40"
                :component="UserCircle"
              />
            </n-dropdown>
            <n-button
              v-show="store.getters.userData.id"
              dashed
              @click="contribution"
            >
              投稿
            </n-button>
            <n-button
              dashed
              @click="
                () => {
                  d.active = true;
                }
              "
            >
              设置
            </n-button>
          </div>
        </n-space>
      </div>
    </n-card>
    <!-- 主页面 -->
    <n-card :bordered="false" content-style="padding: 0;">
      <div
        class="content"
        :style="d.flag ? `height: 100vh;` : `height: calc(100vh - 60px);`"
      >
        <n-scrollbar>
          <router-view v-if="d.isRouterAlive" />
        </n-scrollbar>
      </div>
    </n-card>
    <!-- 消息 -->
    <n-message-provider>
      <messageApi />
    </n-message-provider>
    <!-- 边侧栏 -->
    <n-drawer v-model:show="d.active" :width="120" placement="right">
      <n-drawer-content closable>
        <template #header> 设置 </template>
        <n-space>
          风格模式
          <n-switch
            v-model:value="d.activeTheme"
            size="small"
            :rail-style="railStyle"
            @update:value="
              (value) => {
                if (value) {
                  d.theme = darkTheme;
                } else {
                  d.theme = null;
                }
              }
            "
          >
            <template #checked> 夜间 </template>
            <template #unchecked> 默认 </template>
          </n-switch>
        </n-space>
        <template #footer> 设置你喜欢的样式吧 </template>
      </n-drawer-content>
    </n-drawer>
  </n-config-provider>
</template>

<style scoped lang="less">
.css {
  color: rgb(179, 179, 179);
}
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#app {
  padding: 0;
  margin: 0;
  // min-width: 1240px;
}
.header {
  min-width: 840px;
  box-sizing: border-box;
  height: 60px;
  padding: 10px 100px;
  z-index: 999;
  position: relative;
  box-shadow: 0 0 4px rgba(189, 189, 189, 0.5);
  .left {
    display: flex;
    justify-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    .n-image {
      margin-right: 40px;
    }
  }
  .right {
    display: flex;
    justify-items: center;
    flex-direction: row;
    align-items: center;
    .nickname {
      margin-right: 20px;
      color: #ff6a00;
      cursor: default;
      min-width: 90px;
      text-align: center;
    }
    .n-avatar {
      margin-right: 40px;
    }
    .n-button {
      margin-right: 20px;
    }
  }
}
.content {
  height: calc(100vh - 60px);
  width: 100vw;
  // overflow-y: auto;
  // overflow-x: hidden;
}
.n-card {
  border-radius: 0;
}
</style>
