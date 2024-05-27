import service from '@/utils/request'
//获取轮播图
export const getBanner = () => {
  return service.get('/banner?type=2')
}
//获取发现好歌单，限制为8条
export const getMusicList = () => {
  return service.get('/personalized?limit=8')
}
//手机登录要求验证了，改为游客登录
export const getPhoneLogin = () => {
  return service.get('/register/anonimous')
}
//搜索
export const getSearchMusic = (data) => {
  return service.get(`/search?keywords=${data}`)
}
//获取用户详情
export const getLoginUser = (data) => {
  return service.get(`/user/detail?uid=${data}`)
}
