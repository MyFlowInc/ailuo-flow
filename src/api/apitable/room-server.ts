/**
 *  // 定义消息类型
    const msgTypeOnline = 1        // 上线
    const msgTypeOffline = 2       // 离线
    const msgTypeSend = 3          // 消息发送
    const msgTypeGetOnlineUser = 4 // 获取用户列表
    const msgTypePrivateChat = 5   // 私聊
 */

import { User } from "../../store/globalSlice";
import { msgCenter } from "./ws-update";

// WebSocket 连接地址
let host = "wss://myflow.work/ws";
if (process.env.NODE_ENV === "development") {
	host = "ws://114.55.54.199:8322/ws";
}
// 心跳消息内容
const heartbeatMessage = "heartbeat";
// 心跳检测时间间隔（毫秒）
const heartbeatInterval = 5000;
// 最大重连次数
const maxReconnectAttempts = 5;

// 记录最后一个心跳时间
let lastHeartbeatTime: any;

declare global {
	interface Window {
		ws: WebSocket | null;
	}
}

window.ws = null;

let reconnectAttempts = 0;
let heartbeatTimer: any;

let lastUserInfo: any;
let lastRoomId: any;

export function createWebSocket(userInfo: User, room_id: string) {
	// const host = window.location.hostname;
	if (!userInfo.id) {
		alert("无登录信息，请刷新页面重试");
		return false;
	}
	const send_data = JSON.stringify({
		status: 1,
		data: {
			uid: userInfo.id,
			room_id: room_id,
			username: userInfo.username
		}
	});

	// console.log(host)

	window.ws = new WebSocket(host); // 连接 WebSocket
	// console.log(window.ws)
	window.ws.onopen = function () {
		window.ws && window.ws.send(send_data);
		lastUserInfo = userInfo;
		lastRoomId = room_id;
		// 加入心跳机制
		// 初始化最后一个心跳时间为当前时间
		lastHeartbeatTime = Date.now();
		startHeartbeat();
	};

	window.ws.onmessage = function (evt: any) {
		// console.log(evt)
		lastHeartbeatTime = Date.now();

		const received_msg = JSON.parse(evt.data);
		// console.log('数据已接收...', received_msg)

		const myDate = new Date();
		const time = myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString();

		// let systemInfo;
		let newMsg;
		switch (received_msg.status) {
			// WARNING:
			// 对于case 1， 2 不要使用 msgContainer.value.innerHTML 直接操作 DOM！！！
			// 而是通过响应式数据来更新 DOM 可以在这些消息中添加一个额外的属性，例如 type，用于区分普通消息和系统消息。
			// 然后根据此属性在模板中使用不同的样式和显示方式。
			case 0:
				console.log("心跳正常");
				break;
			case 1:
				newMsg = {
					type: "system",
					content: `【${received_msg.data.username}】${time} 加入了房间`
				};
				console.log("广播数据", newMsg.content);
				// msgList.value.push(newMsg);
				break;
			case 2:
				newMsg = {
					type: "system",
					content: `【${received_msg.data.username}】${time} 离开了房间`
				};
				msgCenter(newMsg, userInfo, room_id);
				// msgList.value.push(newMsg);
				break;
			case 3:
				// 因为不是重新请求整个msgList，所以需要做一些小小的转换
				// 这里 newMsg 的格式是和后端 models.Message 的格式一致
				newMsg = {
					content: received_msg.data.content,
					created_at: received_msg.data.created_at,
					id: received_msg.data.id,
					room_id: received_msg.data.room_id,
					user_id: received_msg.data.uid,
					username: received_msg.data.username
				};
				msgCenter(newMsg, userInfo, room_id);
				// console.log(newMsg.content)
				// msgList.value.push(newMsg);
				break;
			case -1:
				window.ws && window.ws.close(); // 主动close掉
				console.log("client 连接已关闭...");
				break;
		}
	};

	window.ws.onclose = function () {
		// const systemInfo = `<li class="systeminfo"><span>` + "与服务器连接断开，请刷新页面重试" + `</span></li>`;
		const myDate = new Date();
		const time = myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString();
		console.log("serve 连接已关闭... " + time);
		stopHeartbeat();
	};

	window.ws.onerror = function (evt: any) {
		window.ws && window.ws.close();
		console.log("触发 onerror", evt);
	};
}

// 开始心跳检测
function startHeartbeat() {
	const websocket = window.ws;
	if (!websocket) {
		return;
	}
	heartbeatTimer = setInterval(() => {
		if (websocket.readyState === WebSocket.OPEN) {
			const currentTime = Date.now();
			// 如果距离上次心跳时间大于心跳检测时间间隔的两倍，则认为连接已断开
			if (currentTime - lastHeartbeatTime > heartbeatInterval * 2) {
				console.log("连接已断开，尝试重新连接...");
				// 关闭WebSocket连接
				websocket.close();
				reconnect();
			} else {
				websocket.send(heartbeatMessage);
			}
		}
	}, heartbeatInterval);
}

// 停止心跳检测
function stopHeartbeat() {
	clearInterval(heartbeatTimer);
}

// 重连 WebSocket
function reconnect() {
	if (reconnectAttempts < maxReconnectAttempts) {
		reconnectAttempts++;
		console.log("尝试重新连接，重连次数:", reconnectAttempts, lastUserInfo, lastRoomId);
		window.ws && window.ws.close();
		createWebSocket(lastUserInfo, lastRoomId);
	} else {
		console.log("超过最大重连次数，停止重连");
		reconnectAttempts = 0;
	}
}

window.addEventListener("beforeunload", e => {
	// 取消关闭或刷新操作
	e.preventDefault();
	window.ws && window.ws.close();
});
