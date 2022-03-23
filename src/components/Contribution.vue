<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import VuePictureCropper, { cropper } from "vue-picture-cropper/dist/esm";
import { useRouter, useRoute } from "vue-router";
import store from "../store";

onMounted(() => {
  const vid = d.route.params["vid"];
  d.modify = d.route.meta["modify"];
  console.log(vid);
  if (d.modify) {
    window.$http.get(`/api/v1/video/${vid}`).then(({ data }) => {
      if (data.code == 200) {
        console.log(data.data);
        d.vid = data.data.id;
        form.title = data.data.title;
        form.info = data.data.info;
        form.said = data.data.said;
        d.showimg = store.state.coverApi + data.data.cover;
      }
    });
  }
});
// useRouter().beforeEach((to, from) => {
//   d.modify = ref(to.meta.modify);
// });
const d = reactive({
  modify: false,
  router: useRouter(),
  route: useRoute(),
  uMessage: {
    avatar: "",
    title: "asdsaf",
    info: "sdjkngjhasdjkglkjsadjko",
  },
  generalOptions: [
    { label: "默认", value: 1 },
    { label: "动画", value: 2 },
  ],
  action: "http://127.0.0.1:2333/api/v1/video",
  showModal: false,
  upimg: "",
  showimg: "",
  vname: "",
  fileImg: null,
  vid: null,
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
function uploadImg() {
  upimgRef.value.value = "";
  upimgRef.value.click();
}
function uploadVideo() {
  videoRef.value.click();
}
const titleValidationStatus = computed(() => {
  if (form.title != "") {
    return 0;
  } else {
    return "error";
  }
});
const subAreaValidationStatus = computed(() => {
  if (form.said != "" && form.said != null) {
    return 0;
  } else {
    return "error";
  }
});
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
    window.$http
      .put(`/api/v1/video/${d.vid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data;charset=UTF-8",
        },
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code == 200) {
          window.$message.success("视频修改成功");
        } else {
          window.$message.error(data.msg);
        }
      });
  } else {
    formData.append("video", file);
    formData.append("vimg", d.fileImg);
    window.$http
      .post("/api/v1/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data;charset=UTF-8",
        },
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code == 200) {
          window.$message.success("视频创建成功");
        } else {
          window.$message.error(data.msg);
        }
      });
  }
  d.router.push({
    name: "Video",
    params: {
      vid: d.vid,
    },
  });
}
</script>

<template>
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
        <n-form-item
          :validation-status="titleValidationStatus"
          label="标题"
          path="title"
        >
          <n-input
            maxlength="30"
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
        <n-form-item
          label="分区"
          path="subArea"
          :validation-status="subAreaValidationStatus"
        >
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
          <div class="img" @click="uploadImg">
            <img :src="d.showimg" ref="showImgRef" alt="" />
            <div class="text">点击上传图片</div>
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
          <n-button size="large" type="primary" @click="contributionConfirm">
            {{ d.modify ? `修改` : `投稿` }}
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
      width: 320px;
      height: 230px;
      margin-right: 20px;
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
  }
}
</style>
