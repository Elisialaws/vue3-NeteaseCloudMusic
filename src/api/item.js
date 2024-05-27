import service from '@/utils/request'
//获取歌单详情
export const getMusicListDetail = (data) => {
  return service.get(`/playlist/detail?id=${data}`)
}
//获取歌单所有歌曲
export const getSongsList = (data) => {
  return service.get(`/playlist/track/all?id=${data}`)
}
//获取歌曲的歌词
export const getMusicLyric = (data) => {
  return service.get(`/lyric?id=${data}`)
}
