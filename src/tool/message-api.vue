<template>
  <div></div>
</template>
 
<script>
import { defineComponent } from "vue";
import { useMessage } from "naive-ui";

export default defineComponent({
  setup() {
    // .info
    // .success
    // .warning
    // .error
    // .loading
    // .destroyAll
    window.$message = useMessage();
  },
});
</script>
