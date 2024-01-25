import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag, Modal, Popover, Input } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import {
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import {
	changeStatus,
	saleProjectAdd,
} from "../../../api/ailuo/sale";
import { MainStatus } from "../../../api/ailuo/dict";
import warnSvg from "../assets/warning.svg";
import { approveInfo } from "../../../api/ailuo/approve";
import _ from "lodash";
import { noticeAdd } from "../../../api/ailuo/notice";
import { columns } from "./CustomModal";
const { TextArea } = Input;
const PublicAddEditorRoot = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	.warp{
		width: 600px;
		height: 100%;
		padding: 24px 40px 24px 40px;
		overflow: hidden;
	}
	.header {
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.title {
			font-size: 18px;
			font-family: "Harmony_Sans_Medium", sans-serif;
		}
	}
	.status-operate {
		margin-top: 8px;
		margin-bottom: 16px;
	}
	.content {
		height: calc(100% - 80px);
		max-width: 600px;
		overflow: overlay;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 24px;
	}
`;

interface CustomModalProps {
}
const excludeNull = (obj: any) => {
	const result: any = {};
	Object.keys(obj).forEach((key) => {
		if (obj[key] === undefined || obj[key] === null) {
			return;
		}
		result[key] = obj[key];
	});
	return result;
};



const CustomModalContext = React.createContext({});

const PublicAddEditor: React.FC<CustomModalProps> = ({
}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});



	useEffect(() => {
		if (!open) {
			return;
		}
		setForm({
			currency: "人民币",
		});

	}, [open]);

	// 新增记录
	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		try {
			await inputForm.validateFields();
			console.log("Received values of form: ", form);
			if (!form.status) {
				form.status = "not_started";
			}
			try {
				form.typeSelection = JSON.stringify(form.typeSelection);
				form.modeTrade = JSON.stringify(form.modeTrade);
				form.payType = JSON.stringify(form.payType);
			} catch (error) { }
			await saleProjectAdd(excludeNull(form));
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		inputForm.setFieldsValue(form);
		createRecord();

	};

	// 通知模块
	const notifyHandler = async (
		form: any,
		status: MainStatus[keyof MainStatus],
	) => {
		try {
			// 通知 终审人员
			if (status === MainStatus.QuotationReview) {
				const res = await approveInfo(); // 审批信息
				let list = _.get(res, "data.record", []);
				const allP = list.map((item: any) => {
					const params: any = {
						recipientId: item.relationUserId,
						content: {
							status: status,
							msg: `您的工单: <${form.name}> 需要审批`,
							saleId: form.id,
						},
					};
					console.log(11, params);
					params.content = JSON.stringify(params.content);
					return noticeAdd(params);
				});
				await Promise.all(allP);
			}
			// 同意后 通知报价单创建人
			if (status === MainStatus.Approved) {
				const { createBy } = form; // 创建人id
				if (!createBy) return;
				const params: any = {
					recipientId: createBy,
					content: {
						status: status,
						msg: `您的工单: <${form.name}> 审批通过`,
						saleId: form.id,
					},
				};
				params.content = JSON.stringify(params.content);
				await noticeAdd(params);
			}
			// 审批拒绝 通知报价单创建人
			if (status === MainStatus.ReviewFailed) {
				const { createBy } = form; // 创建人id
				if (!createBy) return;
				const params: any = {
					recipientId: createBy,
					content: {
						status: status,
						msg: `您的工单: <${form.name}> 已被驳回
							    驳回理由: ${form.remark}`,
						saleId: form.id,
					},
				};
				params.content = JSON.stringify(params.content);
				await noticeAdd(params);
			}
		} catch (error) {
			console.log(error);
		}
	};
	// 修改审批状态
	const changeProcess = async (
		form: any,
		status: MainStatus[keyof MainStatus],
	) => {
		try {
			const { id } = form;
			if (status === MainStatus.ReviewFailed) {
				await changeStatus({ id, status, remark: form.remark } as any);
			} else {
				await changeStatus({ id, status });
			}
			await notifyHandler(form, status);
		} catch (error) {
			console.log(error);
		}
	};
	const StatusView = () => {
		if (!form) {
			return;
		}
		const { id, status } = form;
		// 未启动 开始处理
		if (id && (status === "not_started" || !status)) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
							{"未启动"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={() => {
								changeProcess(form, MainStatus.Processing);
							}}
						>
							{"开始处理"}
						</Tag>
					</div>
				</div>
			);
		}
		// 未启动
		return (
			<div className="status-operate flex">
				<div className="flex">
					<div className="mr-2">状态: </div>
					<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
						{"未启动"}
					</Tag>
				</div>
				<div className="hidden">
					<div className="mr-2">操作: </div>
					<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
						{"开始处理"}
					</Tag>
				</div>
			</div>
		);
	};

	return (
		<PublicAddEditorRoot>
			<div className="warp">
				<div className="header">
					<div className="title">{'新建报价'}</div>

				</div>
				{StatusView()}
				<div className="content">
					<Form
						form={inputForm}
						name="recordForm"
						colon={false}
						wrapperCol={{ flex: 1 }}
						preserve={false}
					>
						{showDstColumns.length > 0 ? (
							<CellEditorContext
								form={form}
								setForm={setForm}
								dstColumns={showDstColumns}
								modalType={'add'}
							/>
						) : (
							<NoFieldData />
						)}
					</Form>
				</div>
				<div className="footer">
					<ConfigProvider theme={greyButtonTheme}>
						<Button type="primary" onClick={handleSaveRecord}>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button type="primary" onClick={handleSaveRecord}>
							创建
						</Button>
					</ConfigProvider>
				</div>
			</div>


		</PublicAddEditorRoot>
	);
};

export default PublicAddEditor;
