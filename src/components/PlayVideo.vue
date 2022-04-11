<script setup>
import { reactive, ref, onMounted, inject, ssrContextKey } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";
import DPlayer from "dplayer";
import { time } from "../tool";
import { useGetVideo, usePlayVideo } from "../api/video";
import { useCreateFollow, useDeleteFollow, useIsFollow } from "../api/follow";
import {
  useLikeVideo,
  useUnLikeVideo,
  useIsLikeVideo,
  useLikeComment,
  useUnLikeComment,
  useIsLikeComment,
} from "../api/like";
import { UserCircle, TrashAlt } from "@vicons/fa";
import {
  useGetListComment,
  useCreateComment,
  useDeleteComment,
} from "../api/comment";
import { Table } from "vxe-table";

let dplayer = ref(null);
let vs = ref(null);
const d = reactive({
  route: useRoute(),
  router: useRouter(),
  dp: null,
  danmu: null,
  vid: 0,
  commentValue: "",
  isFollwe: false,
  isLike: false,
  vMessage: {
    path: "",
    cover: "",
    created_at: 0,
    id: 0,
    info: "",
    play_number: 0,
    said: 1,
    title: "美少女跳舞",
    uid: 1,
    updated_at: 0,
  },
  uMessage: {
    head_portrait: "",
    id: 0,
    nickname: "",
    info: "",
  },
  comments: [
    {
      comment: "",
      created_at: 0,
      user: {
        head_portrait: "",
        id: 0,
        nickname: "",
      },
    },
  ],
});
//初始化播放器
function initPlay() {
  let danmaku = {
    id: `videoweb_${d.vMessage.id}`,
    api: "https://dplayer.moerats.com/",
    // addition: [" https://api.prprpr.me/dplayer/v3/bilibili?aid=[aid]"],
  };
  function ifdanmaku() {
    if (store.getters.userData.id) {
      return danmaku;
    } else {
      return null;
    }
  }
  d.dp = new DPlayer({
    container: dplayer.value,
    playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
    video: {
      url: store.state.fileApi + d.vMessage.path,
    },
    danmaku: ifdanmaku(),
  });
  d.dp.on("play", function () {
    usePlayVideo(d.vid);
  });
}
//运行时
onMounted(() => {
  // DOM 元素将在初始渲染后分配给 ref
  const vid = d.route.params["vid"];
  d.vid = +vid;
  useGetVideo(vid).then((res) => {
    if (res) {
      d.vMessage = res;
      initPlay();
      d.uMessage = res.user;
      findFollow(d.uMessage.id);
    }
  });
  getCommentList();
});

