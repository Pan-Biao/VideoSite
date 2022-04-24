<script setup>
import { reactive, ref, onMounted, computed, inject, watch } from "vue";
import VuePictureCropper, { cropper } from "vue-picture-cropper/dist/esm";
import { useRouter, useRoute } from "vue-router";
import store from "../store";
import { useUpdateUser, useChangePassword } from "../api/user";

//数据
const d = reactive({
  router: useRouter(),
  route: useRoute(),
  uMessage: {
    info: "",
    nickname: "",
    head_portrait: "",
  },
  showModal: false,
  upimg: "",
  showimg: "",
  fileImg: null,
  uid: 0,
  progress: 0,
  isPassword: false,
});
const upimgRef = ref(null);
const form = reactive({
  info: "",
  nickname: "",
});
const formPassword = reactive({
  oldPassword: "",
  newPassword: "",
});
//监听password变化
d.isPassword = d.route.meta["password"];
watch(
  () => {
    return d.route.meta["password"];
  },
  (value) => {
    reloadView();
  }
);
//监听id变化
d.uid = d.route.params["uid"];
watch(
  () => {
    return d.route.params["uid"];
  },
  (value) => {
    if (!value) {
      resetForm();
    }
  }
);
//加载完成时
onMounted(() => {
  if (store.getters.userData.id) {
    d.uMessage = store.getters.userData;
    form.info = d.uMessage.info;
    form.nickname = d.uMessage.nickname;
    d.showimg = d.uMessage.head_portrait
      ? store.state.fileApi + d.uMessage.head_portrait
      : "";
  }
});
//获取方法
const getMe = inject("getMe");
const reloadView = inject("reloadView");
//点击选择图片
function uploadImg() {
  upimgRef.value.value = "";
  upimgRef.value.click();
}
// 判断浏览器是否支持 createObjectURL api
function getObjectURL(file) {
  var url = null;
  if (window.createObjectURL != undefined) {
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}
//图片切换
function onchangeImg({ target: data }) {
  let file = data.files[0];
  d.upimg = getObjectURL(file);
  d.showModal = true;
}
//重置裁剪
function reset() {
  cropper.reset();
}
//裁剪图片处理
async function getResult() {
  // console.log(cropper)
  // 获取生成的base64图片地址
  const base64 = cropper.getDataURL();
  // 获取生成的blob文件信息
  const blob = await cropper.getBlob();
  // 获取生成的file文件信息
  // const file = await cropper.getFile();
  //把blob转换成file文件并设定type
  const file = new File([blob], "upload.png", {
    type: "image/png",
    lastModified: Date.now(),
  });
  console.log({ base64, blob, file });
  // 把base64赋给结果展示区
  // d.showimg = base64;
  d.fileImg = file;
  try {
    d.showimg = getObjectURL(blob);
  } catch (e) {
    d.showimg = "";
  }
  // 隐藏裁切弹窗
  d.showModal = false;
}
//上传
function contributionConfirm() {
  if (d.isPassword) {
    useChangePassword({
      old_password: formPassword.oldPassword,
      new_password: formPassword.newPassword,
    }).then((res) => {
      if (res) {
        window.$message.success("修改成功,请重新登录");
        d.router.push({
          name: "Login",
        });
      }
    });
  } else {
    if (form.nickname == "") {
      window.$message.error(res.msg);
    }
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("img", d.fileImg);

    updateUser(formData);
  }
}
//修改用户信息
function updateUser(formData) {
  useUpdateUser(formData, (e) => {
    let rate = Math.floor((e.loaded / e.total) * 100);
    d.progress = rate;
  })
    .then((res) => {
      if (res) {
        window.$message.success("修改成功，刷新页面即可");
        store.dispatch("setUser", res);
      }
    })
    .catch((err) => {
      d.progress = 0;
    });
}
//重置
function resetForm() {
  formPassword.oldPassword = "";
  formPassword.newPassword = "";

  d.uMessage = store.getters.userData;
  form.info = d.uMessage.info;
  form.nickname = d.uMessage.nickname;
  d.showimg = d.uMessage.head_portrait
    ? store.state.fileApi + d.uMessage.head_portrait
    : "";
}
</script>

<template>
  <div class="contribution">
    <div class="content">
      <div class="title">{{d.isPassword ? "在这里进行一个密码的修改" : "在这里进行一个用户的修改"}}</div>
      <n-form
        v-if="d.isPassword"
        :model="formPassword"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
        :style="{
          maxWidth: '840px',
          width: '640px',
        }"
      >
        <n-form-item label="旧密码" path="oldPassword">
          <n-input
            maxlength="16"
            minlength="6"
            show-count
            clearable
            v-model:value="formPassword.oldPassword"
            placeholder="旧密码"
          />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input
            maxlength="16"
            minlength="6"
            show-count
            clearable
            v-model:value="formPassword.newPassword"
            placeholder="新密码"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button size="large" style="margin-right: 20px" @click="resetForm">
            重置
          </n-button>
          <n-button size="large" type="primary" @click="contributionConfirm">
            修改
          </n-button>
        </div>
      </n-form>
      <n-form
        v-else
        :model="form"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
        :style="{
          maxWidth: '840px',
          width: '640px',
        }"
      >
        <n-form-item label="昵称" path="title">
          <n-input
            maxlength="8"
            minlength="2"
            show-count
            clearable
            v-model:value="form.nickname"
            placeholder="昵称"
          />
        </n-form-item>
        <n-form-item label="简介" path="info">
          <n-input
            maxlength="40"
            show-count
            clearable
            v-model:value="form.info"
            placeholder="简介"
            type="textarea"
            :autosize="{
              minRows: 3,
            }"
          />
        </n-form-item>
        <n-form-item label="头像">
          <div style="flex-direction: column">
            <div class="img" @click="uploadImg">
              <img :src="d.showimg" alt="" />
              <div class="text">点击上传图片</div>
            </div>
            <div v-show="d.progress" class="progress">
              <div class="line" :style="{ width: d.progress * 2 + 'px' }"></div>
              <div class="text">
                {{ d.progress == 100 ? "传输完成" : d.progress + "%" }}
              </div>
            </div>
          </div>

          <n-modal
            v-model:show="d.showModal"
            :mask-closable="false"
            class="custom-card"
          >
            <!-- 图片裁切插件 -->
            <n-el tag="div" class="cutting">
              <VuePictureCropper
                :boxStyle="{
                  width: '600px',
                  height: '100%',
                  backgroundColor: '#f8f8f8',
                  margin: 'auto',
                }"
                :img="d.upimg"
                :options="{
                  viewMode: 1,
                  dragMode: 'crop',
                  aspectRatio: 1,
                }"
                :presetMode="{
                  mode: 'round',
                  width: 300,
                  height: 300,
                }"
              />
              <!-- 图片裁切插件 -->
              <div class="buttonList">
                <n-button @click="reset">重置</n-button>
                <n-button @click="getResult">裁剪</n-button>
              </div>
            </n-el>
          </n-modal>

          <input
            v-show="false"
            @change="onchangeImg"
            ref="upimgRef"
            type="file"
            name="img"
            accept=".img,.png"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button size="large" style="margin-right: 20px" @click="resetForm">
            重置
          </n-button>
          <n-button size="large" type="primary" @click="contributionConfirm">
            修改
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cutting {
  position: relative;
  padding: 20px;
  color: var(--primary-color);
  background-color: var(--card-color);
  transition: 0.3s var(--cubic-bezier-ease-in-out);
  .close:hover {
    color: var(--close-color-hover);
  }
  .buttonList {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
}
.contribution {
  margin: auto;
  max-width: 1040px;
  min-width: 840px;
  .content {
    margin-top: 40px;
    padding: 40px;
    box-shadow: 0 0 4px rgba(189, 189, 189, 0.5);
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-items: center;
    align-content: center;
    align-items: center;
    justify-content: center;
    .v_upload {
      width: 100%;
    }
    .title {
      font-size: 24px;
      line-height: 30px;
      padding-bottom: 40px;
    }
    .img {
      border-radius: 5px;
      border: 1px solid rgba(129, 129, 129, 0.5);
      width: 200px;
      height: 220px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      .text {
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
      img {
        width: 100%;
        height: 200px;
      }
      img[src=""],
      img:not([src]) {
        opacity: 0;
      }
    }
    .progress {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      border-radius: 3px;
      overflow: hidden;
      align-items: center;
      .line {
        background-color: rgb(110, 110, 110);
        height: 10px;
        width: 0;
      }
      .text {
        height: 20px;
        line-height: 20px;
        font-size: 10px;
      }
    }
  }
}
</style>
