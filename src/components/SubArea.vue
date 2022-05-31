<script setup>
import { reactive, ref, onMounted, nextTick, inject } from "vue";
import { useRouter } from "vue-router";
import { useGetVideoList } from "../api/video";
import { useGetListSubArea } from "../api/sub_area";
import { useGetCarousel } from "../api/carousel";
import { time } from "../tool";
import store from "../store/index";
import { Link } from "@vicons/fa";
//数据
const tabsInstRef = ref(null);
const d = reactive({
  router: useRouter(),
  carouselData: {},
  tabsValue: 1,
  partitionList: [
    {
      id: 1,
      name: "默认",
    },
  ],
  partitionVideoList: [
    {
      title: "",
      info: "",
      created_at: 0,
      updated_at: 0,
      play_number: 0,
      said: 1,
      uid: 0,
      cover: "",
      path: "",
      like_number: 0,
      user: {
        id: 0,
        nickname: "",
        head_portrait: "",
        created_at: 0,
        updated_at: 0,
        info: "一个普通的学生,爆裂魔法万岁",
      },
    },
  ],
});
//运行时
onMounted(() => {
  //获取分区列表
  useGetListSubArea().then((res) => {
    if (res) {
      d.partitionList = res;
      //分区视频列表
      getPartitionVideoList(d.tabsValue);
      nextTick(() => {
        d.tabsValue = 1;
        tabsInstRef.value?.syncBarPosition();
      });
    }
  });
});
//获取分区视频列表
function getPartitionVideoList(said) {
  useGetVideoList({
    number: 20,
    page_number: 1,
    sorts: [
      {
        field: "like_number",
        sort: "desc",
      },
    ],
    said,
  }).then((res) => {
    if (res) d.partitionVideoList = res.videos;
  });
}
//视频跳转
//跳转视频页(打开新页面)
function jumpVideo(id) {
  let router = d.router.resolve({
    name: "Video",
    params: {
      vid: id,
    },
  });
  window.open(router.href, "_blank");
}
//跳转UP
function jumpUp(id) {
  d.router.push({
    name: "Space",
    params: {
      uid: id,
    },
  });
}
//跳转链接
function jumpLink(c) {
  console.log(c);
  window.location.href = c.path;
}
//分区切换
function handleUpdateValue(value) {
  nextTick(() => {
    getPartitionVideoList(value);
  });
}
</script>
<template>
  <div class="partition">
    <n-tabs
      type="line"
      v-model:value="d.tabsValue"
      ref="tabsInstRef"
      size="large"
      @update:value="handleUpdateValue"
    >
      <n-tab-pane
        v-for="item in d.partitionList"
        :key="item.id"
        :name="item.id"
        :tab="item.name"
      >
        <n-card
          content-style="padding: 0;"
          class="card"
          v-for="item in d.partitionVideoList"
          :key="item.id"
        >
          <div class="frame">
            <img
              @click="jumpVideo(item.id)"
              class="vimg"
              :src="item.cover != '' ? store.state.fileApi + item.cover : ''"
            />
            <div @click="jumpVideo(item.id)" class="title">
              <n-ellipsis :line-clamp="2">
                {{ item.title }}
              </n-ellipsis>
            </div>
            <div @click="jumpUp(item.user.id)" class="up">
              {{
                `${item.user.nickname}&nbsp;&nbsp;&nbsp;&nbsp;${time(
                  item.created_at
                )}`
              }}
            </div>
          </div>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
img[src=""],
img:not([src]) {
  opacity: 0;
}
.frame {
  height: 100%;
  display: flex;
  justify-items: center;
  flex-direction: column;
  justify-content: space-between;
  .vimg {
    width: 100%;
    height: calc((36vw - 120px - 140px) / 2);
    min-height: 100px;
    cursor: pointer;
    object-fit: cover;
  }
  .title {
    font-size: 15px;
    line-height: 20px;
    min-height: 40px;
    margin: 0 5px;
    margin-top: 5px;
    // text-align: justify;
    word-break: break-all;
    overflow: hidden;
    cursor: pointer;
  }
  .title:hover {
    color: #63e2b7;
  }
  .up {
    font-size: 12px;
    line-height: 12px;
    min-height: 12px;
    margin: 0 5px;
    margin-bottom: 5px;
    color: rgb(175, 175, 175);
    cursor: pointer;
  }
  .up:hover {
    color: #63e2b7;
  }
}
.partition {
  margin: 0px 100px;
  min-width: 1040px;
  :deep(.n-tabs-tab){
    margin-left: 10px;
    margin-right: 10px;
  }
  .n-tab-pane {
    display: flex;
    justify-content: flex-start;
    align-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    padding-top: 40px;
    .n-card {
      width: calc(20% - 20px);
      height: calc((36vw - 120px) / 2);
      min-height: 170px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 20px;
      margin-right: 25px;
    }
    .n-card:nth-child(5n) {
      margin-right: 0;
    }
  }
}
.custom-tabs .n-tabs-bar {
  background-color: transparent !important;
}
.custom-tabs .n-tabs-bar::after {
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: -2px;
  border-radius: 2px;
  background-color: var(--bar-color);
}
</style>
