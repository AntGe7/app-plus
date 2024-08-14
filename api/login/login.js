// 登录函数
// function login(username, password) {
//     const encodedPassword = btoa(password); // Base64 编码密码
//     return new Promise((resolve, reject) => {
//         uni.request({
//             url: `/sys/login`,
//             method: 'POST',
//             data: {
//                 username,
//                 password: encodedPassword
//             },
//             success: (res) => {
//                 if (res.statusCode === 200) {
//                     resolve(res.data);
//                 } else {
//                     reject(res.data);
//                 }
//             },
//             fail: (err) => {
//                 reject(err);
//             }
//         });
//     });
// }
export const login1 = (data) => {
	return uni.request({
		url: '/user/login',
		method: 'POST',
		data
	});
};

export const login2 = (data) =>{
	return uni.request({
		url: '/user/phoneLoginPC',
		method: 'POST',
		data
	})
}
export const sendCode=(data)=> {
	return uni.request({
		url: '/sms/send/verifyCode',
		method: 'POST',
		data
	})
}
// // 发送验证码
// function sendCode(phone) {
//     return new Promise((resolve, reject) => {
//         uni.request({
//             url: '/sys/sendCode',
//             method: 'POST',
//             data: {
//                 phone
//             },
//             success: (res) => {
//                 if (res.statusCode === 200) {
//                     resolve(res.data);
//                 } else {
//                     reject(res.data);
//                 }
//             },
//             fail: (err) => {
//                 reject(err);
//             }
//         });
//     });
// }

// // 导出API方法
// export default {
//     login1,
//     login2,
//     sendCode,
// };
