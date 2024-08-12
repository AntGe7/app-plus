import App from './App'
import uvUI from '@/uni_modules/uv-ui-tools'
import { http } from '@/utils/service/service.js' 
import pinia from './stores/index'  
import { createSSRApp } from 'vue'
export function createApp() {
	
  const app = createSSRApp(App)
  // app.config.globalProperties.$http = http; 
  app.use(uvUI);
  app.use(pinia);
  return {
    app
  }
}
