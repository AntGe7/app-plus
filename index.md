src/
|-- api/
|   |-- login/
|            |-- login.js  (登录接口\获取验证码)
|-- pages/   (页面)
|        |-- login📃 docs(增加文档 开发中问题): (登录页面)    
|-- static/ (静态资源)
|-- store/  (pinia状态管理)
|        |-- modules (模块)
|        |-- index.js (状态管理入口)
|                   |-- userStore.js (登录信息)
|-- utils/   (全局工具)
|         |--server   
|                  |--server.js (配置拦截器)
|                  |--config.service.js(.env)



### 遇到的坑
##### 1.登录页面 tabs切换
在H5中，tabs切换时，v-if第二次切换会导致form表单出问题,采用v-show
##### 2.登录页面 from表单没有用对象形式
在H5中，取不到form表单的值
##### 3.打包ios时候

```json
		"app-plus": {
	"titleNView": false, // 禁用原生导航栏
	"bounce": "none" ,// 禁止页面弹性滑动
	"softinputMode": "adjustResize" // 设置软键盘弹出时调整页面大小    安卓不需要 ios需要
},
```
