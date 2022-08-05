import Cookies from 'js-cookie'

// cookie
// 怎么操作cookie
// 借助第三方库

// document.cookie = 'key=value&key=value'

// localStorage.setItem('')
const TokenKey = 'hrsass_token'
const timeKey = 'hrsaas-timestamp-key'

export function getTimeStamp() {
  return Cookies.get(timeKey)
}

export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

