<template>
  <div class="container">
    <p class="title green">网络测速工具</p>
    <a-button @click="onClickStart" type="primary" class="button" :disabled="disabled"
      >开始测速</a-button
    >
    <div v-if="isStart" class="info">
      <p v-if="isLoading">正在测速...</p>
      <p v-else-if="isError">测速失败x_x，请检查网络设置</p>
      <p v-else class="info">当前网速为：{{ speed }} MB/s</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, resolveDirective, watch } from 'vue'
import nst from 'test-network-speed'
import 'ant-design-vue/lib/button/style'
import AButton from 'ant-design-vue/lib/button'
const isLoading = ref(false) //正在测速的状态变量
const isError = ref(false) //是否捕获到错误
const isStart = ref(false) //第一次测速
const disabled = ref(false) //正在测速时，禁用测速按钮
const speed = ref('0') //测得的网速值

watch(isLoading, getNetworkSpeed)

async function getNetworkSpeed() {
  if (isLoading.value) {
    try {
      // 图片探测方式测速
      // speed.value = await nst.getSpeedByImg(
      //   'https://pic4.zhimg.com/v2-392227d18fe64dd8950e2b18eb279ecf_r.jpg',
      //   734208
      // )

      // Ajax方式测速
      speed.value = await nst.getSpeedByAjax('/api/v2-479db8ce71c66355d06f94b6ee9fee06_r.jpg')

      // 开发环境下，启用DevTools => 网络 => 勾选停用缓存，可以不经代理进行测试
      // speed.value = await nst.getSpeedByAjax(
      //   'https://pic3.zhimg.com/v2-479db8ce71c66355d06f94b6ee9fee06_r.jpg'
      // )
    } catch (error) {
      console.log(error)
      isError.value = true
    }
    isLoading.value = false
    disabled.value = false
  }
}

function onClickStart() {
  isError.value = false
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
