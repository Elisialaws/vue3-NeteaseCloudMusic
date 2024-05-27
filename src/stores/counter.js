import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMusicLyric } from '@/api/item'
import { getPhoneLogin } from '@/api/home'
export const usePlaySongsStore = defineStore('playSongs', () => {
  // 使用 ref 创建响应式引用
  const playList = ref([
    {
      //播放列表
      al: {
        id: 75638746,
        name: 'Wild Youth',
        pic: 109951168785996140,
        picUrl:
          'https://p2.music.126.net/9ABIVDpwv0O8YpnsSBi2qA==/109951168785996138.jpg',
        pic_str: '109951168785996138'
      },
      id: 1347227968,
      name: 'Bloom',
      ar: [{ name: 'Far Out' }]
    }
  ])
  const playListIndex = ref(0) //默认下标为0
  const isbtnShow = ref(true) //暂停按钮的显示,是否暂停需要在不同页面都有,因此需要存储
  const detailShow = ref(false) //歌曲详情页的显示,就是底部弹出层是否显示
  const lyricList = ref({}) //歌词
  const currentTime = ref(0) //当前时间
  const duration = ref(0) //歌曲总时长
  const isLogin = ref(false) //判断是否登录
  const isFooterMusic = ref(true) //判断底部组件是否需要显示
  const token = ref('') //存储用户token
  const user = ref({}) //用户信息
  function updateIsbtnShow(value) {
    isbtnShow.value = value
  }
  function pushPlayList(value) {
    //点击搜索页面的歌曲，将其加入播放列表
    playList.value.push(value)
  }

  function updatePlayList(value) {
    playList.value = value
  }

  function updatePlayListIndex(value) {
    playListIndex.value = value
  }

  function updateDetailShow() {
    detailShow.value = !detailShow.value
  }

  function updateLyricList(value) {
    lyricList.value = value
  }

  function updateCurrentTime(value) {
    currentTime.value = value
  }

  function updateDuration(value) {
    duration.value = value
  }

  function updateIsLogin() {
    isLogin.value = true
  }

  function updateToken(value) {
    token.value = value
    localStorage.setItem('token', token.value)
  }

  function updateUser(value) {
    user.value = value
  }

  // 将 actions 转换为异步函数
  async function getLyric(value) {
    let res = await getMusicLyric(value)
    updateLyricList(res.data.lrc)
  }
  //登录的异步获取,游客登录
  async function getLogin() {
    let res = await getPhoneLogin()
    return res
  }

  // 返回所有的状态和方法
  return {
    playList,
    playListIndex,
    isbtnShow,
    detailShow,
    lyricList,
    currentTime,
    duration,
    isLogin,
    isFooterMusic,
    token,
    user,
    // 方法也一起返回
    updateIsbtnShow,
    pushPlayList,
    updatePlayList,
    updatePlayListIndex,
    updateDetailShow,
    updateLyricList,
    updateCurrentTime,
    updateDuration,
    updateIsLogin,
    updateToken,
    updateUser,
    getLyric,
    getLogin
  }
})
