<script setup>
import { reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
const d = reactive({
  route: useRoute(),
  searchValue: "",
  list: [],
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
});
watchEffect(() => {
  d.value = d.route.params.value;
  // window.$http
  //   .get("/api/v1/videos", {
  //     value: d.route.params.value,
  //   })
  //   .then(({ data }) => {
  //     if (data.code == 200) {
  //       d.list = data.data;
  //     }
  //   });
});
</script>
<template>
  <div class="searchFrame">
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
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
.searchFrame {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  // padding-top: 40px;
  min-width: 1040px;
  margin: 40px 100px;
  .n-card {
      width: calc(20% - 20px);
      height: calc((36vw - 120px) / 2);
      min-height: 170px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 20px;
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
    color: rgb(0, 132, 255);
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
    color: rgb(0, 132, 255);
  }
}
</style>