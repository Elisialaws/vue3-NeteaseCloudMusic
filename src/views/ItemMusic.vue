<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { getMusicListDetail, getSongsList } from '@/api/item'
import { reactive } from 'vue'
//在components里面的组件自动注册
let playList = reactive({
  playList: {},
  itemList: []
})
onMounted(async () => {
  let musicID = useRoute().query.id
  let res = await getMusicListDetail(musicID)
  playList.playList = res.data.playlist
  let result = await getSongsList(musicID)
  playList.itemList = result.data.songs
  //防止刷新后数据丢失无法渲染,保存在会话级别存储
  sessionStorage.setItem('itemDetail', JSON.stringify(playList))
})
</script>
<template>
  <ItemMusicTop :playlist="playList.playList"></ItemMusicTop>
  <ItemMusicList
    :itemList="playList.itemList"
    :subscribedCount="playList.playList.subscribedCount"
  ></ItemMusicList>
</template>
