import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref('');

  // 设置 token
  function setToken(newToken) {
    token.value = newToken;
  }

  // 获取 token
  function getToken() {
    return token.value;
  }

  // 清除 token
  function clearToken() {
    token.value = '';
  }

  return { token, setToken, getToken, clearToken };
}, {
  persist: {
    storage: {
      setItem(key, value) {
        uni.setStorageSync(key, value);
      },
      getItem(key) {
        return uni.getStorageSync(key);
      },
      removeItem(key) {
        uni.removeStorageSync(key); 
      }
    },
  }
});
