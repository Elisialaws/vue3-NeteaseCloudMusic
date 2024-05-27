<!-- <script setup>

const addDuration = () => {
  store.updateDuration(audio.value.duration)
}
</script> -->
<script setup>
import { usePlaySongsStore } from '@/stores/counter'
import { ref, watch, onMounted, onUpdated, computed } from 'vue'
const playSongsStore = usePlaySongsStore()
const playList = computed(() => playSongsStore.playList)
const playListIndex = computed(() => playSongsStore.playListIndex)
const isbtnShow = computed(() => playSongsStore.isbtnShow)
const detailShow = computed(() => playSongsStore.detailShow)
const audio = ref(null)
const interval = ref(0)
const { updateDetailShow, getLyric, updateCurrentTime, updateDuration } =
  playSongsStore //函数可以直接解构，但是属性值需要storeToRefs
//实现正在唱的歌词高亮显示，需要获取当前播放时间
const updateInterval = () => {
  interval.value = setInterval(() => {
    updateCurrentTime(audio.value.currentTime)
  }, 800)
}
const play = () => {
  // 之前为暂停，点击后播放
  if (audio.value.paused) {
    audio.value.play()
    playSongsStore.updateIsbtnShow(false)
    updateInterval()
  } else {
    audio.value.pause()
    playSongsStore.updateIsbtnShow(true)
    clearInterval(interval.value) //暂停就清除定时器
  }
}
const addDuration = () => {
  updateDuration(audio.value.duration)
}
//当前播放下标改变，自动播放,且改变图标
watch(playListIndex, () => {
  audio.value.autoplay = true
  if (audio.value.paused) {
    playSongsStore.updateIsbtnShow(false)
  }
})
watch(playList, () => {
  if (isbtnShow.value) {
    audio.value.autoplay = true
    playSongsStore.updateIsbtnShow(false)
  }
})
//计算属性和ref需要通过.value访问值
onMounted(() => {
  getLyric(playList.value[playListIndex.value].id)
  updateInterval() //没进入到歌词页面也要计算
})
onUpdated(() => {
  getLyric(playList.value[playListIndex.value].id)
  addDuration()
})
</script>
<template>
  <div class="FooterMusic">
    <div class="footerLeft" @click="updateDetailShow">
      <img :src="playList[playListIndex].al.picUrl" alt="" />
      <div>
        <p>{{ playList[playListIndex].name }}</p>
        <span>横滑切换上下首</span>
      </div>
    </div>
    <div class="footerRight">
      <svg
        class="icon liebiao"
        aria-hidden="true"
        @click="play"
        v-if="isbtnShow"
      >
        <use xlink:href="#icon-bofanganniu"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true" v-else @click="play">
        <use xlink:href="#icon-weibiaoti--"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-zu"></use>
      </svg>
    </div>
    <audio
      ref="audio"
      :src="`https://music.163.com/song/media/outer/url?id=${playList[playListIndex].id}.mp3`"
    ></audio>
    <!--popup弹出层组件，position设置弹出位置,
        v-model:show参数绑定一个bool值，是否展示弹出层-->
    <van-popup
      v-model:show="detailShow"
      position="bottom"
      :style="{ height: '100%', width: '100%' }"
    >
      <!--在歌曲详情页也要实现播放功能-->
      <MusicDetail
        :musicList="playList[playListIndex]"
        :play="play"
        :isbtnShow="isbtnShow"
        @addDuration="addDuration"
      ></MusicDetail>
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.FooterMusic {
  width: 100%;
  height: 1.4rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #999;
  display: flex;
  padding: 0.2rem;
  justify-content: space-between;
  .footerLeft {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }
  }
  .footerRight {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
}
</style>
