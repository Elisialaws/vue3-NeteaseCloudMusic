<script setup>
import { RouterView } from 'vue-router'
import FooterMusic from '@/components/FooterMusic.vue'
import { usePlaySongsStore } from './stores/counter'
import { storeToRefs } from 'pinia'
const playSongsStore = usePlaySongsStore()
const { isFooterMusic } = storeToRefs(playSongsStore)
</script>

<template>
  <RouterView></RouterView>
  <FooterMusic v-show="isFooterMusic"></FooterMusic>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.icon {
  width: 0.5rem;
  height: 0.5rem;
}
a {
  color: black;
}
</style>
