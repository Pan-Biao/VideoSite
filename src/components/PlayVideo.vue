<script setup>
import { reactive, ref, onMounted, nextTick, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";
import DPlayer from "dplayer";
import { time, formatNumber } from "../tool";
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
import {
  useCreateCollection,
  useDeleteCollection,
  useIsCollection,
} from "../api/collection";
import {
  useCreateFavorite,
  useGetListFavorite,
  useDeleteFavorite,
} from "../api/favorite";
import {
  UserCircle,
  TrashAlt,
  ThumbsUp,
  Star,
  FolderOpenRegular,
  Times,
} from "@vicons/fa";
import {
  useGetListComment,
  useCreateComment,
  useDeleteComment,
} from "../api/comment";
import { Table } from "vxe-table";

let dplayer = $ref(null);
const d = reactive({
  route: useRoute(),
  router: useRouter(),
  dp: null,
  danmu: null,
  vid: 0,
  commentValue: "",
  isFollow: false,
  isLike: false,
  isCollection: false,
  showModal: false,
  popselectShow: false,
  folderName: "",
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
    like_number: 0,
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
      like: false,
      id: 0,
      like_number: 0,
      user: {
        head_portrait: "",
        id: 0,
        nickname: "",
      },
    },
  ],
  favorites: [],
});
//获取方法
const getMe = inject("getMe");
//运行时
onMounted(() => {
  // DOM 元素将在初始渲染后分配给 ref
  const vid = d.route.params["vid"];
  d.vid = +vid;
  getVideo(d.vid).then(() => {
    if (store.getters.userData.id) {
      findFollow(d.uMessage.id);
      findLikeVideo(d.vMessage.id);
      findCollection(d.vMessage.id);
      getListFavorite();
    }
    getCommentList();
  });
});
//获取视频
async function getVideo(vid) {
  return useGetVideo(vid).then((res) => {
    if (res) {
      d.vMessage = res;
      initPlay();
      d.uMessage = res.user;
    }
  });
}
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
    container: dplayer,
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
//关闭收藏框
function closePopselect() {
  d.popselectShow = false;
}
//查询是否收藏
function findCollection(id) {
  if (store.getters.userData.id) {
    useIsCollection(id).then((res) => {
      d.isCollection = res;
    });
  }
}
//收藏视频
function videoCollection(id) {
  if (d.isCollection) {
    useDeleteCollection(id).then((res) => {
      if (res) {
        d.isCollection = false;
      }
    });
  } else {
    if (store.getters.userData.id) {
      d.popselectShow = true;
      getListFavorite();
    }
  }
}
//选择收藏夹
function clickFolder(id) {
  let data = {
    cid: d.vMessage.id,
    fid: 0,
  };
  if (id != 0) {
    data.fid = id;
  }
  useCreateCollection(data).then((res) => {
    if (res) {
      d.isCollection = true;
      d.popselectShow = false;
    }
  });
}
//查询收藏夹列表
function getListFavorite() {
  if (store.getters.userData.id) {
    useGetListFavorite().then((res) => {
      if (res) {
        d.favorites = [
          {
            id: 0,
            name: "未分类",
          },
        ].concat(res);
      }
    });
  }
}
//新建收藏夹
function addFolder() {
  d.showModal = true;
}
//确认新建
function confirmFolderName() {
  useCreateFavorite({
    name: d.folderName,
  }).then((res) => {
    if (res) {
      getListFavorite();
      d.showModal = false;
    }
  });
}
//删除收藏夹
function deleteFolder(id) {
  useDeleteFavorite(id).then((res) => {
    if (res) {
      getListFavorite();
    }
  });
}
//获取评论列表
function getCommentList(type) {
  let data = {
    vid: d.vid,
    sorts: [],
  };
  if (type) {
    data.sorts = [
      {
        field: "like_number",
        sort: "desc",
      },
    ];
  } else {
    data.sorts = [
      {
        field: "created_at",
        sort: "desc",
      },
    ];
  }
  useGetListComment(data).then((res) => {
    if (res.length > 0) {
      d.comments = res;
      findLikeComment();
    } else {
      d.comments = [];
    }
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
function handleUpdateValue(value) {
  console.log(value);
  getCommentList(value);
}
//发表评论
function addComment(value) {
  if (value.length == 0) {
    window.$message.info("评论不可为空");
    return;
  }
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
  if (d.isFollow) {
    useDeleteFollow(id).then((res) => {
      if (res) d.isFollow = false;
    });
  } else {
    useCreateFollow(id).then((res) => {
      if (res) d.isFollow = true;
    });
  }
}
//查询关注
function findFollow(id) {
  if (store.getters.userData.id) {
    useIsFollow(id).then((res) => {
      d.isFollow = res;
    });
  }
}
//查询点赞视频
function findLikeVideo(id) {
  if (store.getters.userData.id) {
    useIsLikeVideo(id).then((res) => {
      d.isLike = res;
    });
  }
}
//点赞视频
function likeVideo(id) {
  if (d.isLike) {
    useUnLikeVideo(id).then((res) => {
      if (res) {
        d.isLike = false;
        d.vMessage.like_number = d.vMessage.like_number - 1;
      }
    });
  } else {
    useLikeVideo(id).then((res) => {
      if (res) {
        d.isLike = true;
        d.vMessage.like_number = d.vMessage.like_number + 1;
      }
    });
  }
}
//查询点赞评论
function findLikeComment(type, id) {
  if (store.getters.userData.id) {
    useIsLikeComment().then((res) => {
      if (res) {
        for (const comment of d.comments) {
          comment.like = false;
        }
        for (const comment of d.comments) {
          if (type == "reduce" && id == comment.id) {
            comment.like_number = comment.like_number - 1;
          }
          for (const item of res) {
            if (item.cid == comment.id) {
              if (type == "add") comment.like_number = comment.like_number + 1;
              comment.like = true;
            }
          }
        }
      }
    });
  }
}
//点赞评论
function likeComment(id) {
  if (store.getters.userData.id) {
    useLikeComment(id).then((res) => {
      if (res) {
        findLikeComment("add");
      }
    });
  }
}
//不点赞评论
function unLikeComment(id) {
  useUnLikeComment(id).then((res) => {
    if (res) findLikeComment("reduce", id);
  });
}
</script>
<template>
  <div class="frame">
    <!-- 视频标题、用户信息 -->
    <div class="flex">
      <div class="v_message">
        <div class="v_title">{{ d.vMessage.title }}</div>
        <div class="v_time">
          {{
            `播放量&nbsp;${formatNumber(d.vMessage.play_number)}&nbsp;&nbsp;
            点赞量&nbsp;${formatNumber(d.vMessage.like_number)}&nbsp;&nbsp;
            评论&nbsp;${d.comments.length}&nbsp;&nbsp;
            ${time(d.vMessage.created_at)}`
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
          <div class="u_info">
            <n-ellipsis :tooltip="false">
              {{ d.uMessage.info }}
            </n-ellipsis>
          </div>
          <!-- 关注 -->
          <template v-if="store.getters.userData.id != d.uMessage.id">
            <n-button
              v-show="store.getters.userData.id"
              type="info"
              size="tiny"
              ghost
              @click="follow(d.uMessage.id)"
            >
              {{ d.isFollow ? "取消关注" : "关注" }}
            </n-button>
          </template>
        </div>
      </div>
    </div>
    <!-- 视频 -->
    <div ref="dplayer" id="dplayer"></div>
    <!-- 点赞收藏 -->
    <div v-if="store.getters.userData.id" class="v_menu">
      <!-- 点赞 -->
      <div class="v_menu_item">
        <n-icon
          @click="likeVideo(d.vMessage.id)"
          :class="d.isLike ? 'islike' : ''"
          :component="ThumbsUp"
        />
      </div>
      <!-- 收藏 -->
      <div class="v_menu_item">
        <n-popselect
          :options="[]"
          :show="d.popselectShow"
          placement="right-end"
          @click.stop
        >
          <div class="collection">
            <n-icon
              @click="videoCollection(d.vMessage.id)"
              size="30"
              :class="d.isCollection ? 'islike' : ''"
              :component="Star"
            />
          </div>
          <template #empty>
            <div class="favorites">
              <div
                @click.stop="clickFolder(item.id)"
                class="favorite"
                v-for="item in d.favorites"
                :key="item.id"
              >
                <div
                  v-if="item.id"
                  @click.stop="deleteFolder(item.id)"
                  class="delete"
                >
                  <n-icon :component="Times" />
                </div>
                <div class="box">
                  <n-icon size="30" :component="FolderOpenRegular" />
                  <div class="text">
                    <n-ellipsis style="max-width: 80px">{{
                      item.name
                    }}</n-ellipsis>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #action>
            <div class="buttonList">
              <n-button @click="addFolder">新建收藏夹</n-button>
              <n-button @click="closePopselect">取消</n-button>
            </div>
          </template>
        </n-popselect>
      </div>
    </div>
    <!-- 视频简介 -->
    <div class="v_info">
      <n-ellipsis expand-trigger="click" :line-clamp="2" :tooltip="false">
        {{ d.vMessage.info }}
      </n-ellipsis>
    </div>
    <!-- 评论区 -->
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
        <n-tabs type="line" size="small" @update:value="handleUpdateValue">
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
                  <span>{{ time(item.created_at) }}</span>
                  <n-icon
                    class="like_comment"
                    v-show="store.getters.userData.id && item.like"
                    @click="unLikeComment(item.id)"
                    color="rgb(255,75,75)"
                    :component="ThumbsUp"
                  />
                  <n-icon
                    class="like_comment"
                    v-show="!item.like"
                    @click="likeComment(item.id)"
                    :component="ThumbsUp"
                  />
                  <span>{{ item.like_number }}</span>
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
                  <span>{{ time(item.created_at) }}</span>
                  <n-icon
                    class="like_comment"
                    v-show="store.getters.userData.id && item.like"
                    @click="unLikeComment(item.id)"
                    color="rgb(255,75,75)"
                    :component="ThumbsUp"
                  />
                  <n-icon
                    class="like_comment"
                    v-show="!item.like"
                    @click="likeComment(item.id)"
                    :component="ThumbsUp"
                  />
                  <span>{{ item.like_number }}</span>
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
  <!-- 新建收藏夹 -->
  <n-modal v-model:show="d.showModal" class="custom-card">
    <n-el tag="div" class="box">
      <n-input
        v-model:value="d.folderName"
        type="text"
        placeholder="收藏夹名称"
      />
      <div class="buttonList">
        <n-button @click="confirmFolderName">确认</n-button>
      </div>
    </n-el>
  </n-modal>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
textarea {
  word-break: keep-all;
}
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
        margin-top: 10px;
        padding-bottom: 10px;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        border-bottom: 1px solid var(--n-tab-border-color);
        .n-avatar {
          cursor: pointer;
          margin-top: 10px;
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
            line-height: 24px;
            margin: 10px 0;
          }
          .time {
            font-size: 12px;
            color: #666666;
            display: flex;
            flex-direction: row;
            align-items: center;
            span {
              margin-right: 10px;
              width: 80px;
            }
            .like_comment {
              cursor: pointer;
              font-size: 14px;
              margin-right: 10px;
            }
            .like_comment:hover {
              color: #18a058;
            }
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
  margin: 0 5px;
  margin-top: 10px;
  line-height: 24px;
  .n-ellipsis {
    max-width: 100%;
    word-break: keep-all;
  }
}
.v_message {
  max-width: 800px;
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
.v_menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 10px;
  margin-top: 10px;
  .v_menu_item {
    height: 30px;
    font-size: 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #505050;
    margin-right: 40px;
    .collection {
      height: 30px;
    }
  }
  .islike {
    color: rgb(255, 75, 75);
  }
}
.favorites {
  max-width: 400px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  .favorite {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    width: 100px;
    position: relative;
    .box {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
    .delete {
      z-index: 90;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      height: 20px;
      font-size: 18px;
    }
  }
}
.box {
  position: relative;
  padding: 20px;
  color: var(--primary-color);
  background-color: var(--card-color);
  transition: 0.3s var(--cubic-bezier-ease-in-out);
  .buttonList {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: end;
  }
}
.buttonList {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.u_message {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: nowrap;
  .u_frame {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    .u_avatar {
      cursor: pointer;
    }
    .u_title {
      min-width: 150px;
      font-size: 17px;
      cursor: pointer;
    }
    .u_info {
      max-width: 180px;
      margin-bottom: 5px;
      font-size: 12px;
      color: rgb(175, 175, 175);
      .n-ellipsis {
        max-width: 100%;
      }
    }
    .u_title:hover {
      color: #63e2b7;
    }
  }
}

.test {
  width: 100px;
}
</style>
