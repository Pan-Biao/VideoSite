<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import DPlayer from "dplayer";
import store from "../store";

let dplayer = ref(null);
const d = reactive({
  route: useRoute(),
  dp: null,
  vid: null,
  vMessage: {
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
});

function initPlay() {
  d.dp = new DPlayer({
    container: dplayer.value,
    playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
    video: {
      url: `${store.state.videoApi}${d.vid}.mp4`,
    },
    danmaku: {
      //   api:"https://api.prprpr.me/dplayer/",
      addition: [" https://api.prprpr.me/dplayer/v3/bilibili?aid=[aid]"],
    },
  });
}

onMounted(() => {
  // DOM 元素将在初始渲染后分配给 ref
  const vid = d.route.params["vid"];
  d.vid = vid;
  window.$http.get(`/api/v1/video/${vid}`).then(({ data }) => {
    if (data.code == 200) {
      d.vMessage = data.data;
      d.uMessage = data.data.user;
    }
  });
  initPlay();
});
</script>
<template>
  <div class="frame">
    <div class="flex">
      <div class="v_message">
        <div class="v_title">{{ d.vMessage.title }}</div>
        <div class="v_time">{{ d.vMessage.created_at }}</div>
      </div>
      <div class="u_message">
        <div class="u_frame">
          <n-avatar
            class="u_avatar"
            :size="48"
            round
            :src="d.uMessage.head_portrait"
          />
        </div>
        <div class="u_frame" style="margin-left: 20px">
          <div class="u_title">{{ d.uMessage.nickname }}</div>
          <div class="u_info">{{ d.uMessage.info }}</div>
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
      <div class="comment_input">
        <n-input
          type="textarea"
          :autosize="{
            minRows: 2,
          }"
          maxlength="100"
          clearable
          show-count
        />
        <div class="send">发表评论</div>
      </div>
      <div class="comment_list">
        <n-tabs
          type="line"
          size="small"
          @before-leave="handleBeforeLeave"
          @update:value="handleUpdateValue"
        >
          <n-tab-pane :name="0" tab="按时间">
            <div class="comment">
              <div class="avatar">
                <n-avatar :size="48" round :src="d.uMessage.head_portrait" />
              </div>

              <div class="comment_text">
                <div class="name">UP猪</div>
                <div class="text">视频真好看</div>
                <div class="time">2014-5-6</div>
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane :name="1" tab="按热度">
            <div class="comment"></div>
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
  .v_title {
    font-size: 24px;
  }
  .v_time {
    font-size: 12px;
    color: rgb(175, 175, 175);
  }
}
.u_message {
  width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: nowrap;
  overflow: hidden;
  .u_frame {
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .u_avatar {
      cursor: pointer;
    }
    .u_title {
      font-size: 20px;
      cursor: pointer;
    }
    .u_info {
      cursor: pointer;
    }
    .u_title:hover,
    .u_info:hover {
      color: #63e2b7;
    }
  }
}
</style>
