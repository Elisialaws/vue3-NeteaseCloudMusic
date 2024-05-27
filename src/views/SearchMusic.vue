<script setup>
import { getSearchMusic } from '@/api/home'
import { usePlaySongsStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
const searchList = ref([]) //搜索列表
const keyWordList = ref([])
const searchKey = ref('')
const playSongsStore = usePlaySongsStore()
const { pushPlayList, updatePlayListIndex } = playSongsStore
const { playList } = storeToRefs(playSongsStore)
const searchHistory = async (value) => {
  let res = await getSearchMusic(value)
  searchList.value = res.data.result.songs
}
const delHistory = () => {
  keyWordList.value = []
  localStorage.removeItem('keyWordList')
}
//如果没有本地存储，就赋值为空
onMounted(() => {
  keyWordList.value = JSON.parse(localStorage.getItem('keyWordList')) || []
})
/**
 * 按下回车还要情空当前搜索字符串,将搜索记录存储到本地
 */
const enterKey = async () => {
  if (searchKey.value !== '') {
    keyWordList.value.unshift(searchKey.value)
    keyWordList.value = [...new Set(keyWordList.value)] //需要通过Set去重，并限制最大长度
    if (keyWordList.value.length > 10) keyWordList.value.pop()
    localStorage.setItem('keyWordList', JSON.stringify(keyWordList.value)) //历史搜索保存到本地
    let res = await getSearchMusic(searchKey.value)
    searchList.value = res.data.result.songs
    searchKey.value = ''
  }
}
const updateIndex = (item) => {
  //点击歌曲后，需要把它加入到播放列表
  item.al = item.album //因为后端接口的属性名字改了，这里也要改
  item.al.picUrl = item.album.artist.img1v1Url
  pushPlayList(item)
  updatePlayListIndex(playList.value.length - 1) //下标更新为最后一首的
}
</script>
<template>
  <div class="searchTop">
    <!--利用路由的go进行跳转-->
    <svg class="icon" aria-hidden="true" @click="$router.go(-1)">
      <use xlink:href="#icon-zuojiantou"></use>
    </svg>
    <!--监听回车键按下的事件,v-model双向绑定获取输入框内容,不需要.value-->
    <input
      type="text"
      placeholder="银临"
      v-model="searchKey"
      @keydown.enter="enterKey"
    />
  </div>
  <div class="searchHistory">
    <span class="searchSpan">历史</span>
    <span
      v-for="item in keyWordList"
      :key="item"
      class="spanKey"
      @click="searchHistory(item)"
      >{{ item }}</span
    >
    <svg class="icon" aria-hidden="true" @click="delHistory">
      <use xlink:href="#icon-shanchu"></use>
    </svg>
  </div>
  <div class="itemList">
    <div class="item" v-for="(item, index) in searchList" :key="index">
      <div class="itemLeft" @click="updateIndex(item)">
        <span class="leftSpan">{{ index + 1 }}</span>
        <div>
          <p>{{ item.name }}</p>
          <span v-for="(item1, index) in item.artists" :key="index">{{
            item1.name
          }}</span>
        </div>
      </div>
      <div class="itemRight">
        <svg class="icon bofang" aria-hidden="true" v-if="item.mvid != 0">
          <use xlink:href="#icon-shipin"></use>
        </svg>
        <svg class="icon liebiao" aria-hidden="true">
          <use xlink:href="#icon-31liebiao"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.searchTop {
  width: 100%;
  height: 1rem;
  padding: 0 0.2rem;
  display: flex;
  align-items: center;
  input {
    margin-left: 0.2rem;
    border: none;
    border-bottom: 1px solid #999;
    width: 90%;
    padding: 0.1rem;
  }
}
.searchHistory {
  width: 100%;
  padding: 0.2rem;
  position: relative;
  .searchSpan {
    font-weight: 700;
  }
  .spanKey {
    padding: 0.1rem 0.2rem;
    background-color: rgb(185, 169, 169);
    border-radius: 0.4rem;
    margin: 0.1rem 0.2rem;
    display: inline-block;
  }
  .icon {
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    right: 0.2rem;
  }
}
.itemList {
  width: 100%;
  padding: 0.2rem;
  .item {
    width: 100%;
    height: 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .itemLeft {
      width: 85%;
      height: 100%;
      display: flex;
      align-items: center;
      .leftSpan {
        display: inline-block;
        width: 0.2rem;
        text-align: center;
      }
      div {
        p {
          width: 4.54rem;
          height: 0.4rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;
        }
        span {
          font-weight: 400;
          font-size: 0.24rem;
          color: #999;
        }
        margin-left: 0.3rem;
      }
    }
    .itemRight {
      width: 20%;
      height: 100%;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      position: relative;
      .icon {
        fill: #999;
      }
      .bofang {
        position: absolute;
        left: 0;
      }
      .liebiao {
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>
