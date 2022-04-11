<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import store from "../../store";
import { useUserSuspend, useUserUnseal, useGetUserList } from "../../api/user";
import { VXETable } from "vxe-table";
import { FileExport } from "@vicons/fa";
import { time } from "../../tool";
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
  let temp = table.search ? table.search.split(/\s+/) : [];
  return useGetUserList({
    number: table.pageSize,
    page_number: table.currentPage,
    searchs: temp,
    sorts: [
      {
        field: "created_at",
        sort: table.sort,
      },
    ],
  })
    .then((res) => {
      if (res) {
        table.data = res.users;
        table.total = res.total;
        table.currentPage = res.page_number;
        table.loading = false;
      }
    })
    .catch((err) => {
      if (err) table.loading = false;
    });
};

//                  事件方法
//禁用
const userSuspend = async (row) => {
  const type = await VXETable.modal.confirm("您确定要禁用此用户?");
  if (type === "confirm") {
    useUserSuspend(row.id).then((res) => {
      getList();
    });
  }
};
//解禁
const userUnseal = async (row) => {
  const type = await VXETable.modal.confirm("您确定要解禁此用户?");
  if (type === "confirm") {
    useUserUnseal(row.id).then((res) => {
      getList();
    });
  }
};
//分页切换
const pageChange = () => {
  getList();
};
//导出
const openExportEvent = () => {
  const $table = xTable.value;
  $table.openExport();
};
//格式化时间
const formatTime = ({ cellValue }) => {
  return time(cellValue, 2);
};
//回车搜索
const searchKeyup = (value) => {
  if (value.$event.keyCode == 13) {
    getList();
  }
};
//搜索
const search = () => {
  getList();
};
//表单配置
const table = reactive({
  allAlign: "",
  sort: "desc",
  total: 0,
  search: "",
  currentPage: 1,
  pageSize: 10,
  loading: false,
  selectRow: null,
  showEdit: false,
  data: [],
});
</script>
<template>
  <!-- 表格 -->
  <div class="flex">
    <!-- 表格工具栏 -->
    <vxe-toolbar ref="xToolbar" custom print :refresh="{ query: getList }">
      <template #buttons>
        <vxe-button @click="table.allAlign = 'left'">居左</vxe-button>
        <vxe-button @click="table.allAlign = 'center'">居中</vxe-button>
        <vxe-radio-group style="margin-left: 12px" v-model="table.sort">
          <vxe-radio-button
            title="按时间排序"
            label="desc"
            content="降序"
          ></vxe-radio-button>
          <vxe-radio-button
            title="按时间排序"
            label="asc"
            content="升序"
          ></vxe-radio-button>
        </vxe-radio-group>
        <vxe-input
          style="margin-left: 12px"
          v-model="table.search"
          placeholder="搜索"
          @keyup="searchKeyup"
          @search-click="search"
          type="search"
          clearable
        ></vxe-input>
      </template>
      <template #tools>
        <vxe-button
          @click="openExportEvent"
          title="导出"
          style="margin-right: 12px"
          circle
        >
          <n-icon size="14" :component="FileExport"> </n-icon>
        </vxe-button>
      </template>
    </vxe-toolbar>
    <!-- 表格 -->
    <vxe-table
      ref="xTable"
      :align="table.allAlign"
      :loading="table.loading"
      show-overflow
      :print-config="{}"
      stripe
      round
      border
      :column-config="{ resizable: true }"
      :export-config="{}"
      :data="table.data"
      :row-config="{ isHover: true }"
    >
      <vxe-column type="seq" width="60" fixed="left"></vxe-column>
      <vxe-column field="id" title="ID" fixed="left"></vxe-column>
      <vxe-column field="nickname" title="昵称"></vxe-column>
      <vxe-column field="status" title="状态"></vxe-column>
      <vxe-column field="user_name" title="用户名"></vxe-column>
      <vxe-column
        field="created_at"
        title="创建时间"
        :formatter="formatTime"
      ></vxe-column>
      <vxe-column field="head_portrait" title="头像" show-overflow></vxe-column>
      <vxe-column field="info" title="简介" show-overflow></vxe-column>
      <vxe-column title="操作" width="80" fixed="right" show-overflow>
        <template #default="{ row }">
          <vxe-button v-if="row.status == 'active'" @click="userSuspend(row)"
            >禁用</vxe-button
          >
          <vxe-button v-else @click="userUnseal(row)">解禁</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      v-model:current-page="table.currentPage"
      v-model:page-size="table.pageSize"
      @page-change="pageChange"
      :total="table.total"
      :page-sizes="[10, 20, 50, 100, 500, { label: '全部数据', value: 0 }]"
      :layouts="[
        'PrevJump',
        'PrevPage',
        'Number',
        'NextPage',
        'NextJump',
        'Sizes',
        'FullJump',
        'Total',
      ]"
    >
    </vxe-pager>
  </div>
</template>


<style lang="less" scoped>
.flex {
  margin: 20px;
  width: calc(100% - 40px);
  height: calc(100vh - 40px);
  overflow: hidden;
  .vxe-table {
    height: calc(100% - 52px - 48px);
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
.vxe-button,
.vxe-input {
  vertical-align: top;
}
</style>