//获取评论列表
function getCommentList() {
  useGetListComment({
    vid: d.vid,
    // sorts: [
    //   {
    //     field: "like_number",
    //     sort: "desc",
    //   },
    // ],
  }).then((res) => {
    if (res) d.comments = res ? res : [];
  });
}
//跳转UP
function jumpUp(up) {
  d.router.push({
    name: "Space",
    params: {
      uid: up.id,
    },
  });
}
//切换
function handleBeforeLeave(tabName) {
  console.log(tabName);
  return true;
}
//发表评论
function addComment(value) {
  useCreateComment(d.vid, {
    comment: value,
  }).then((res) => {
    if (res) {
      getCommentList();
      d.commentValue = "";
    }
  });
}
//删除评论
function deleteComment(id) {
  useDeleteComment(id).then((res) => {
    getCommentList();
  });
}
//关注
function follow(id) {
  useCreateFollow(id).then((res) => {
    if (res) d.isFollwe = true;
  });
}
//不关注
function notFollow(id) {
  useDeleteFollow(id).then((res) => {
    if (res) d.isFollwe = false;
  });
}
//查询关注
function findFollow(id) {
  useIsFollow(id).then((res) => {
    d.isFollwe = res;
  });
}
//查询点赞视频
function findLikeVideo(id) {
  useLikeVideo(id).then((res) => {
    d.isLike = res;
  });
}
//点赞视频
function likeVideo(id) {
  useLikeVideo(id).then((res) => {
    if (res) d.isLike = true;
  });
}
//不点赞视频
function unLikeVideo(id) {
  useUnLikeVideo(id).then((res) => {
    if (res) d.isLike = true;
  });
}
//查询点赞评论
function findLikeComment() {
  useLikeVideo(id).then((res) => {
    if(res){
      
    }
  });
}
//点赞评论
function likeComment(id) {
  useLikeComment(id).then((res) => {
    if (res) findLikeComment()
  });
}
//不点赞评论
function unLikeComment(id) {
  useUnLikeComment(id).then((res) => {
    if (res) findLikeComment()
  });
}
</script>
<template>
  <div class="frame">
    <div class="flex">
      <div class="v_message">
        <div class="v_title">{{ d.vMessage.title }}</div>
        <div class="v_time">
          {{
            `播放量 ${d.vMessage.play_number}   ${time(d.vMessage.created_at)}`
          }}
        </div>
      </div>
      <div class="u_message">
        <div class="u_frame">
          <n-avatar
            v-if="d.uMessage.head_portrait"
            class="u_avatar"
            :size="48"
            round
            :src="store.state.fileApi + d.uMessage.head_portrait"
            @click="jumpUp(d.uMessage)"
          />
          <n-icon
            style="cursor: pointer"
            @click="jumpUp(d.uMessage)"
            v-else
            size="40"
            :component="UserCircle"
          />
        </div>
        <div class="u_frame" style="margin-left: 20px">
          <div class="u_title">{{ d.uMessage.nickname }}</div>
          <div class="u_info">{{ d.uMessage.info }}</div>
          <n-button
            v-show="store.getters.userData.id && !d.isFollwe"
            type="info"
            size="tiny"
            ghost
            @click="follow(d.uMessage.id)"
          >
            关注
          </n-button>
          <n-button
            v-show="store.getters.userData.id && d.isFollwe"
            type="info"
            size="tiny"
            ghost
            @click="notFollow(d.uMessage.id)"
          >
            取消关注
          </n-button>
        </div>
      </div>
    </div>

    <div ref="dplayer" id="dplayer"></div>
    <div class="v_info">
      <n-ellipsis expand-trigger="click" :line-clamp="2" :tooltip="false">
        {{ d.vMessage.info }}
      </n-ellipsis>
    </div>

    <div class="comment_area">
      <div v-show="store.getters.userData.id" class="comment_input">
        <n-input
          type="textarea"
          :autosize="{
            minRows: 2,
          }"
          maxlength="100"
          clearable
          show-count
          v-model:value="d.commentValue"
        />
        <div @click="addComment(d.commentValue)" class="send">发表评论</div>
      </div>
      <div class="comment_list">
        <n-tabs
          type="line"
          size="small"
          @before-leave="handleBeforeLeave"
          @update:value="handleUpdateValue"
        >
          <n-tab-pane :name="0" tab="按时间">
            <div class="comment" v-for="item in d.comments" :key="item.id">
              <div class="avatar">
                <n-avatar
                  :size="48"
                  round
                  v-if="item.user.head_portrait"
                  @click="jumpUp(item.user)"
                  :src="store.state.fileApi + item.user.head_portrait"
                />
                <n-icon
                  style="cursor: pointer"
                  @click="jumpUp(item.user)"
                  v-else
                  size="40"
                  :component="UserCircle"
                />
              </div>
              <div class="comment_text">
                <div @click="jumpUp(item.user)" class="name">
                  {{ item.user.nickname }}
                </div>
                <div class="text">{{ item.comment }}</div>
                <div class="time">
                  {{ time(item.created_at) }}
                </div>
              </div>
              <div class="delete">
                <n-icon
                  v-show="item.commentator == store.getters.userData.id"
                  style="cursor: pointer"
                  @click="deleteComment(item.id)"
                  size="14"
                  :component="TrashAlt"
                />
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane :name="1" tab="按热度">
            <div class="comment" v-for="item in d.comments" :key="item.id">
              <div class="avatar">
                <n-avatar
                  :size="48"
                  round
                  v-if="item.user.head_portrait"
                  @click="jumpUp(item.user)"
                  :src="store.state.fileApi + item.user.head_portrait"
                />
                <n-icon
                  style="cursor: pointer"
                  @click="jumpUp(item.user)"
                  v-else
                  size="40"
                  :component="UserCircle"
                />
              </div>
              <div class="comment_text">
                <div @click="jumpUp(item.user)" class="name">
                  {{ item.user.nickname }}
                </div>
                <div class="text">{{ item.comment }}</div>
                <div class="time">
                  {{ time(item.created_at) }}
                </div>
              </div>
              <div class="delete">
                <n-icon
                  v-show="item.commentator == store.getters.userData.id"
                  style="cursor: pointer"
                  @click="deleteComment(item.id)"
                  size="14"
                  :component="TrashAlt"
                />
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
.frame {
  margin: 0px auto;
  padding: 0 40px;
  padding-top: 30px;
  max-width: 1280px;
  min-width: 1040px;
  .flex {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .comment_area {
    margin-top: 40px;
    margin-bottom: 40px;
    box-shadow: 0 0 4px rgba(189, 189, 189, 0.5);
    border-radius: 5px;
    padding: 20px;
    overflow: hidden;
    .comment_input {
      height: 60px;
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      .n-input {
        margin-right: 20px;
      }
      .send {
        box-shadow: 0 0 4px rgba(189, 189, 189, 0.5);
        overflow: hidden;
        width: 80px;
        line-height: 60px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
      }
      .send:hover {
        border: 1px solid #63e2b7;
        line-height: 58px;
      }
    }
    .comment_list {
      margin-top: 20px;
      padding: 0 10px;
      .comment {
        margin-top: 20px;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        .n-avatar {
          cursor: pointer;
        }
        .comment_text {
          width: 100%;
          margin-left: 10px;
          .name {
            cursor: pointer;
            line-height: 24px;
          }
          .name:hover {
            color: #63e2b7;
          }
          .text {
            height: 30px;
            line-height: 30px;
          }
          .time {
            font-size: 12px;
            color: rgb(175, 175, 175);
          }
        }
        .delete {
          align-items: center;
          display: flex;
        }
      }
    }
  }
}
.v_info {
  margin-top: 10px;
  width: 100%;
  line-height: 24px;
}
.v_message {
  max-width: 400px;
  word-break: break-all;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .v_title {
    font-size: 24px;
  }
  .v_time {
    font-size: 12px;
    color: rgb(175, 175, 175);
  }
}
.u_message {
  max-width: 260px;
  min-width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: nowrap;
  .u_frame {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .u_avatar {
      cursor: pointer;
    }
    .u_title {
      min-width: 100px;
      font-size: 20px;
      cursor: pointer;
    }
    .u_info {
      margin-bottom: 5px;
    }
    .u_title:hover {
      color: #63e2b7;
    }
  }
}
</style>
