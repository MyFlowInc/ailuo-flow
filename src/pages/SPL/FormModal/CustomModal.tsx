import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme } from "../../../theme/theme";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import { SplDatabaseContext } from "../SplDatabase";
import _ from "lodash";
import { selectIsManager, selectUser } from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { splFileDataAdd, splFileDataEdit } from "../../../api/ailuo/spl-db";
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
		margin-top: 8px;
		height: calc(100% - 80px);
		max-width: 500px;
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
	title: string;
	open: boolean;
	setOpen: (value: boolean) => void;
	modalType: string;
	editFlowItemRecord?: any | undefined;
	parent?: number;
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
export const columns: any = [
	{
		title: "标准件名称",
		dataIndex: "name",
		key: "name",
		type: NumFieldType.SingleText,
	},

	{
		title: "配料单",
		dataIndex: "ingredientsList",
		key: "ingredientsList",
		type: NumFieldType.Attachment,
	},
	{
		title: "BOM",
		dataIndex: "bom",
		key: "bom",
		type: NumFieldType.Attachment,
	},
	{
		title: "加工图纸包",
		dataIndex: "processPkg",
		key: "processPkg",
		type: NumFieldType.Attachment,
	},
	{
		title: "装配图纸包",
		dataIndex: "fitOutPkg",
		key: "fitOutPkg",
		type: NumFieldType.Attachment,
	},
	{
		title: "作业指导书",
		dataIndex: "operationInstruction",
		key: "operationInstruction",
		type: NumFieldType.Attachment,
	},
];

const CustomModalContext = React.createContext({});

const CustomModal: React.FC<CustomModalProps> = ({
	title,
	modalType,
	open,
	setOpen,
	editFlowItemRecord,
	parent,
}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});

	const user = useAppSelector(selectUser);
	const isManager = useAppSelector(selectIsManager);
	const { fetchList } = useContext(SplDatabaseContext);

	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const setAllDisabled = (disabled: boolean) => {
		disabled = isManager ? false : disabled;

		const newCol = showDstColumns.map((item: any) => {
			return {
				...item,
				disabled,
			};
		});
		setShowDstColumns(newCol);
		setSaveButtonDisabled(disabled);
	};

	// 初始化form数据
	useEffect(() => {
		console.log("modal type", modalType, editFlowItemRecord);

		if (!open) {
			return;
		}
		if (modalType === "edit" && editFlowItemRecord) {
			const { key, ...temp } = editFlowItemRecord;
			setForm(temp);
			inputForm.resetFields();
			inputForm.setFieldsValue(temp);
		}
		if (modalType === "add") {
			inputForm.resetFields();
			setForm({});
		}
	}, [open]);

	// 新增记录
	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		try {
			await inputForm.validateFields();
			console.log("Received values of form: ", form);

			try {
			} catch (error) {}
			await splFileDataAdd(excludeNull(parent ? { ...form, parent } : form));
			await fetchList();
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};
	// 更新记录
	const updateRecord = async () => {
		const { recordId, id, ...rest } = form;
		inputForm.setFieldsValue(rest);
		const params = {
			id,
			...rest,
			children: null,
		};

		try {
			await inputForm.validateFields();
			try {
			} catch (error) {}
			await splFileDataEdit(excludeNull(params));
			await fetchList();
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		inputForm.setFieldsValue(form);
		if (modalType === "add") {
			createRecord();
		} else {
			updateRecord();
		}
	};

	const SaveButton = () => {
		if (modalType === "add") {
			return (
				<ConfigProvider theme={blueButtonTheme}>
					<Button type="primary" onClick={handleSaveRecord}>
						创建
					</Button>
				</ConfigProvider>
			);
		}
		if (saveButtonDisabled) {
			return null;
		}
		return (
			<ConfigProvider theme={blueButtonTheme}>
				<Button type="primary" onClick={handleSaveRecord}>
					{"保存"}
				</Button>
			</ConfigProvider>
		);
	};
	return (
		<CustomModalRoot key={modalType}>
			<div className="header">
				<div className="title">{title}</div>
				<div>
					<Button
						style={{
							fontSize: "12px",
							background: "#F2F3F5",
							marginRight: "18px",
						}}
						onClick={() => setOpen(false)}
					>
						取消
					</Button>
					{SaveButton()}
				</div>
			</div>
			<div className="content">
				<Form
					form={inputForm}
					name={modalType + "-" + "recordForm"}
					colon={false}
					wrapperCol={{ flex: 1 }}
					preserve={false}
				>
					{showDstColumns.length > 0 ? (
						<CellEditorContext
							form={form}
							setForm={setForm}
							dstColumns={showDstColumns}
							modalType={modalType}
						/>
					) : (
						<NoFieldData />
					)}
				</Form>
			</div>
			<div className="footer"></div>
		</CustomModalRoot>
	);
};

export default CustomModal;
