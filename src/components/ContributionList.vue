<script setup>
import { reactive, watchEffect, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGetVideoList, useDeleteVideo } from "../api/video";
import { time, formatNumber } from "../tool";
import store from "../store/index";

const d = reactive({
  route: useRoute(),
  router: useRouter(),
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

//视频跳转
function jumpVideo(id) {
  d.router.push({
    name: "ContributionModify",
    params: {
      vid: id,
    },
  });
}
function deleteContribution(id, index) {
  useDeleteVideo(id).then((res) => {
    if (res) {
      d.vlist.splice(index, 1);
    }
  });
}
//
function getVideoList() {
  useGetVideoList({
    number: 20,
    page_number: 1,
    uid: store.getters.userData.id,
    sorts: [
      {
        field: "created_at",
        sort: "desc",
      },
    ],
  }).then((res) => {
    if (store.getters.userData.id) {
      d.vlist = res.videos;
    } else {
      d.vlist = [];
    }
  });
}
//获取方法
const getMe = inject("getMe");

onMounted(() => {
  if (store.getters.userData.id) {
    getVideoList();
  }else{
    d.vlist = []
  }
});
</script>
<template>
  <div class="ListFrame">
    <n-card
      content-style="padding: 0;"
      class="card"
      v-for="item in d.vlist"
      :key="item.id"
    >
      <div class="frame">
        <img
          @click="jumpVideo(item.id)"
          class="vimg"
          :src="store.state.fileApi + item.cover"
        />
        <div @click="jumpVideo(item.id)" class="title">
          <n-ellipsis :line-clamp="2">
            {{ item.title }}
          </n-ellipsis>
        </div>
        <div class="up">
          <p>
            {{
              `点赞&nbsp;${formatNumber(item.like_number)}&nbsp;&nbsp;
              播放&nbsp;${formatNumber(item.play_number)}`
            }}
          </p>
          <p>{{ `时间&nbsp;${time(item.created_at)}` }}</p>
        </div>
        <div class="delete" @click="deleteContribution(item.id)">删除</div>
      </div>
    </n-card>
  </div>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
.ListFrame {
  display: flex;
  justify-content: flex-start;
  align-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  // padding-top: 40px;
  min-width: 1040px;
  margin: 40px 100px;
  .n-card {
    margin-right: 25px;
    width: calc(20% - 20px);
    height: calc((36vw - 95px) / 2);
    min-height: 170px;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .n-card:nth-child(5n) {
    margin-right: 0;
  }
}
.frame {
  height: 100%;
  display: flex;
  justify-items: center;
  flex-direction: column;
  justify-content: space-between;
  .delete {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
    line-height: 12px;
    height: 12px;
    font-size: 12px;
    padding: 5px;
    border: 1px solid #00b576;
    border-radius: 5px;
  }
  .delete:hover {
    background-color: #00b576;
    padding: 4px;
  }
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
    line-height: 15px;
    min-height: 30px;
    margin: 0 5px;
    margin-bottom: 5px;
    color: rgb(175, 175, 175);
    p {
      padding: 0;
      margin: 0;
    }
  }
}
</style>
