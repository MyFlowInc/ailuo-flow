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

export interface LoginForm {
	username: string;
	password: string;
}
export function userLogin(data: LoginForm): Promise<any> {
	const params = {
		// test
		username: data.username || "admin",
		password: data.password || "admin",
		captchaKey: "025ee18c-8f9c-4421-9176-04b655bbb606",
		captchaCode: "acm67",
		captchaImage:
			"data:image/png;base64,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"
	};

	return apiCall({
		url: "api/login",
		method: "post",
		params
	});
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
interface userLoginEmailParams {
	email: string;
	password: string;
}

export function userLoginmail(data: userLoginEmailParams) {
	return userApiCall({
		url: "/api/sys/user/login_email",
		method: "get",
		params: data
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
