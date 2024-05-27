<script setup>
//弹出层的歌曲详情页，显示歌曲名，歌词,歌曲时长等
import { ref, computed, onMounted, watch } from 'vue'
import { usePlaySongsStore } from '@/stores/counter'
import { Vue3Marquee } from 'vue3-marquee'
import { storeToRefs } from 'pinia'
const props = defineProps(['musicList', 'isbtnShow', 'play'])
const emit = defineEmits(['addDuration'])
const playSongsStore = usePlaySongsStore()
const isLyricShow = ref(false)
const musicLyric = ref()
const { lyricList, currentTime, playList, playListIndex, duration } =
  storeToRefs(playSongsStore)
const { updateDetailShow, updatePlayListIndex } = playSongsStore
onMounted(() => [emit('addDuration')])
const lyric = computed(() => {
  let arr
  //map会返回一个新数组，每个元素都调用一次提供的函数
  if (lyricList.value.lyric) {
    //以一个正则表达式切割
    arr = lyricList.value.lyric.split(/[(\r\n)\r\n]+/).map((item) => {
      //slice返回一个新的数组对象，由begin 和 end决定的原数组的浅拷（包括 begin，不包括end）。
      let minute = item.slice(1, 3)
      let second = item.slice(4, 6)
      let millisecond = item.slice(7, 10)
      let lyrics = item.slice(11, item.length)
      let time =
        parseInt(minute) * 60 * 1000 +
        parseInt(second) * 1000 +
        parseInt(millisecond)
      if (isNaN(Number(millisecond))) {
        //防止切割到]，少切割一位
        millisecond = item.slice(7, 9)
        lyrics = item.slice(10, item.length)
        time =
          parseInt(minute) * 60 * 1000 +
          parseInt(second) * 1000 +
          parseInt(millisecond)
      }
      return { minute, second, millisecond, lyrics, time }
    })
    arr.forEach((item, i) => {
      if (i === arr.length - 1 || isNaN(arr[i + 1].time)) {
        //最后一句歌词不需要计算下一句歌词时间
        item.pre = 100000
      } else {
        item.pre = arr[i + 1].time
      }
    })
  }
  return arr
})
/**
 * goplay函数实现上一首下一首歌曲切换
 * @param num
 */
const goPlay = (num) => {
  let index = playListIndex.value + num
  if (index < 0) index = playList.value.length - 1
  else if (index == playList.value.length) index = 0
  updatePlayListIndex(index)
}
/**
 * 不需要深度监听,通过监听正在播放歌词距离顶部的距离向上滚动
 * 通过检测当前时间实现自动播放下一首
 */
