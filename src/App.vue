<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOsTheme, darkTheme, zhCN } from "naive-ui";
import messageApi from "./tool/message-api.vue";
import store from "./store/index";
import router from "./routes";

const d = reactive({
  theme: useOsTheme,
  activeTheme: false,
  active: false,
  router: useRouter(),
  searchValue: "",
  flag: false,
});

useRouter().beforeEach((to, from) => {
  d.flag = ref(to.meta.flag);
});
onMounted(() => {
  const state = window.localStorage.getItem("state");
  if (state) {
    window.$http.get("/api/v1/user/me").then(({ data }) => {
      if (data.code == 200) {
        store.dispatch("setUser", data.data);
        console.log(store.state.userData);
      } else {
        window.localStorage.removeItem("state");
        window.$message.success(data.msg);
        d.router.push({
          name: "Login",
        });
      }
    });
  }

  console.log();
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
const options = [
  {
    label: "我的投稿",
    key: "投稿",
    props: {
      onClick: () => {
        window.$message.success("我的投稿");
      },
    },
  },
  {
    label: "修改信息",
    key: "修改信息",
    props: {
      onClick: () => {
        window.$message.success("修改信息");
      },
    },
  },
  {
    label: "退出登录",
    key: "退出登录",
    props: {
      onClick: () => {
        window.$http.delete("/api/v1/user/logout").then(({ data }) => {
          if (data.code == 200) {
            window.localStorage.removeItem("state");
            window.$message.success("已退出登录");
          } else {
            window.localStorage.removeItem("state");
            window.$message.warning(data.msg);
            d.router.push({
              name: "Login",
            });
          }
        });
      },
    },
  },
];

const search = (value) => {
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

const handleSelect = (key) => {
  console.log(key);
};
function avaterClick() {
  const state = window.localStorage.getItem("state");
  if (state) {
    d.router.push({
      name: "Space",
      params: {
        uid: store.state.userData.id,
      },
    });
  } else {
    d.router.push({
      name: "Login",
    });
  }
}
function logo() {
  d.router.push({
    name: "Home",
  });
}
function contribution() {
  d.router.push({
    name: "Contribution",
  });
}
</script>

<template>
  <n-config-provider :locale="zhCN" :theme="d.theme">
    <n-card v-show="!d.flag" content-style="padding: 0;" :bordered="false">
      <div class="header">
        <n-space justify="space-between">
          <div class="left">
            <n-image
              height="40"
              :src="`${store.state.api}/api/v1/assets/logo.png`"
              style="cursor: pointer"
              @click="logo"
              preview-disabled
            />
            <n-input
              @keyup="search"
              v-model:value="d.searchValue"
              round
              placeholder="搜索"
            >
              <template #suffix>
                <n-icon :component="FlashOutline" />
              </template>
            </n-input>
          </div>
          <div class="right">
            <n-dropdown
              trigger="hover"
              :options="options"
              @select="handleSelect"
            >
              <n-avatar
                style="cursor: pointer"
                round
                :size="40"
                @click="avaterClick"
                :src="`${store.state.api}/api/v1/assets/logo.png`"
              />
            </n-dropdown>
            <n-button dashed @click="contribution"> 投稿 </n-button>
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
    <n-card :bordered="false" content-style="padding: 0;">
      <div
        class="content"
        :style="d.flag ? `height: 100vh;` : `height: calc(100vh - 60px);`"
      >
        <n-scrollbar>
          <router-view />
        </n-scrollbar>
      </div>
    </n-card>
    <n-message-provider>
      <messageApi />
    </n-message-provider>
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
