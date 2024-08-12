// http.ts 文件的核心目的
// 1、配置基准地址  2、配置拦截器   3、配置请求函数(响应拦截器)
import configService from "./config.service.js";
import { useUserStore } from "@/stores/modules/userStore.js"
const baseURL = configService.apiUrl;

// 2、配置拦截器  ====================
// 拦截 request 发生请求
// 拦截 uploadFile 文件上传
const httpInterceptor = {
  // 拦截器触发
  invoke(options) {
    // 1. 非http开头需拼接地址
    if (!options.url.startsWith('/http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时
    options.timeout = 10000
    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header,
    }
    // 4. 添加token请求头标识
    const userStore = useUserStore()
    const token = userStore.getToken()?.token
    if (token) {
      options.header.Authorization = token
    }
  }
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)


// 3、配置请求函数(响应拦截器)  ====================
export const http = (options) => {
  // 1. 返回 Promise 对象
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // 状态码 2xx 
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 3.1 401错误  -> 清理用户信息，跳转到登录页 
          const userStore = useUserStore()
          userStore.clearStorageSync()
          uni.navigateTo({ url: '/pages/login/index' })
          reject(res)
        } else {
          //  3.2 其他错误 -> 根据后端错误信息轻提示  
          uni.showToast({
            icon: 'none',
            title: (res.data).msg || '请求错误'
          })
          reject(res)
        }
      },
      fail(err) {
        // 3.3 网络错误 -> 提示用户换网络
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      }
    })
  })
}