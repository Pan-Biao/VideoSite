<script setup>
import { reactive, ref, onMounted, computed, inject, watch } from "vue";
import VuePictureCropper, { cropper } from "vue-picture-cropper/dist/esm";
import { useRouter, useRoute } from "vue-router";
import store from "../store";
import { useCreateVideo, useUpdateVideo, useGetVideo } from "../api/video";
import { CancelToken } from "axios";
//数据
const d = reactive({
  modify: false,
  router: useRouter(),
  route: useRoute(),
  uMessage: {
    avatar: "",
    title: "",
    info: "",
  },
  generalOptions: [
    { label: "默认", value: 1 },
    { label: "动画", value: 2 },
  ],
  showModal: false,
  upimg: "",
  showimg: "",
  vname: "",
  fileImg: null,
  vid: null,
  progress: 0,
  isUpload: false,
  cancel: null,
});
const formRef = ref(null);
const videoRef = ref(null);
const showImgRef = ref(null);
const upimgRef = ref(null);
const form = reactive({
  title: "",
  info: "",
  said: 1,
});
//监听id变化
d.modify = d.route.meta["modify"];
d.vid = d.route.params["vid"];
watch(
  () => {
    return d.route.params["vid"];
  },
  (value) => {
    if (!value) {
      d.modify = d.route.meta["modify"];
      resetForm();
    }
  }
);
//加载完成时
onMounted(() => {
  if (d.modify) {
    if (store.getters.userData.id) {
      getVideo(d.vid);
    }
  }
});
//获取视频信息
function getVideo(id) {
  useGetVideo(id).then((res) => {
    if (res) {
      form.title = res.title;
      form.info = res.info;
      form.said = res.said;
      d.showimg = store.state.fileApi + res.cover;
    }
  });
}
//获取方法
const getMe = inject("getMe");
//
function uploadImg() {
  upimgRef.value.value = "";
  upimgRef.value.click();
}
function uploadVideo() {
  videoRef.value.click();
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
function onchangeImg({ target: data }) {
  let file = data.files[0];
  d.upimg = getObjectURL(file);
  d.showModal = true;
}
function reset() {
  cropper.reset();
}
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
function onchangeVideo({ target: data }) {
  let file = data.files[0];
  d.vname = file.name;
  if (file.type != "video/mp4") {
    window.$message.error("只能上传mp4格式的视频文件，请重新上传");
    return;
  }
}
//上传视频
function contributionConfirm() {
  const formData = new FormData();

  form.said = parseInt(form.said);
  Object.keys(form).forEach((key) => {
    formData.append(key, form[key]);
  });
  let file = videoRef.value.files[0];
  if (d.modify) {
    if (file) formData.append("video", file);
    if (d.fileImg) formData.append("vimg", d.fileImg);

    updateContribution(formData);
  } else {
    formData.append("video", file);
    formData.append("vimg", d.fileImg);

    addContribution(formData);
  }
  d.isUpload = true;
}
//新建投稿
function addContribution(formData) {
  useCreateVideo(
    formData,
    (e) => {
      let rate = Math.floor((e.loaded / e.total) * 100);
      d.progress = rate;
    },
    new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      d.cancel = c;
    })
  )
    .then((res) => {
      if (res) {
        window.$message.success(
          "视频创建成功，可点击查看视频按钮跳转到视频页查看"
        );
        d.vid = res.id;
        d.isUpload = false;
      } else {
        d.isUpload = false;
        window.$message.error(res.msg);
      }
    })
    .catch((err) => {
      d.progress = 0;
      d.isUpload = false;
    });
}
//修改投稿
function updateContribution(formData) {
  useUpdateVideo(
    d.vid,
    formData,
    (e) => {
      let rate = Math.floor((e.loaded / e.total) * 100);
      d.progress = rate;
    },
    new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      d.cancel = c;
    })
  )
    .then((res) => {
      if (res) {
        window.$message.success(
          "视频修改成功，可点击查看视频按钮跳转到视频页查看"
        );
        d.isUpload = false;
      } else {
        d.isUpload = false;
        window.$message.error(res.msg);
      }
    })
    .catch((err) => {
      d.progress = 0;
      d.isUpload = false;
    });
}
//重置
function resetForm() {
  if (d.modify) {
    getVideo(d.vid);
  } else {
    form.title = "";
    form.info = "";
    form.said = 1;
    d.showimg = "";
    d.upimg = "";
    d.fileImg = null;
  }
}
//跳转视频页
function jumpVideo() {
  let router = d.router.resolve({
    name: "Video",
    query: {
      vid: d.vid,
    },
  });
  window.open(router.href, "_blank");
}
//取消请求
function cancel() {
  if (d.cancel) {
    d.cancel("取消了上传");
    d.isUpload = false;
  }
}
</script>

