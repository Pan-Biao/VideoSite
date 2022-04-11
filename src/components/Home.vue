<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
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
  direction: ["horizontal", "vertical"][0],
  showArrow: true,
  type: ["dot", "line"][1],
  placement: ["top", "bottom", "left", "right"][1],
  draggable: true,
  trigger: ["click", "hover"][1],
  centeredSlides: true,
  autoplay: true,
  effect: ["slide", "fade", "card"][0],
  interval: 3000,
  carouselData: {},
  carouselList: [
    {
      id: 1,
      title: "轮播图展示1",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg",
      cover: "",
    },
  ],
  vlist: [
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
  //默认轮播图第一
  d.carouselData = d.carouselList[0];
  //获取轮播图
  getCarouselList();
  //获取推荐视频列表
  getVList();
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
//获取轮播图列表
function getCarouselList() {
  useGetCarousel().then((res) => {
    if (res) {
      d.carouselList = res;
    }
  });
}
//获取推荐视频列表
function getVList() {
  useGetVideoList({
    number: 6,
    page_number: 1,
    sorts: [
      {
        field: "like_number",
        sort: "desc",
      },
    ],
  }).then((res) => {
    if (res) d.vlist = res.videos;
  });
}
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
//切换轮播图
function checkedCarousel(currentIndex, lastIndex) {
  d.carouselList[currentIndex]
    ? (d.carouselData = d.carouselList[currentIndex])
    : "";
}
//视频跳转
function jumpVideo(v) {
  console.log(v.id);
  d.router.push({
    name: "Video",
    params: {
      vid: v.id,
    },
  });
}
//跳转UP
function jumpUp(up) {
  console.log(up);
  d.router.push({
    name: "Space",
    params: {
      uid: up.id,
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
  <div class="recommend">
    <div class="left">
      <n-carousel
        :direction="d.direction"
        :show-arrow="d.showArrow"
        :dot-type="d.type"
        :dot-placement="d.placement"
        :trigger="d.trigger"
        :draggable="d.draggable"
        :centered-slides="d.centeredSlides"
        :autoplay="d.autoplay"
        :effect="d.effect"
        :interval="d.interval"
        :on-update:current-index="checkedCarousel"
      >
        <img
          @click="jumpLink(item)"
          class="carousel-img"
          v-for="item in d.carouselList"
          :key="item.id"
          :src="store.state.fileApi + item.cover"
        />
      </n-carousel>
      <div @click="jumpLink(d.carouselData)" class="title">
        {{ d.carouselData.title }}
      </div>
    </div>
    <div class="right">
      <n-card
        content-style="padding: 0;"
        class="card"
        v-for="item in d.vlist"
        :key="item.id"
      >
        <div class="frame">
          <img
            @click="jumpVideo(item)"
            class="vimg"
            :src="store.state.fileApi + item.cover"
          />
          <div @click="jumpVideo(item)" class="title">
            <n-ellipsis :line-clamp="2">
              {{ item.title }}
            </n-ellipsis>
          </div>
          <div @click="jumpUp(item)" class="up">
            {{ `${item.user.nickname}  ${time(item.created_at)}` }}
          </div>
        </div>
      </n-card>
    </div>
  </div>
  <div class="partition">
    <n-tabs
      justify-content="space-evenly"
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
              @click="jumpVideo(item)"
              class="vimg"
              :src="store.state.fileApi + item.cover"
            />
            <div @click="jumpVideo(item)" class="title">
              <n-ellipsis :line-clamp="2">
                {{ item.title }}
              </n-ellipsis>
            </div>
            <div @click="jumpUp(item)" class="up">
              {{ `${item.user.nickname}  ${time(item.created_at)}` }}
            </div>
          </div>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
.recommend {
  margin: 20px 100px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  .left {
    min-width: 400px;
    width: calc(40vw - 100px);
    margin-right: 40px;
    .n-carousel {
      width: 100%;
      height: calc(28vw - 100px);
      min-height: 280px;
      border-radius: 5px;
      cursor: pointer;
      .carousel-img {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        // height: 100%;
        object-fit: cover;
      }
    }
    .title {
      margin: 0 10px;
      margin-top: 10px;
      margin-bottom: 30px;
      line-height: 40px;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 24px;
      height: 40px;
      cursor: pointer;
    }
    .title:hover {
      color: #63e2b7;
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    justify-items: center;
    align-items: stretch;
    align-content: space-between;
    width: calc(60vw - 140px);
    height: calc(36vw - 100px);
    min-width: 600px;
    min-height: 360px;
    .n-card {
      width: 32%;
      height: calc((36vw - 120px) / 2);
      min-height: 170px;
      border-radius: 5px;
      overflow: hidden;
    }
  }
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
  margin: 40px 100px;
  min-width: 1040px;
  .n-tab-pane {
    display: flex;
    justify-content: space-between;
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
    }
  }
}
</style>
