const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes,
  companyName: state => state.user.userInfo.companyName,
  staffPhoto: state => state.user.userInfo.staffPhoto
  // name: state => state.user.name
}
export default getters
