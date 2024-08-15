<template>
  <view style="height: 100vh; background: #fff">
    <view class="img-a">
      <view class="txt">
        您好，
        <br />
        欢迎使用，xxxx
      </view>
    </view>
    <view class="login-view">
      <view class="t-login">
        <!-- 使用 uv-tabs 组件实现登录方式切换 -->
        <uv-tabs :list="list" @click="clickTab" lineWidth="80">
          <div v-for="(item) in list" :key="item.id" class="tab-item" :class="{ active: isPassword === item.id }"
            @click="clickTab(item.id)">
            {{ item.name }}
          </div>
        </uv-tabs>
        <view class="login-form">
          <!-- 密码登录表单 -->
          <view v-if="isPassword == 1" id="form1" key="form1">
            <uv-form labelPosition="top" ref="form1" labelWidth="120">
              <uv-form-item label="账号" prop="username" borderBottom>
                <uv-input v-model.trim="username" type="text" placeholder="请输入账号" border="none">
                </uv-input>
              </uv-form-item>
              <uv-form-item label="密码" prop="password" borderBottom>
                <uv-input v-model.trim="password" :type="isPass" placeholder="请输入密码" border="none">
                  <template v-slot:suffix>
                    <uv-icon style="height: 30rpx" :name="eyeIcon" @click="isEye" size="22"></uv-icon>
                  </template>
                </uv-input>
              </uv-form-item>
            </uv-form>
          </view>
          <!-- 验证码登录表单 -->
          <view v-else="isPassword == 2" id="form2" key="form2">
            <uv-form labelPosition="top" ref="form2" labelWidth="120">
              <uv-form-item label="手机号" prop="mobile" borderBottom>
                <uv-input v-model.trim="mobile" type="number" maxlength="11" placeholder="请输入手机号" border="none">
                </uv-input>
              </uv-form-item>
              <uv-form-item label="验证码" prop="captcha" borderBottom>
                <uv-input v-model.trim="captcha" type="number" maxlength="6" placeholder="请输入验证码" border="none">
                  <template v-slot:suffix>
                    <view style="height: 30rpx" @tap="getCode" :disabled="countdownActive">
                      {{
                        countdown > 0
                          ? `${countdown}秒后重新获取`
                          : "获取验证码"
                      }}
                    </view>
                  </template>
                </uv-input>
              </uv-form-item>
            </uv-form>
          </view>
        </view>
        <button class="onLogin" @tap="onLogin()">登 录</button>
        <view class="reg" @tap="reg">注册</view>
        <!-- 第三方账号登录 -->
        <view class="t-f">
          <text>—————— 第三方账号登录 ——————</text>
        </view>
        <view class="t-e cl">
          <view class="t-g" @tap="wxLogin()">
            <image src="https://zhoukaiwen.com/img/loginImg/wx.png"></image>
          </view>
          <view class="t-g" @tap="zfbLogin()">
            <image src="https://zhoukaiwen.com/img/loginImg/qq.png"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { login1, login2, sendCode } from "@/api/login/login.js";
import { useUserStore } from '@/stores/modules/userStore.js'
// tabs显示
const list = ref([
  { name: "密码登录", id: 1 },
  { name: "手机号登录", id: 2 },
]);

// form表单 用户名登录
const username = ref('');
const password = ref('');
const mobile = ref('');
const captcha = ref('');

// 处理密码显示与隐藏
const eyeIcon = ref("eye-off");
const isPass = ref("password");
const isEye = () => {
  if (eyeIcon.value == "eye-off") {
    eyeIcon.value = "eye";
    isPass.value = "text";
  } else {
    eyeIcon.value = "eye-off";
    isPass.value = "password";
  }
};

// 控制显示哪个表单
const isPassword = ref(1);

// 切换表单
const clickTab = (index) => {
  isPassword.value = index.id;
  if (isPassword.value === 1) {
    username.value = "";
    password.value = "";
  } else if (isPassword.value === 2) {
    mobile.value = "";
    captcha.value = "";
  }
};

// 定义验证码倒计时和状态
const countdown = ref(0);
const countdownActive = ref(false);
const startCountdown = () => {
  if (countdownActive.value) return;
  countdown.value = 60;
  countdownActive.value = true;
  const intervalId = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(intervalId);
      countdownActive.value = false;
    }
  }, 1000);
};

// 手机号校验逻辑
const validateMobile = (mobile) => {
  const mobileRegex = /^1\d{10}$/;
  if (mobile === "") {
    uni.showToast({ title: "请输入手机号", icon: "none" });
    return false;
  }
  if (!mobileRegex.test(mobile)) {
    uni.showToast({ title: "请输入正确的手机号", icon: "none" });
    return false;
  }
  return true;
};

