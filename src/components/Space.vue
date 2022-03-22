<script setup>
import { reactive, ref } from "vue";
const d = reactive({
  uMessage: {
    avatar: "",
    title: "asdsaf",
    info: "sdjkngjhasdjkglkjsadjko",
  },
});
function handleBeforeLeave(tabName) {
  console.log(tabName);
  return true;
}
function handleUpdateValue(value) {
  console.log(value);
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
            :src="d.uMessage.avatar"
          />
        </div>
        <div class="u_frame" style="margin-left: 20px">
          <div class="u_title">{{ d.uMessage.title }}</div>
          <div class="u_info">{{ d.uMessage.info }}</div>
        </div>
      </div>
    </div>
    <div class="content">
      <n-tabs
        type="line"
        size="large"
        @before-leave="handleBeforeLeave"
        @update:value="handleUpdateValue"
      >
        <n-tab-pane :name="0" tab="主页"> </n-tab-pane>
        <n-tab-pane :name="1" tab="投稿"> </n-tab-pane>
        <n-tab-pane :name="2" tab="收藏"> </n-tab-pane>
      </n-tabs>
    </div>
  </div>
  <n-back-top :right="50" />
</template>

<style lang="less" scoped>
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
      width: 200px;
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
  }
  .content {
    margin-top: 20px;
    padding: 20px 40px;
    box-shadow: 0 0 4px rgba(189, 189, 189, 0.5);
    overflow: hidden;
    border-radius: 5px;
  }
}
</style>