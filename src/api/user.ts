import { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { apiCall, AxiosFactory } from "../network";

class AnotherAxiosFactory extends AxiosFactory {
	interceptors(instance: AxiosInstance) {
		// / 响应拦截
		instance.interceptors.response.use(
			response => {
				return response.data;
			},
			(error: any) => {
				this.errorHandle(error);
				return Promise.reject(error);
			}
		);
	}
}

const baseURL = process.env.REACT_APP_BASE_SERVER_URL;
const flowConfig: CreateAxiosDefaults = {
	timeout: 5000,
	withCredentials: true,
	baseURL,
	headers: {
		"Content-Type": "application/json; charset=utf-8"
	}
};
const axiosFactory = new AnotherAxiosFactory();
const ins = axiosFactory.getInstance();

function userApiCall(options: AxiosRequestConfig) {
	const requestOptions = Object.assign({}, flowConfig, options);
	return ins(requestOptions);
}

export function userProfile() {
	return apiCall({
		url: "api/sys/user/profile",
		method: "get"
	});
}

export function userRegister(data: any) {
	return userApiCall({
		url: "/api/sys/user/register",
		method: "post",
		data
	});
}
interface userRegisterEmailParams {
	email: string;
}

export function userRegisterEmail(data: userRegisterEmailParams) {
	return userApiCall({
		url: "/api/sys/user/register_email",
		method: "post",
		data
	});
}
interface userLoginParams {
	username: string;
	password: string;
}

export function userLogin(data: userLoginParams) {
	return userApiCall({
		url: "/api/login",
		method: "post",
		params: {
			username: data.username,
			password: data.password
		}
	});
}

interface sendCaptchaParams {
	email: string;
}
export function sendCaptcha(data: sendCaptchaParams) {
	return userApiCall({
		url: "/api/sys/sysCaptcha/send",
		method: "post",
		data
	});
}

interface UserUpdateParams {
	enable: boolean;
	gender: string;
	nickname: string;
	username: string;
	password: string;
	email: string;
	phone: string;
	postId: string;
	deptId: string;
	remark: string;
	avatar: string;
}
export function userUpdate(data: Partial<UserUpdateParams> & { id: string }) {
	return apiCall({
		url: "api/sys/user/edit",
		method: "PUT",
		data
	});
}
// 修改 密码 user/password/edit

export function pwdUpdate(data: { newPassword: string; oldPassword: string; userId: string }) {
	return apiCall({
		url: "api/sys/user/password/edit",
		method: "PUT",
		data
	});
}

// 重置密码
export function resetPwd(data: { email: string; code: string; password: string }) {
	return apiCall({
		url: "api/sys/user/password/reset/email",
		method: "post",
		data
	});
}

// 修改邮箱密码
export function resetMail(data: { email: string; code: string; userId: string }) {
	return apiCall({
		url: "api/sys/user/reset/email",
		method: "post",
		data
	});
}

// 注销
export function logout() {
	return apiCall({
		url: "api/logout",
		method: "get"
	});
}

// 用户列表
export function accountList() {
	return apiCall({
		url: "api/sys/user/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 999
		}
	});
}
