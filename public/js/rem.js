/**
 * 获取设备宽度,window.innerWidth返回整个窗口的宽度
 */
function remSize() {
  let deviceWidth = document.documentElement.clientWidth || window.innerWidth
  if (deviceWidth >= 750) {
    deviceWidth = 750
  } else if (deviceWidth <= 320) {
    deviceWidth = 320
  }
  //750px-->1rem=100px,
  document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
  //设置body字体
  document.querySelector('body').style.fontSize = 0.3 + 'rem'
}
remSize()
//窗口发生变化时调用
window.addEventListener('resize', () => {
  remSize()
})
