<script setup>
import { reactive, ref, onMounted, h,inject } from "vue";
import store from "../../store";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { NIcon } from "naive-ui";
import { ChalkboardTeacher, User, Video, ThLarge } from "@vicons/fa";

//主数据
const d = reactive({
  router: useRouter(),
});
const setTheme = inject("setTheme") 
//运行时
onMounted(() => {
  if (!store.getters.userData.root) {
    window.$message.error("无权限");
    d.router.push({
      name: "Login",
    });
  }
  setTheme()
});
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
//菜单配置
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Carousel",
          },
        },
        { default: () => "轮播图设置" }
      ),
    key: "carousels",
    icon: renderIcon(ChalkboardTeacher),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Users",
          },
        },
        { default: () => "用户信息" }
      ),
    icon: renderIcon(User),
    key: "users",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Videos",
          },
        },
        { default: () => "视频信息" }
      ),
    icon: renderIcon(Video),
    key: "videos",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "SubArea",
          },
        },
        { default: () => "分区设置" }
      ),
    icon: renderIcon(ThLarge),
    key: "subarea",
  },
];
</script>
<template>
  <div class="body">
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        show-trigger
      >
        <n-menu
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>
      <router-view />
    </n-layout>
  </div>
</template>
<style lang="less" scoped>
.body {
  width: 100vw;
  height: 100vh;
  min-width: 1280px;
  .n-layout {
    height: 100vh;
  }
}
</style>
