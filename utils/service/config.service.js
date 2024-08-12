let BASE_URL = ''


if (process.env.NODE_ENV == 'development') {
	BASE_URL = 'https://platform.yundazhihui.cn/jeecg-boot' // 开发环境
} else {
 BASE_URL = '' // 生产环境
}

const configService = {
	apiUrl: BASE_URL,
};

export default configService