// 定义点击获取验证码的方法
const getCode =async () => {
  try {
    if (validateMobile(mobile.value)) {
      startCountdown();
      let params = { mobile: mobile.value, smsmode: "0", messageSource: "2" };
      console.log(params, 'params');
   await sendCode(params);
    }
  } catch (error) {
    //显示错误信息
    uni.showToast({ title: error.message, icon: "none" });
  }
};

// 点击登录按钮 主要是验证必填和登录方式
const onLogin = () => {
  if (isPassword.value === 1) {
    if (username.value === "") {
      return uni.showToast({ title: "请输入用户名", icon: "none" });
    }
    if (password.value === "") {
      return uni.showToast({ title: "请输入密码", icon: "none" });
    }
    // 进行 Base64 编码
    const encodedPassword = btoa(password.value);
    // 提交加密后的密码
    getLogin1(username.value, encodedPassword);
  } else if (isPassword.value === 2) {
    if (!validateMobile(mobile.value)) {
      return;
    }
    if (captcha.value === "") {
      return uni.showToast({ title: "请输入验证码", icon: "none" });
    }
    getLogin2()
  }
};
const token = ref('')
// 密码方式登录
const getLogin1 = async (username, encodedPassword) => {
  let params = { username: username, password: encodedPassword, isPassword: 1 };
  const userStore = useUserStore()
  const res = await login1(params)
  if (res.data.code) {
    token.value = res.data.result.token
    userStore.setToken(res.data.result.token)// 保存 token
    uni.redirectTo({
      url: '/pages/index/index' // 确保路径是正确的
    });
    uni.showToast({ title: res.data.message, icon: "none" });
  } else {
    //显示错误信息
    uni.showToast({ title: res.data.message, icon: "none" });
  }
}
// 验证码方式登录
const getLogin2 = () => {

}
// 注册页面跳转
const reg = () => {
  uni.showToast({ title: "注册跳转,暂未开发联系开发人员", icon: "none" });
};

// 第三方登录 - 微信
const wxLogin = () => {
  uni.showToast({ title: "微信登录,暂未开发联系开发人员", icon: "none" });
};

// 第三方登录 - 支付宝
const zfbLogin = () => {
  uni.showToast({ title: "QQ登录,暂未开发联系开发人员", icon: "none" });
};
</script>

<style scoped>
.txt {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  padding: 120rpx 0 0 20rpx;
}

.img-a {
  width: 100%;
  height: 360rpx;
  background-image: url(https://zhoukaiwen.com/img/loginImg/head.png);
  background-size: 100%;
}

.reg {
  font-size: 28rpx;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 50rpx;
  font-weight: bold;
  background: #f5f6fa;
  color: #000000;
  text-align: center;
  margin-top: 30rpx;
}

.login-view {
  width: 100%;
  position: relative;
  margin-top: -120rpx;
  background-color: #ffffff;
  border-radius: 8% 8% 0% 0;
}

.login-form {
  margin-top: 40rpx;
}

.t-login {
  width: 600rpx;
  margin: 0 auto;
  font-size: 28rpx;
  padding-top: 40rpx;
}

.onLogin {
  margin-top: 50rpx;
  font-size: 28rpx;
  background: #2796f2;
  color: #fff;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 50rpx;
  font-weight: bold;
}

.t-login .t-c {
  position: absolute;
  right: 22rpx;
  top: 22rpx;
  background: #5677fc;
  color: #fff;
  font-size: 24rpx;
  border-radius: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  padding: 0 25rpx;
}

.t-login .t-d {
  text-align: center;
  color: #999;
  margin: 80rpx 0;
}

.t-login .t-e {
  text-align: center;
  width: 250rpx;
  margin: 80rpx auto 0;
}

.t-login .t-g {
  float: left;
  width: 50%;
}

.t-login .t-e image {
  width: 50rpx;
  height: 50rpx;
}

.t-login .t-f {
  text-align: center;
  margin: 150rpx 0 0 0;
  color: #666;
}

.t-login .t-f text {
  margin-left: 20rpx;
  color: #aaaaaa;
  font-size: 27rpx;
}

.t-login .uni-input-placeholder {
  color: #aeaeae;
}

.cl {
  zoom: 1;
}

.cl:after {
  clear: both;
  display: block;
  visibility: hidden;
  height: 0;
  content: "\20";
}
</style>
