<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
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
      title: "视频1",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg",
    },
    {
      title: "视频2",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg",
    },
    {
      title: "视频3",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg",
    },
    {
      title: "视频4",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
    },
  ],
  vlist: [
    {
      id: "0",
      title: "视频1",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg",
      up: "up猪1",
      time: "3-15",
    },
    {
      id: "1",
      title: "视频2",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg",
      up: "up猪2",
      time: "3-15",
    },
    {
      id: "3",
      title: "视频3",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg",
      up: "up猪3",
      time: "3-11",
    },
    {
      title: "视频4",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪4",
      time: "3-13",
    },
    {
      title: "视频5",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪5",
      time: "3-15",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
  ],
  partitionList: [
    {
      id: 0,
      name: "动画",
    },
    {
      id: 1,
      name: "生活",
    },
    {
      id: 2,
      name: "美食",
    },
    {
      id: 3,
      name: "科技",
    },
    {
      id: 4,
      name: "游戏",
    },
    {
      id: 5,
      name: "音乐",
    },
    {
      id: 6,
      name: "影视",
    },
  ],
  partitionVideoList: [
    {
      title: "视频1",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg",
      up: "up猪1",
      time: "3-15",
    },
    {
      title: "视频2",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg",
      up: "up猪2",
      time: "3-15",
    },
    {
      title: "视频3",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg",
      up: "up猪3",
      time: "3-11",
    },
    {
      title: "视频4",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪4",
      time: "3-13",
    },
    {
      title: "视频5",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪5",
      time: "3-15",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
    {
      title: "视频6",
      path: "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
      up: "up猪6",
      time: "3-5",
    },
  ],
});
onMounted(() => {
  d.carouselData = d.carouselList[0];
});

function checkedCarousel(currentIndex, lastIndex) {
  d.carouselData = d.carouselList[currentIndex];
}
function jumpVideo(v) {
  console.log(v.id);
  d.router.push({
    name: "Video",
    params: {
      vid: v.id,
    },
  });
}
function jumpUp(up) {
  console.log(up);
  d.router.push({
    name: "PersonalData",
    params: {
      uid: up.id,
    },
  });
}
function jumpLink(c) {
  console.log(c);
  d.router.push({
    path: c.path,
  });
}

function handleBeforeLeave(tabName) {
  console.log(tabName)
  return true
}
function handleUpdateValue(value) {
  console.log(value)
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
          :src="item.path"
        />
      </n-carousel>
      <div @click="jumpLink(d.carouselData)" class="title">
        {{ d.carouselData.title }}
      </div>
    </div>
    <div class="right">
      <n-card content-style="padding: 0;" class="card" v-for="item in d.vlist">
        <div class="frame">
          <img @click="jumpVideo(item)" class="vimg" :src="item.path" />
          <div @click="jumpVideo(item)" class="title">
            <n-ellipsis :line-clamp="2">
              {{ item.title }}
            </n-ellipsis>
          </div>
          <div @click="jumpUp(item)" class="up">
            {{ `${item.up} - ${item.time}` }}
          </div>
        </div>
      </n-card>
    </div>
  </div>
  <div class="partition">
    <n-tabs
      justify-content="space-evenly"
      type="line"
      size="large"
      @before-leave="handleBeforeLeave"
      @update:value="handleUpdateValue"
    >
      <n-tab-pane
        v-for="item in d.partitionList"
        :name="item.id"
        :tab="item.name"
      >
        <n-card
          content-style="padding: 0;"
          class="card"
          v-for="item in d.partitionVideoList"
        >
          <div class="frame">
            <img @click="jumpVideo(item)" class="vimg" :src="item.path" />
            <div @click="jumpVideo(item)" class="title">
              <n-ellipsis :line-clamp="2">
                {{ item.title }}
              </n-ellipsis>
            </div>
            <div @click="jumpUp(item)" class="up">
              {{ `${item.up} - ${item.time}` }}
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
    width: calc(40vw - 100px);
    height: calc(36vw - 100px);
    min-width: 400px;
    min-height: 360px;
    margin-right: 40px;
    .n-carousel {
      width: 100%;
      height: calc(100% - 80px);
      min-height: 280px;
      border-radius: 5px;
      .carousel-img {
        // width: 100%;
        height: 100%;
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
    object-fit: inherit;
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