watch(currentTime, (newValue) => {
  let p = document.querySelector('p.active')
  //console.log([p])
  if (p.offsetTop > 300) {
    musicLyric.value.scrollTop = p.offsetTop - 300
  }
  if (newValue === duration.value) {
    if (playListIndex.value === playList.value.length - 1) {
      updatePlayListIndex(0)
      props.play
    } else {
      updatePlayListIndex(playListIndex.value + 1)
    }
  }
})
const backHome = () => {
  isLyricShow.value = false
  updateDetailShow()
}
</script>
<template>
  <img :src="musicList.al.picUrl" alt="" class="bgimg" />
  <div class="detailTop">
    <div class="detailTopLeft">
      <!--点击返回可以回到原来的位置,通过更改弹出层的bool值-->
      <svg class="icon liebiao" aria-hidden="true" @click="backHome">
        <use xlink:href="#icon-zuojiantou"></use>
      </svg>
      <div class="leftMarquee">
        <!--歌曲名字，歌手,使用了Vue3Marquee跑马灯组件库-->
        <Vue3Marquee style="color: #fff">{{ musicList.al.name }}</Vue3Marquee>
        <span v-for="item in musicList.ar" :key="item">
          {{ item.name }}
        </span>
        <svg class="icon liebiao" aria-hidden="true">
          <use xlink:href="#icon-youjiantou1"></use>
        </svg>
      </div>
    </div>
    <div class="detailTopRight">
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-fenxiang"></use>
      </svg>
    </div>
  </div>
  <!--根据是否播放动态设置class来设置图片样式属性-->
  <div class="detailContent" v-show="!isLyricShow" @click="isLyricShow = true">
    <img
      src="@/assets/needle-ab.png"
      class="img_needle"
      :class="{ img_needle_active: !isbtnShow }"
    />
    <img
      src="@/assets/cd.png"
      class="img_cd"
      :class="{ img_ar_active: !isbtnShow, img_ar_pauesd: isbtnShow }"
    />
    <img
      :src="musicList.al.picUrl"
      class="img_ar"
      :class="{ img_ar_active: !isbtnShow, img_ar_pauesd: isbtnShow }"
    />
  </div>
  <div
    class="musicLyric"
    ref="musicLyric"
    v-show="isLyricShow"
    @click="isLyricShow = false"
  >
    <!--可以传递一个对象给:class，对象的键是类名，值是布尔值，表示是否应用该类-->
    <p
      v-for="item in lyric"
      :key="item"
      :class="{
        active: currentTime * 1000 >= item.time && currentTime * 1000 < item.pre
      }"
    >
      {{ item.lyrics }}
    </p>
  </div>
  <div class="detailFooter">
    <div class="footerTop">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-aixin"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-iconfontzhizuobiaozhun023146"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yinlechangpian"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-iconfontzhizuobiaozhun023110"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-liebiao-"></use>
      </svg>
    </div>
    <div class="footerContent">
      <!--实现播放滚动条,step设置每次增加多少-->
      <input
        type="range"
        class="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        step="0.02"
      />
    </div>
    <div class="footer">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xunhuan"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="goPlay(-1)">
        <use xlink:href="#icon-shangyishoushangyige"></use>
      </svg>
      <svg
        class="icon bofang"
        aria-hidden="true"
        v-if="isbtnShow"
        @click="play"
      >
        <use xlink:href="#icon-bofang1"></use>
      </svg>
      <svg class="icon bofang" aria-hidden="true" v-else @click="play">
        <use xlink:href="#icon-zanting"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="goPlay(1)">
        <use xlink:href="#icon-xiayigexiayishou"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zu"></use>
      </svg>
    </div>
  </div>
</template>
<style lang="less" scoped>
.bgimg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  filter: blur(70px);
}
.detailTop {
  width: 100%;
  height: 1rem;
  display: flex;
  padding: 0.2rem;
  justify-content: space-between;
  align-items: center;
  fill: #fff;
  .detailTopLeft {
    display: flex;
    align-items: center;
    .leftMarquee {
      width: 3rem;
      height: 100%;
      margin-left: 0.4rem;
      span {
        color: #999;
      }
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        fill: #999;
      }
    }
  }
}
.detailContent {
  width: 100%;
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .img_needle {
    width: 2rem;
    height: 3rem;
    position: absolute;
    left: 46%;
    transform-origin: 0 0;
    transform: rotate(-13deg);
    transition: all 2s;
  }
  .img_needle_active {
    width: 2rem;
    height: 3rem;
    position: absolute;
    left: 46%;
    transform-origin: 0 0;
    transform: rotate(0deg);
    transition: all 2s;
  }

  .img_cd {
    width: 5rem;
    height: 5rem;
    position: absolute;
    bottom: 2.3rem;
    z-index: -1;
  }
  .img_ar {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    position: absolute;
    bottom: 3.14rem;
    animation: rotate_ar 10s linear infinite;
  }
  .img_ar_active {
    animation-play-state: running;
  }
  .img_ar_pauesd {
    animation-play-state: paused;
  }
  @keyframes rotate_ar {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
.musicLyric {
  width: 100%;
  height: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.2rem;
  overflow: scroll;
  p {
    color: rgb(255, 255, 255);
    margin-bottom: 0.3rem;
  }
  .active {
    color: #e69328;
    font-size: 0.5rem;
  }
}
.detailFooter {
  width: 100%;
  height: 3rem;
  position: absolute;
  bottom: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .footerTop {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      width: 0.36rem;
      height: 0.36rem;
      fill: rgb(245, 234, 234);
    }
    .icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  .range {
    width: 100%;
    height: 0.06rem;
  }
  .footer {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      fill: rgb(245, 234, 234);
    }
    .bofang {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
