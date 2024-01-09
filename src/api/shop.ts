// 支付 订单
import { apiCall } from "../network";

// 获取会员列表
export function userGradeList() {
	return apiCall({
		url: "/api/sys/sysUserGrade/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 10
		}
	});
}

// 下单
export function generateOrder(data: { gradeId: string }) {
	return apiCall({
		url: "/api/sys/omsOrder/generateOrder",
		method: "post",
		data
	});
}

// 支付
export function toPayAsPC(data: { orderSn: string; payType: number }) {
	return apiCall({
		url: "/api/sys/omsOrder/toPayAsPC",
		method: "post",
		data
	});
}

// 查询订单

export function orderDetail(data: { orderSn: string }) {
	return apiCall({
		url: "/api/sys/omsOrder/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 10,
			...data
		}
	});
}
