<script setup>
import { reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useGetVideoList } from "../api/video";
import { time } from "../tool";
import store from "../store/index";

const d = reactive({
  route: useRoute(),
  searchValue: "",
  list: [],
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
        info: "",
      },
    },
  ],
});

watchEffect(() => {
  d.searchValue = d.route.params.value;
  let temp = d.searchValue ? d.searchValue.split(/\s+/) : [];
  useGetVideoList({
    number: 20,
    page_number: 1,
    searchs: temp,
    sorts: [
      {
        field: "like_number",
        sort: "desc",
      },
    ],
  }).then((res) => {
    d.vlist = res.videos;
  });
});
</script>
<template>
  <div class="searchFrame">
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
