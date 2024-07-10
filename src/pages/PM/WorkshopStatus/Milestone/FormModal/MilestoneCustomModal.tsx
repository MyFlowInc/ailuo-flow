import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Radio, message } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import _ from "lodash";
import { RadioChangeEvent } from "antd/lib";
import { useParams } from "react-router";
import { NumFieldType } from "../../../../../components/Dashboard/TableColumnRender";
import { saveMilestone, updateMilestone } from "../../../../../api/ailuo/pms";
import { blueButtonTheme, greyButtonTheme } from "../../../../../theme/theme";
const CustomModalRoot = styled.div`
	position: relative;
	padding: 24px 36px 24px 36px;
	border-radius: 8px;
	background-color: #ffffff;
	box-shadow:
		0 6px 16px 0 rgb(0 0 0 / 8%),
		0 3px 6px -4px rgb(0 0 0 / 12%),
		0 9px 28px 8px rgb(0 0 0 / 5%);
	pointer-events: auto;
	max-height: 80%;
	height: 100%;
	overflow: hidden;
	.header {
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

const columns: any = [
	{
		title: "时间",
		dataIndex: "createTime",
		key: "createTime",
		renderContent: (value: any, form: any, setForm: any) => {
			return (
				<div>
					{value ? (
						value
					) : (
						<span className="text-gray-400">根据新建时间自动生成</span>
					)}
				</div>
			);
		},
	},
	{
		title: "人员",
		dataIndex: "name",
		key: "name",
		type: NumFieldType.TextOnly,
	},
	{
		title: "类型",
		dataIndex: "type",
		key: "type",
		type: NumFieldType.SingleText,
	},
	{
		title: "描述",
		dataIndex: "content",
		key: "content",
		type: NumFieldType.Text,
	},
	{
		title: "是否影响交期",
		dataIndex: "deliveryTime",
		key: "deliveryTime",
		renderContent: (value: any, form: any, setForm: any) => {
			const onChange = (e: RadioChangeEvent) => {
				setForm({ ...form, deliveryTime: e.target.value });
			};
			return (
				<Radio.Group onChange={onChange} value={value}>
					<Radio value={"yes"}>是</Radio>
					<Radio value={"no"}>否</Radio>
				</Radio.Group>
			);
		},
	},
];

interface CustomModalProps {
	title: string;
	open: boolean;
	setOpen: (value: boolean) => void;
	modalType: string;
	formItem?: any | undefined;
	fetchData: () => void;
	workshopType: string;
	workshopId?: string;
	readonly: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
	title,
	modalType,
	open,
	setOpen,
	formItem,
	fetchData,
	workshopType,
	workshopId,
	readonly,
}) => {
	const params = useParams<any>();

	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});

	const handleSave = async () => {
		try {
			let res: any = {};
			if (form.id) {
				res = await updateMilestone(excludeNull({ ...form }));
			} else {
				let request: any = {
					...form,
					relatedWorkshop: params.wspId,
					workshopType,
				};
				switch (workshopType) {
					case "machining": {
						request.relatedMachining = workshopId;
						request.workshopType = "";
						break;
					}
					case "assembling": {
						request.relatedAssembling = workshopId;
						request.workshopType = "";
						break;
					}
					case "batch": {
						request.relatedBatch = workshopId;
						request.workshopType = "";
						request.relatedWorkshop = "";
						break;
					}
				}
				res = await saveMilestone(excludeNull(request));
			}
			if (res.code == 200) {
				await fetchData();
				message.success("保存成功");
				setOpen(false);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// 初始化form数据
	useEffect(() => {
		if (!open) {
			setForm({});
			inputForm.resetFields();
			return;
		}
		setForm(formItem);
		inputForm.setFieldsValue(formItem);
		if (readonly) {
			setShowDstColumns(
				columns.map((col: any) => {
					return { ...col, disabled: true };
				}),
			);
		} else {
			setShowDstColumns(columns);
		}
	}, [open]);

	return (
		<CustomModalRoot>
			<div className="header">
				<div className="title">{title}</div>
				<div>
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							type="primary"
							className="mr-4"
							onClick={() => setOpen(false)}
						>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button disabled={readonly} type="primary" onClick={handleSave}>
							保存
						</Button>
					</ConfigProvider>
				</div>
			</div>
			<div className="content">
				<Form
					form={inputForm}
					colon={false}
					wrapperCol={{ flex: 1 }}
					preserve={false}
				>
					{showDstColumns.length > 0 ? (
						<CellEditorContext
							form={form}
							setForm={setForm}
							dstColumns={showDstColumns}
						/>
					) : (
						<NoFieldData />
					)}
				</Form>
			</div>
		</CustomModalRoot>
	);
};

export default CustomModal;
