<template>
  <div class="flex">
    <div class="div">
      <n-card hoverable>
        <div class="frame">
          <n-space justify="space-around" :size="40" vertical>
            <div class="title">{{ d.isLgoin ? "登录" : "注册" }}</div>
            <n-input
              v-show="!d.isLgoin"
              v-model:value="d.nickName"
              type="text"
              :maxlength="8"
              :minlength="2"
              placeholder="昵称"
              autofocus
            />
            <n-input
              v-model:value="d.userName"
              type="text"
              placeholder="账号"
              :maxlength="12"
              :minlength="6"
              autofocus
            />
            <n-input
              type="password"
              v-model:value="d.password"
              show-password-on="mousedown"
              placeholder="密码"
              :maxlength="16"
              :minlength="6"
            />
            <n-input
              v-show="!d.isLgoin"
              type="password"
              v-model:value="d.passwordConfirm"
              show-password-on="mousedown"
              placeholder="确认密码"
              :maxlength="16"
              :minlength="6"
            />
            <div class="w-full text-14px">
              <n-checkbox v-model:checked="d.checked"
                >我已经仔细阅读并接受</n-checkbox
              >
              <n-button :text="true" type="primary" @click="handleClickProtocol"
                >《用户协议》</n-button
              >
              <n-button :text="true" type="primary" @click="handleClickPolicy"
                >《隐私权政策》</n-button
              >
            </div>
            <n-space justify="space-around" size="large">
              <n-button @click="register" size="large">{{
                d.isLgoin ? "注册" : "登录"
              }}</n-button>
              <n-button @click="confirm" size="large" type="success">
                确认
              </n-button>
            </n-space>
          </n-space>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import message from "../tool/message-api.vue";
import store from "../store/index";

const d = reactive({
  isLgoin: true,
  checked: false,
  password: "",
  passwordConfirm: "",
  userName: "",
  nickName: "",
  router: useRouter(),
});

function handleClickProtocol() {
  console.log("《用户协议》");
}
function handleClickPolicy() {
  console.log("《隐私权政策》");
}
function register() {
  d.isLgoin = !d.isLgoin;
}
function confirm() {
  if (d.isLgoin) {
    window.$http
      .post(`/api/v1/user/login`, {
        user_name: d.userName,
        password: d.password,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code == 200) {
          window.localStorage.setItem("state", true);
          store.dispatch("setUser", data.data);
          d.router.push({
            name: "Home",
          });
        } else {
          window.$message.error(data.msg);
        }
      });
  } else {
    window.$http
      .post(`/api/v1/user/register`, {
        nickname: d.nickName,
        user_name: d.userName,
        password: d.password,
        password_confirm: d.passwordConfirm,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code == 200) {
          window.$message.error("注册成功");
          d.isLgoin = true;
        } else {
          window.$message.error(data.msg);
        }
      });
  }
}
</script>
<style lang="less" scoped>
.flex {
  width: 100vw;
  height: 100vh;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  .div {
    width: 500px;
  }
}
.frame {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  justify-items: center;
  align-items: center;
  margin: 20px 0;
  .title {
    font-size: 26px;
    text-align: center;
  }
}
</style>
