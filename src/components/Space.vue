<script setup>
import { reactive, ref, onMounted, inject, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGetUserInformation } from "../api/user";
import { time, formatNumber } from "../tool";
import store from "../store";
import {
  useGetFollower,
  useGetFans,
  useCreateFollow,
  useDeleteFollow,
  useIsFollow,
} from "../api/follow";
import {
  useCreateFavorite,
  useGetListFavorite,
  useDeleteFavorite,
} from "../api/favorite";
import {
  useCreateCollection,
  useDeleteCollection,
  useIsCollection,
  useGetListCollection,
} from "../api/collection";
import { useGetVideoList } from "../api/video";
import { FolderOpenRegular, Times } from "@vicons/fa";

const d = reactive({
  uid: 0,
  route: useRoute(),
  router: useRouter(),
  isFollow: false,
  folderShow: false,
  showModal: false,
  folderName: "",
  fName: "",
  tabsValue: 0,
  uMessage: {
    head_portrait: "",
    id: 0,
    info: "",
    nickname: "",
    status: "active",
  },
  followsAndFans: [
    {
      id: 0,
      created_at: 0,
      isFollow: false,
      user: {
        head_portrait: "",
        id: 0,
        info: "",
        nickname: "哇啊哈哈哈",
        status: "active",
      },
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
  contributionList: [
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
  favorites: [
    {
      id: 0,
      name: "未分类",
    },
  ],
  collections: [],
});
//监听uid变化
d.uid = d.route.params["uid"];
watch(
  () => {
    return d.route.params["uid"];
  },
  (value) => {
    if (value) {
      d.uid = +value;
      d.tabsValue = 0;
      init();
    }
  }
);
//运行时
onMounted(() => {
  // DOM 元素将在初始渲染后分配给 ref
  init();
});
function init() {
  getUserData(d.uid);
  getFollows(d.uid);
  findFollow(d.uid);
  getVList(d.uid);
}
//获取方法
const getMe = inject("getMe");
//切换
function leftTabs(value) {
  switch (+value) {
    case 1:
      getContributionList(d.uid);
      break;
    case 2:
      getListFavorite();
      break;
    default:
      getVList(d.uid);
  }
}
function rightTabs(value) {
  if (value) {
    getFans(d.uid);
  } else {
    getFollows(d.uid);
  }
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
//视频跳转
// function jumpVideo(id) {
//   d.router.push({
//     name: "Video",
//     params: {
//       vid: id,
//     },
//   });
// }
//跳转视频页
function jumpVideo(id) {
  let router = d.router.resolve({
    name: "Video",
    params: {
      vid: id,
    },
  });
  window.open(router.href, "_blank");
}
//查询关注
function findFollow(id) {
  if (store.getters.userData.id) {
    useIsFollow(id).then((res) => {
      d.isFollow = res;
    });
  }
}
//不关注
function follow(id, index) {
  if (index != null) {
    if (d.followsAndFans[index].isFollow) {
      useDeleteFollow(id).then((res) => {
        if (res) d.followsAndFans[index].isFollow = false;
      });
      return;
    } else {
      useCreateFollow(id).then((res) => {
        if (res) d.followsAndFans[index].isFollow = true;
      });
      return;
    }
  } else {
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
}
//获取用户信息
function getUserData(id) {
  useGetUserInformation(id).then((res) => {
    if (res) {
      d.uMessage = res;
    }
  });
}
//获取关注列表
function getFollows(id) {
  useGetFollower(id).then((res) => {
    if (res) {
      for (const item of res) {
        item.isFollow = true;
      }
      d.followsAndFans = res;
    }
  });
}
//获取粉丝列表
function getFans(id) {
  useGetFans(id).then((res) => {
    if (res) {
      d.followsAndFans = res;
    }
  });
}
//获取推荐视频列表
function getVList(id) {
  useGetVideoList({
    number: 6,
    page_number: 1,
    uid: +id,
    sorts: [
      {
        field: "like_number",
        sort: "desc",
      },
    ],
  }).then((res) => {
    if (res) {
      d.vlist = res.videos;
    } else {
      d.vlist = [];
    }
  });
}
//获取所有视频列表
function getContributionList(id) {
  useGetVideoList({
    number: 0,
    page_number: 1,
    uid: +id,
    sorts: [
      {
        field: "created_at",
        sort: "desc",
      },
    ],
  }).then((res) => {
    if (res) {
      d.contributionList = res.videos;
    } else {
      d.contributionList = [];
    }
  });
}
//获取收藏视频列表
function getCollections(id) {
  useGetListCollection(id).then((res) => {
    if (res) {
      d.collections = res;
    } else {
      d.collections = [];
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
//选中收藏夹
function clickFolder(f) {
  d.folderShow = !d.folderShow;
  if (d.folderShow) {
    d.fName = f.name;
    getCollections(f.id);
  } else {
    d.fName = "";
    d.collections = [];
  }
}
//新建收藏夹
function addFolder() {
  d.showModal = true;
}
//删除收藏夹
function deleteFolder(id) {
  useDeleteFavorite(id).then((res) => {
    if (res) {
      getListFavorite();
    }
  });
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
//关闭模态框
function closeModal() {
  d.showModal = false;
}
</script>

<template>
  <div class="space">
    <div class="top">
      <div class="u_message">
        <div class="u_frame">
          <n-avatar
            class="u_avatar"
            :size="48"
            round
            :src="
              d.uMessage.head_portrait
                ? store.state.fileApi + d.uMessage.head_portrait
                : ''
            "
          />
        </div>
        <div class="u_frame" style="margin-left: 20px; flex: 1">
          <div class="u_title">
            <div class="name">{{ d.uMessage.nickname }}</div>
            <span class="status">{{
              d.uMessage.status == "active" ? "" : "该用户已被封禁"
            }}</span>
          </div>
          <div class="u_info">
            <n-ellipsis>
              {{ d.uMessage.info }}
            </n-ellipsis>
          </div>
        </div>
        <template v-if="store.getters.userData.id">
          <n-button
            v-if="store.getters.userData.id != d.uid"
            type="info"
            size="tiny"
            ghost
            @click="follow(d.uid)"
          >
            {{ d.isFollow ? "取消关注" : "关注" }}
          </n-button>
        </template>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <n-tabs type="line" size="large" @update:value="leftTabs">
          <!-- 主页 -->
          <n-tab-pane :name="0" tab="主页">
            <div class="title">视频推荐</div>
            <div class="video_list">
              <div class="video" v-for="item in d.vlist" :key="item.id">
                <div class="cover" @click="jumpVideo(item.id)">
                  <img
                    class="v_img"
                    :src="item.cover ? store.state.fileApi + item.cover : ''"
                  />
                </div>
                <div class="v_box">
                  <div @click="jumpVideo(item.id)" class="v_title">
                    {{ item.title }}
                  </div>
                  <div class="v_info">
                    <n-ellipsis :tooltip="false">{{ item.info }}</n-ellipsis>
                  </div>
                  <div class="message">
                    {{
                      `播放量&nbsp;${formatNumber(item.play_number)}
                      &nbsp;&nbsp;点赞量&nbsp;${formatNumber(item.like_number)}
                      &nbsp;&nbsp;${time(item.created_at)}`
                    }}
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
          <!-- 投稿 -->
          <n-tab-pane :name="1" tab="投稿">
            <div class="title">投稿列表</div>
            <div class="video_list">
              <div
                class="video"
                v-for="item in d.contributionList"
                :key="item.id"
              >
                <div class="cover" @click="jumpVideo(item.id)">
                  <img
                    class="v_img"
                    :src="item.cover ? store.state.fileApi + item.cover : ''"
                  />
                </div>
                <div class="v_box">
                  <div @click="jumpVideo(item.id)" class="v_title">
                    {{ item.title }}
                  </div>
                  <div class="v_info">
                    <n-ellipsis :tooltip="false"> {{ item.info }}</n-ellipsis>
                  </div>
                  <div class="message">
                    {{
                      `播放量&nbsp;${formatNumber(item.play_number)}
                      &nbsp;&nbsp;点赞量&nbsp;${formatNumber(item.like_number)}
                      &nbsp;&nbsp;${time(item.created_at)}`
                    }}
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
          <!-- 收藏 -->
          <n-tab-pane
            v-if="d.uid == store.getters.userData.id"
            :name="2"
            tab="收藏"
          >
            <div class="menu">
              <div class="title">收藏列表</div>
              <n-button @click="addFolder">新建收藏夹</n-button>
            </div>
            <!-- 收藏夹列表 -->
            <div class="favorites">
              <div
                @click.stop="clickFolder(item)"
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
                <div class="f_box">
                  <n-icon size="30" :component="FolderOpenRegular" />
                  <div class="text">
                    <n-ellipsis style="max-width: 80px">
                      {{ item.name }}
                    </n-ellipsis>
                  </div>
                </div>
              </div>
            </div>
            <!-- 收藏夹视频列表 -->
            <div v-show="d.fName != ''" class="fname">{{ d.fName }}</div>
            <div v-show="d.folderShow" class="video_list folder_video">
              {{ d.collections.length == 0 ? "无内容" : "" }}
              <div
                class="video"
                v-for="{ video: item } in d.collections"
                :key="item.id"
              >
                <div class="cover" @click="jumpVideo(item.id)">
                  <img
                    class="v_img"
                    :src="item.cover ? store.state.fileApi + item.cover : ''"
                  />
                </div>
                <div class="v_box">
                  <div @click="jumpVideo(item.id)" class="v_title">
                    {{ item.title }}
                  </div>
                  <div class="v_info">
                    <n-ellipsis :tooltip="false"> {{ item.info }}</n-ellipsis>
                  </div>
                  <div class="message">
                    {{
                      `播放量&nbsp;${formatNumber(item.play_number)}&nbsp;&nbsp;
                      点赞量&nbsp;${formatNumber(item.like_number)}&nbsp;&nbsp;
                      ${time(item.created_at)}`
                    }}
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
      <div class="right">
        <n-tabs
          justify-content="space-evenly"
          type="line"
          size="large"
          v-model:value="d.tabsValue"
          @update:value="rightTabs"
        >
          <n-tab-pane :name="0" tab="关注">
            <div
              class="list"
              v-for="(item, index) in d.followsAndFans"
              :key="item.id"
            >
              <n-avatar
                class="u_avatar"
                :size="38"
                round
                @click="jumpUp(item.user.id)"
                :src="
                  d.uMessage.head_portrait
                    ? store.state.fileApi + item.user.head_portrait
                    : ''
                "
              />
              <div class="message">
                <div class="nickname" @click="jumpUp(item.user.id)">
                  {{ item.user.nickname }}
                </div>
                <div class="info">
                  <n-ellipsis :tooltip="false" style="max-width: 150px">
                    {{ item.user.info }}</n-ellipsis
                  >
                </div>
              </div>
              <template v-if="store.getters.userData.id == d.uid">
                <div class="follow" @click="follow(item.user.id, index)">
                  {{ item.isFollow ? "取消关注" : "关注" }}
                </div>
              </template>
            </div>
          </n-tab-pane>
          <n-tab-pane :name="1" tab="粉丝">
            <div
              class="list"
              v-for="(item, index) in d.followsAndFans"
              :key="item.id"
            >
              <n-avatar
                class="u_avatar"
                :size="38"
                round
                @click="jumpUp(item.user.id)"
                :src="
                  d.uMessage.head_portrait
                    ? store.state.fileApi + item.user.head_portrait
                    : ''
                "
              />
              <div class="message">
                <div class="nickname" @click="jumpUp(item.user.id)">
                  {{ item.user.nickname }}
                </div>
                <div class="info">
                  <n-ellipsis :tooltip="false" style="max-width: 200px">
                    {{ item.user.info }}</n-ellipsis
                  >
                </div>
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
        <n-button style="margin-right: 20px" @click="confirmFolderName"
          >确认</n-button
        >
        <n-button @click="closeModal">取消</n-button>
      </div>
    </n-el>
  </n-modal>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
.box {
  position: relative;
  width: 300px;
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
.space {
  margin: auto;
  max-width: 1240px;
  min-width: 840px;
  .top {
    position: relative;
    top: -10px;
    box-shadow: 0 0 4px rgba(189, 189, 189, 0.5);
    padding: 40px 40px;
    padding-top: 60px;
    overflow: hidden;
    border-radius: 5px;
    .u_message {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow: hidden;
      .u_frame {
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        img[src=""],
        img:not([src]) {
          opacity: 0;
        }
        .u_avatar {
          cursor: pointer;
        }
        .u_title {
          font-size: 20px;
          display: flex;
          flex-direction: row;
          // justify-content: center;
          align-items: baseline;
          .name {
            cursor: pointer;
            margin-right: 10px;
          }
          .name:hover {
            color: #63e2b7;
          }
          .status {
            font-size: 10px;
            color: #ff6a00;
            cursor: default;
          }
        }
        .u_info {
          max-width: 600px;
        }
      }
    }
  }
  .content {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .left {
      flex: 1;
      margin-right: 20px;
      box-shadow: 0 0 4px rgb(189, 189, 189, 50%);
      border-radius: 5px;
      padding: 20px;
      height: 100%;
      .title {
        font-size: 20px;
        font-weight: 600;
        color: #707070;
        margin-bottom: 20px;
      }
      .menu {
        display: flex;
        flex-direction: row;
        .title {
          margin-right: 20px;
        }
      }
      .video_list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        .video {
          width: 100%;
          height: 80px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          .cover {
            height: 100%;
            margin-right: 20px;
            border-radius: 3px;
            overflow: hidden;
            cursor: pointer;
            .v_img {
              height: 100%;
              object-fit: cover;
              vertical-align: bottom;
            }
          }
          .v_box {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .v_title {
              font-size: 17px;
              font-weight: 600;
              cursor: pointer;
            }
            .v_title:hover {
              color: #63e2b7;
            }
            .v_info {
              width: 100%;
              font-size: 12px;
              color: #8f8f8f;
              .n-ellipsis {
                max-width: 600px;
              }
            }
            .message {
              font-size: 12px;
              color: #8f8f8f;
            }
          }
        }
        .video:last-child {
          margin-bottom: 0;
        }
      }
      .folder_video {
        background-color: var(--n-border-color);
      }
      .favorites {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
        margin-bottom: 20px;
        .favorite {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
          width: 100px;
          position: relative;
          .f_box {
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
      .fname {
        font-size: 18px;
        font-weight: 600;
        color: #707070;
        margin-bottom: 10px;
      }
    }
    .right {
      width: 260px;
      box-shadow: 0 0 4px rgb(189, 189, 189, 50%);
      border-radius: 5px;
      padding: 20px;
      height: 100%;
      .list {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20px;
        .u_avatar {
          margin-right: 10px;
          cursor: pointer;
        }
        .message {
          flex: 1;
          display: flex;
          flex-direction: column;
          .nickname {
            cursor: pointer;
          }
          .nickname:hover {
            color: #63e2b7;
          }
          .info {
            color: #8f8f8f;
            font-size: 10px;
          }
        }
        .follow {
          width: 50px;
          text-align: center;
          font-size: 10px;
          cursor: pointer;
        }
        .follow:hover {
          color: rgb(255, 83, 83);
        }
      }
      .list:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
