<template>
  <div class="container">
    <p class="title green">网络测速工具</p>
    <a-button @click="onClickStart" type="primary" class="button" :disabled="disabled"
      >开始测速</a-button
    >
    <div v-if="isStart" class="info">
      <p v-if="isLoading">正在测速...</p>
      <p v-else-if="isError">测速失败x_x 请检查网络问题</p>
      <p v-else class="info">当前网速为：{{ speed }} MB/s</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, resolveDirective, watch } from 'vue'
import nst from '../../../network-speed-test/dist/index'
import 'ant-design-vue/lib/button/style'
import AButton from 'ant-design-vue/lib/button'
const isLoading = ref(false)
const isError = ref(false)
const isStart = ref(false)
const disabled = ref(false)
const speed = ref(0)

watch(isLoading, async () => {
  if (isLoading.value) {
    // speed.value = await nst.getSpeedByImg(
    //   'https://pic4.zhimg.com/v2-392227d18fe64dd8950e2b18eb279ecf_r.jpg',
    //   734208
    // )
    speed.value = await nst.getSpeedByAjax(
      'https://pic4.zhimg.com/v2-392227d18fe64dd8950e2b18eb279ecf_r.jpg'
    )
    // isError.value = true
    isLoading.value = false
    disabled.value = false
  }
})
function onClickStart() {
  disabled.value = true
  isStart.value = true
  isLoading.value = true
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  .title {
    margin: 20px;
    font-size: 20px;
    text-align: center;
  }
  :deep(.button) {
    display: block;
    margin: 50px auto;
  }
  .info {
    text-align: center;
    font-size: 20px;
  }
}
</style>
