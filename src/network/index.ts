import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";

export class AxiosFactory {
	interceptors(instance: AxiosInstance) {
		// / 请求拦截
		instance.interceptors.request.use(
			config => {
				// / 权鉴相关
				const token = localStorage.getItem("Authorization");
				const tokenKey = localStorage.getItem("Authorization-key");

				if (!config.headers) {
					config.headers = {} as any;
				}
				if (token) {
					config.headers!["Authorization"] = token;
				}
				if (tokenKey) {
					config.headers!["Authorization-key"] = tokenKey;
				}
				return config;
			},
			error => {
				return Promise.reject(error);
			}
		);
		// / 响应拦截
		instance.interceptors.response.use(
			response => {
				// 502 过期
				if ([502].includes(response.data.code)) {
					console.error("登录过期");
					console.log("error", response.data);
					window.location.href = "/login";
				}
				// token缺失
				if ([503].includes(response.data.code)) {
					console.error("token缺失");
					console.log("error", response.data);
					window.location.href = "/login";
				}
				return response.data;
			},
			(error: any) => {
				this.errorHandle(error);
				return Promise.reject(error);
			}
		);
	}

	errorHandle = function (error: any) {
		const response = error.response;
		const message = error.message;
		console.log("errorHandle");
		if (response) {
			if (response.status === 404) console.error("接口不存在");
		} else {
			if (message === "Network Error") console.error("连接异常");

			if (message.includes("timeout")) console.error("请求超时");

			if (message.includes("Request failed with status code")) {
				console.error("接口异常");
			}
		}
	};

	getInstance() {
		const instance = axios.create();
		this.interceptors(instance);
		return instance;
	}
}
// TODO 后续改成配置
const baseURL = process.env.REACT_APP_BASE_SERVER_URL;

const flowConfig: CreateAxiosDefaults = {
	timeout: 5000,
	withCredentials: true,
	baseURL,
	headers: {
		"Content-Type": "application/json; charset=utf-8"
	}
};

const axiosFactory = new AxiosFactory();
const ins = axiosFactory.getInstance();

export function apiCall(options: AxiosRequestConfig): Promise<any> {
	const requestOptions = Object.assign({}, flowConfig, options);
	return ins(requestOptions);
}

const uploadConfig: CreateAxiosDefaults = {
	timeout: 5000,
	withCredentials: true,
	baseURL,
	headers: {
		"Content-Type": "multipart/form-data"
	}
};

export function uploadApiCall(options: AxiosRequestConfig): Promise<any> {
	const requestOptions = Object.assign({}, uploadConfig, options);
	return ins(requestOptions);
}
