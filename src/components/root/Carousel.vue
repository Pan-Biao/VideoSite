<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import store from "../../store";
import VuePictureCropper, { cropper } from "vue-picture-cropper/dist/esm";
import {
  useGetCarousel,
  useAddCarousel,
  useDeleteCarousel,
} from "../../api/carousel";
import { VXETable } from "vxe-table";
const xTable = ref(null);
const xToolbar = ref(null);
//运行时
onMounted(() => {
  table.loading = true;
  getList().then(() => {
    table.loading = false;
  });
});
nextTick(() => {
  // 将表格和工具栏进行关联
  const $table = xTable.value;
  const $toolbar = xToolbar.value;
  $table.connect($toolbar);
});
//获取数据
const getList = () => {
  return useGetCarousel()
    .then((res) => {
      if (res) {
        table.data = res;
        // tablePage.total = res.data.length;
        // // tablePage.currentPage = res.
        table.loading = false;
      }
    })
    .catch((err) => {
      if (err) table.loading = false;
    });
};

//                  事件方法
// 上传图片
const upimgRef = ref(null);
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
//显示图片
function onchangeImg({ target: data }) {
  let file = data.files[0];
  table.upimg = getObjectURL(file);
  table.showModal = true;
}
//重置裁剪
function reset() {
  cropper.reset();
}
// 裁剪
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
  table.formData.file = file;
  try {
    table.showimg = getObjectURL(blob);
  } catch (e) {
    table.showimg = "";
  }
  // 隐藏裁切弹窗
  table.showModal = false;
}
//删除一行
const removeEvent = async (row) => {
  const type = await VXETable.modal.confirm("您确定要删除该数据?");
  if (type === "confirm") {
    useDeleteCarousel(row.id).then((res) => {
      getList();
    });
  }
};
//新增
const insertEvent = () => {
  table.formData = {
    title: "",
    path: "",
    file: null,
  };
  table.selectRow = null;
  table.showEdit = true;
};
//修改
const cellDBLClickEvent = ({ row }) => {
  editEvent(row);
};
//保存
const submitEvent = () => {
  table.submitLoading = true;
  const formData = new FormData();
  Object.keys(table.formData).forEach((key) => {
    formData.append(key, table.formData[key]);
  });
  useAddCarousel(formData).then((res) => {
    getList().then(() => {
      table.showEdit = false;
      table.submitLoading = false;
    });
  });
};
//表单配置
const table = reactive({
  showModal: false,
  upimg: "",
  showimg: "",
  submitLoading: false,
  allAlign: "",
  loading: false,
  selectRow: null,
  showEdit: false,
  formData: {
    title: "",
    path: "",
    file: null,
  },
  formRules: {
    name: [
      { required: true, message: "请输入名称" },
      { min: 3, max: 5, message: "长度在 3 到 5 个字符" },
    ],
    nickname: [{ required: true, message: "请输入昵称" }],
    sex: [{ required: true, message: "请选择性别" }],
  },
  data: [],
});
</script>
<template>
  <!-- 表格 -->
  <div class="flex">
    <!-- 表格工具栏 -->
    <vxe-toolbar ref="xToolbar" custom :refresh="{ query: getList }">
      <template #buttons>
        <vxe-button @click="insertEvent()"> 新增 </vxe-button>
        <vxe-button @click="table.allAlign = 'left'">居左</vxe-button>
        <vxe-button @click="table.allAlign = 'center'">居中</vxe-button>
        <vxe-button @click="table.allAlign = 'right'">居右</vxe-button>
      </template>
    </vxe-toolbar>
    <!-- 表格 -->
    <vxe-table
      ref="xTable"
      :align="table.allAlign"
      :loading="table.loading"
      show-overflow
      stripe
      round
      border
      :column-config="{ resizable: true }"
      :data="table.data"
      :row-config="{ isHover: true }"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-column type="seq" width="60" fixed="left"></vxe-column>
      <vxe-column field="title" title="Title"></vxe-column>
      <vxe-column field="path" title="Path" show-overflow></vxe-column>
      <vxe-column field="cover" title="Cover"></vxe-column>
      <vxe-column title="操作" width="80" fixed="right" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 模态框表单 -->
    <vxe-modal
      v-model="table.showEdit"
      :title="table.selectRow ? '编辑&保存' : '新增&保存'"
      width="800"
      min-width="600"
      min-height="300"
      :loading="table.submitLoading"
      resize
      destroy-on-close
    >
      <template #default>
        <vxe-form
          :data="table.formData"
          :rules="table.formRules"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        >
          <vxe-form-item
            title="新增轮播图"
            title-align="left"
            :title-width="200"
            :span="24"
          ></vxe-form-item>
          <vxe-form-item
            field="title"
            title="Title"
            :span="12"
            :item-render="{}"
          >
            <template #default="{ data }">
              <vxe-input
                v-model="data.title"
                placeholder="请输入标题"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="path" title="Path" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input
                v-model="data.path"
                placeholder="请输入链接"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="file" title="File" :span="12" :item-render="{}">
            <template #default="{ data }">
              <div class="img" @click="uploadImg">
                <img :src="table.showimg" ref="showImgRef" alt="" />
                <div class="text">点击上传图片</div>
              </div>
              <input
                v-show="false"
                @change="onchangeImg"
                ref="upimgRef"
                type="file"
                name="img"
                accept=".img,.png"
              />
            </template>
          </vxe-form-item>
          <vxe-form-item align="center" title-align="left" :span="24">
            <template #default>
              <vxe-button type="submit">提交</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
    <!-- 图片裁切插件 -->
    <n-modal
      v-model:show="table.showModal"
      :mask-closable="false"
      class="custom-card"
    >
      <n-el tag="div" class="cutting">
        <VuePictureCropper
          :boxStyle="{
            width: '600px',
            height: '100%',
            backgroundColor: '#f8f8f8',
            margin: 'auto',
          }"
          :img="table.upimg"
          :options="{
            viewMode: 1,
            dragMode: 'crop',
            aspectRatio: 40 / 28,
          }"
        />
        <!-- 图片裁切插件 -->
        <div class="buttonList">
          <n-button @click="reset">重置</n-button>
          <n-button @click="getResult">裁剪</n-button>
        </div>
      </n-el>
    </n-modal>
  </div>
</template>


<style lang="less" scoped>
.flex {
  margin: 20px;
  width: calc(100% - 40px);
  height: calc(100vh - 40px);
  overflow: hidden;
  .vxe-table {
    height: calc(100% - 52px);
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
</style>
