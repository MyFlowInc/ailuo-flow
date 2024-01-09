import React, { useEffect, useState } from "react";
import flowSvg from "./flow-icon.svg";
import closeSvg from "./close.svg";
import logoSvg from "./logo.svg";
import voiceSvg from "./voice.svg";
import sendSvg from "./send.svg";
import { Input, Modal } from "antd";
import styled from "styled-components";
import store from "../../../store";
import _ from "lodash";
interface GptIconProps {
	className?: string;
	user?: any;
}

const getTableDefine = () => {
	const state = store.getState();
	const { curTableColumn, curTableRecords, curStatusFieldId, curFlowDstId, WorkflowList } = state.workflow;
	const flowName = _.find(WorkflowList, { dstId: curFlowDstId })?.dstName || "未知";

	const fieldConfig = _.find(curTableColumn, { fieldId: curStatusFieldId })?.fieldConfig || {};
	const options = _.get(fieldConfig, "property.options") || [];
	const cols = curTableColumn
		.map(item => {
			return item.name;
		})
		.join(",");
	const colFieldIds = curTableColumn.map(item => item.fieldId);
	const rows = curTableRecords
		.map(item => {
			return colFieldIds.map(colFieldId => {
				if (colFieldId === curStatusFieldId) {
					const v = item[colFieldId];
					return _.find(options, { id: v })?.name || "";
				}
				return item[colFieldId];
			});
		})
		.map(item => item.join(","))
		.join(" \n ");
	console.log(11, cols, rows);
	return { cols, rows, flowName };
};
const GptRoot = styled.div`
	display: flex;
	flex-direction: column;
	height: 462px;
	.ant-modal-content {
		padding: 0;
	}
	.header {
		display: flex;
		height: 54px;
		padding: 0 16px;
		background: #eef6ff;
		align-items: center;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.title {
				font-family: HarmonyOS Sans;
				font-size: 18px;
				font-weight: normal;
				line-height: 20px;
				letter-spacing: 0px;
				color: #a9b5ef;
			}
		}
	}
	.content {
		flex: 1;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}
	.send {
		height: 102px;
		opacity: 1;
		background: #ffffff;
		box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
		.send-content {
			position: relative;
		}
		.send-svg {
			position: absolute;
			bottom: 8px;
			right: 8px;
		}
	}
	.agent-msg-content {
		position: relative;
		padding: 12px;
		margin: 16px 32px;
		max-width: 200px;
		min-width: 48px;
		border-radius: 0px 3.98px 3.98px 3.98px;
		opacity: 1;
		background: linear-gradient(103deg, #60a9f6 1%, #2a8bf2 99%);
		box-shadow:
			3.98px 3.98px 9.94px 0px rgba(42, 139, 242, 0.1),
			5.96px 5.96px 13.92px 0px rgba(42, 139, 242, 0.05),
			3.98px 3.98px 19.88px 0px rgba(42, 139, 242, 0.1);
		.voice {
			display: none;
			position: absolute;
			bottom: 8px;
			right: 8px;
		}
		:hover .voice {
			display: block;
			cursor: pointer;
		}
	}
	.user-msg-content {
		max-width: 200px;
		min-width: 48px;
		padding: 12px;
		margin: 16px 32px;
		opacity: 1;
		background: #ffffff;
		box-sizing: border-box;
		border-radius: 3.98px 3.98px 3.98px 0px;
		border: 0.4px solid rgba(112, 124, 151, 0.25);
		box-shadow:
			3.98px 3.98px 9.94px 0px rgba(112, 124, 151, 0.05),
			5.96px 5.96px 13.92px 0px rgba(112, 124, 151, 0.05),
			3.98px 3.98px 19.88px 0px rgba(112, 124, 151, 0.03);
	}
	.agent-txt {
		opacity: 1;
		font-family: HarmonyOS Sans;
		font-size: 12px;
		font-weight: 300;
		line-height: 20px;
		letter-spacing: 0px;
		color: #ffffff;
	}
	.user-txt {
		font-family: HarmonyOS Sans;
		font-size: 12px;
		color: #707c97;
		font-weight: 400;
	}
`;

const MsgContainer = (props: any) => {
	const { info } = props;
	const { msg, role, voice } = info;
	// const voiceHandle = () => {
	// 	console.log(222, msg);
	// 	const speech = new SpeechSynthesisUtterance();
	// 	speech.text = msg;
	// 	speech.lang = "zh-CN";
	// 	speechSynthesis.speak(speech);
	// };
	// 获取声音
	const voiceHandle = async () => {
		try {
			const response = await fetch("https://www.flowchat.work/api/chat/t2s?input=" + msg, {
				method: "get",
				headers: { "Content-Type": "application/json" }
			});
			const arrayBuffer = await response.arrayBuffer();

			// 创建一个新的AudioContext对象
			const audioContext = new AudioContext();

			// 解码音频数据
			const decodedData = await audioContext.decodeAudioData(arrayBuffer);

			// 创建一个新的AudioBufferSourceNode
			const source = audioContext.createBufferSource();

			// 将解码后的音频数据设置为AudioBufferSourceNode的buffer属性
			source.buffer = decodedData;

			// 连接到音频输出设备（扬声器）
			source.connect(audioContext.destination);

			// 播放音频
			source.start();
		} catch (error) {
			// 处理错误
			console.error("Error:", error);
		}
	};
	if (role === "agent") {
		return (
			<div className="flex w-full">
				<div className="agent-msg-content">
					<div className="agent-txt">{msg}</div>
					<img className="voice" src={voiceSvg} onClick={voiceHandle} />
				</div>
			</div>
		);
	}
	return (
		<div className="flex justify-end">
			<div className="user-msg-content">
				<div className="user-txt">{msg}</div>
				{voice && <img className="voice" src={voiceSvg} />}
			</div>
		</div>
	);
};