<template>
  <div v-show="d.isUpload" class="occlude">
    <div class="box">
      <div class="text">
        {{
          d.progress == 100
            ? "传输完成，请等待服务器响应"
            : "正在上传中，请稍等"
        }}
      </div>
      <div class="progress">
        <div class="line" :style="{ width: d.progress * 2 + 'px' }"></div>
        <div class="text" v-show="d.progress">
          {{ d.progress == 100 ? "传输完成" : d.progress + "%" }}
        </div>
      </div>
      <n-button class="button" type="primary" @click="cancel"
        >取消上传</n-button
      >
    </div>
  </div>
  <div class="contribution">
    <div class="content">
      <div class="title">
        {{ d.modify ? `在这里进行一个投稿的修改` : `在这里进行一个视频的投稿` }}
      </div>
      <n-form
        ref="formRef"
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
        <n-form-item label="标题" path="title">
          <n-input
            maxlength="40"
            minlength="1"
            show-count
            clearable
            v-model:value="form.title"
            placeholder="标题"
          />
        </n-form-item>
        <n-form-item label="简介" path="info">
          <n-input
            maxlength="300"
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
        <n-form-item label="分区" path="subArea">
          <n-select
            clearable
            v-model:value="form.said"
            placeholder="请选择分区"
            :options="d.generalOptions"
          />
        </n-form-item>
        <n-form-item label="上传视频">
          <n-button @click="uploadVideo">选择视频文件</n-button>
          <n-ellipsis style="margin-left: 20px">{{ d.vname }}</n-ellipsis>
          <input
            v-show="false"
            @change="onchangeVideo"
            ref="videoRef"
            type="file"
            name="video"
            accept=".mp4,.avi,.flv"
          />
        </n-form-item>
        <n-form-item label="视频封面">
          <div style="flex-direction: column">
            <div class="img" @click="uploadImg">
              <img :src="d.showimg" ref="showImgRef" alt="" />
              <div class="text">点击上传图片</div>
            </div>
            <div class="progress">
              <div
                class="line"
                :style="{ width: d.progress * 3.2 + 'px' }"
              ></div>
              <div class="text" v-show="d.progress">
                {{ d.progress == 100 ? "传输完成" : d.progress + "%" }}
              </div>
            </div>
            <n-button
              v-show="d.progress == 100"
              class="button"
              type="primary"
              size="tiny"
              @click="jumpVideo"
              >查看视频</n-button
            >
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
                  aspectRatio: 320 / 210,
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
          <n-button
            size="large"
            style="margin-right: 20px"
            @click="resetForm"
            >{{ d.modify ? `重置` : `清空` }}</n-button
          >
          <n-button size="large" type="primary" @click="contributionConfirm">
            {{ d.modify ? `修改` : `投稿` }}
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.occlude {
  z-index: 999;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(191, 191, 191, 0.3);
  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    border-radius: 5px;
    box-shadow: inset 0px 0px 10px 0px #bdbdbd;
    background-color: white;
    .text {
      margin-bottom: 10px;
    }
    .progress {
      display: flex;
      flex-direction: row;
      border-radius: 3px;
      overflow: hidden;
      align-items: center;
      margin-bottom: 10px;
      .line {
        background-color: rgb(110, 110, 110);
        height: 10px;
        width: 0;
      }
      .text {
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        margin-bottom: 0;
      }
    }
  }
}
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
      width: 320px;
      height: 230px;
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
        height: 210px;
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
    .button {
      margin-top: 10px;
    }
  }
}
</style>
