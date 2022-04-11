<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import store from "../../store";
import VuePictureCropper, { cropper } from "vue-picture-cropper/dist/esm";
import {
  useGetListSubArea,
  useCreateSubArea,
  useDeleteSubArea,
} from "../../api/sub_area";
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
  return useGetListSubArea()
    .then((res) => {
      if (res) {
        table.data = res;
        table.loading = false;
      }
    })
    .catch((err) => {
      if (err) table.loading = false;
    });
};

//                  事件方法
//删除一行
const removeEvent = async (row) => {
  const type = await VXETable.modal.confirm("您确定要删除该数据?");
  if (type === "confirm") {
    useDeleteSubArea(row.id).then((res) => {
      getList();
    });
  }
};
//新增
const insertEvent = () => {
  table.formData = {
    name: "",
  };
  table.selectRow = null;
  table.showEdit = true;
};
//保存
const submitEvent = () => {
  table.submitLoading = true;
  useCreateSubArea(table.formData).then((res) => {
    getList().then(() => {
      table.showEdit = false;
      table.submitLoading = false;
    });
  });
};
//表单配置
const table = reactive({
  submitLoading: false,
  allAlign: "",
  loading: false,
  selectRow: null,
  showEdit: false,
  formData: {
    name: "",
  },
  formRules: {
    name: [{ required: true, message: "请输入名称" }],
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
    >
      <vxe-column type="seq" width="60" fixed="left"></vxe-column>
      <vxe-column field="id" title="id"></vxe-column>
      <vxe-column field="name" title="名称"></vxe-column>
      <vxe-column title="操作" width="80" fixed="right" show-overflow>
        <template #default="{ row }">
          <vxe-button v-if="row.id != 1" @click="removeEvent(row)"
            >删除</vxe-button
          >
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
            title="新增分区"
            title-align="left"
            :title-width="200"
            :span="24"
          ></vxe-form-item>
          <vxe-form-item field="name" title="Name" :span="12" :item-render="{}">
            <template #default="{ data }">
              <vxe-input
                v-model="data.name"
                placeholder="请输入分区名称"
              ></vxe-input>
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