export const GptIcon: React.FC<GptIconProps> = props => {
	const { className, user } = props;

	const [modalOpen, setmodalOpen] = useState(false);
	const { TextArea } = Input;
	const [curMsg, setCurMsg] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		console.log("Change:", e.target.value);
		setCurMsg(e.target.value);
	};
	const [msgList, setMsgList] = useState([
		{
			role: "agent", // agent or user
			time: "今天 " + "11:11",
			msg: "您好，我是您的MyFlow AI助手！ 描述您的问题",
			voice: true
		}
		// {
		// 	role: "user", // agent or user
		// 	time: "今天 " + "11:11",
		// 	msg: "根据此页的表格数据，你对我有什么建议？"
		// }
	]);
	// 只发一次
	useEffect(() => {
		// modalOpen && sendDefaultMsg();
	}, [modalOpen]);
	// 修改体验
	const sendDefaultMsg = async () => {
		const { cols, rows, flowName } = getTableDefine();
		const content = `给你一张名字为${flowName}的表格，她的表头是${cols}，表格内容是${rows}，根据给你的这些数据，帮我做一次总结归纳`;
		const ref: any = [
			...msgList,
			{
				role: "agent", // agent or user
				time: "今天 " + "11:11",
				msg: "思考中..."
			}
		];
		setMsgList(ref);
		setTimeout(async () => {
			const response: any = await fetch("https://www.flowchat.work/api/chat/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: 1 || "", content: content })
			});
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			ref[ref.length - 1].msg = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				const str = decoder.decode(value);
				const txt = str.replaceAll("data: ", "").replaceAll("\n", "");
				ref[ref.length - 1].msg = ref[ref.length - 1].msg + txt;
				setMsgList([...ref]);
			}
		});
	};

	// 多次发送
	const sendMsg = async () => {
		const ref: any = [
			...msgList,
			{ role: "user", time: "今天 " + "11:11", msg: curMsg },
			{
				role: "agent", // agent or user
				time: "今天 " + "11:11",
				msg: "思考中..."
			}
		];

		setMsgList(ref);
		setCurMsg("");
		setTimeout(() => {
			const container = document.getElementById("gpt-chat-content");
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
		});
		setTimeout(async () => {
			const { cols, rows, flowName } = getTableDefine();
			const content = `给你一张名字为${flowName}的表格，她的表头是${cols}，表格内容是${rows},根据给你的这些数据，回答我接下来问的问题，我的问题是: `;
			const response: any = await fetch("https://www.flowchat.work/api/chat/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: 1 || "", content: content + curMsg })
			});
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			ref[ref.length - 1].msg = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				const str = decoder.decode(value);
				const txt = str.replaceAll("data: ", "").replaceAll("\n", "");
				ref[ref.length - 1].msg = ref[ref.length - 1].msg + txt;
				setMsgList([...ref]);
			}
			const container = document.getElementById("gpt-chat-content");
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
		});
	};

	return (
		<div className={className}>
			{!modalOpen && <img src={flowSvg} onClick={() => setmodalOpen(true)} />}
			<Modal
				mask={false}
				style={{
					position: "absolute",
					top: "calc(100% - 492px)",
					right: "1%"
				}}
				styles={{
					content: {
						padding: 0
					}
				}}
				open={modalOpen}
				title={null}
				footer={null}
				width={340}
				closeIcon={null}
				onOk={() => setmodalOpen(false)}
				onCancel={() => setmodalOpen(false)}>
				<GptRoot>
					<div className="header">
						<div className="left">
							<img src={logoSvg} />
							<div className="title">Myflow AI</div>
						</div>

						<img src={closeSvg} onClick={() => setmodalOpen(false)} />
					</div>
					<div className="content" id="gpt-chat-content">
						{msgList.map((item, index) => (
							<MsgContainer key={"msg_" + index} info={item} />
						))}
					</div>
					<div className="send flex items-center justify-center">
						<div className="send-content">
							<TextArea
								onKeyDown={e => e.key === "Enter" && sendMsg()}
								onChange={onChange}
								value={curMsg}
								placeholder="请输入内容"
								style={{ height: 76, width: 263, resize: "none" }}
							/>
							<img className="send-svg" src={sendSvg} onClick={sendMsg} />
						</div>
					</div>
				</GptRoot>
			</Modal>
		</div>
	);
};
