<script setup>
//实现页面的轮播器
import { reactive, onMounted } from 'vue'
import { getBanner } from '@/api/home'

const state = reactive({
  images: [
    'https://img.yzcdn.cn/vant/apple-1.jpg',
    'https://img.yzcdn.cn/vant/apple-2.jpg'
  ]
})
onMounted(async () => {
  let res = await getBanner()
  if (res.data && res.data.banners) {
    state.images = res.data.banners
  }
})
</script>

<template>
  <div id="swiperTop">
    <van-swipe :autoplay="3000" lazy-render>
      <van-swipe-item v-for="image in state.images" :key="image">
        <img :src="image.pic" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<style lang="less">
#swiperTop {
  //需要在上面自己添加一个id
  .van-swipe {
    width: 100%;
    height: 3rem;
    .van-swipe-item {
      padding: 0 0.2rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.2rem;
      }
    }
    .van-swipe__indicator--active {
      background-color: rgb(219, 130, 130);
    }
  }
}
</style>
