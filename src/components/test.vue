<script setup>
import store from "../store";
import { reactive, ref, onMounted } from "vue";
let dplayer = ref(null);

const d = reactive({

});

onMounted(() => {
  dplayer.value.src = store.state.fileApi + "video/1/14.mp4";

});
</script>
<template>
  <video
    id="dplayer"
    ref="dplayer"
    type="video/mp4"
    src=""
    controls
    autoplay
  ></video>
</template>
<style lang="less" scoped>

</style>
