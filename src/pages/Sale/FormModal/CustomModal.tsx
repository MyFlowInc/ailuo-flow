import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, Form, Button } from "antd";
import { NoFieldData } from "./NoFieldData";
import CloseFilled from "../../../assets/icons/CloseFilled";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { StatusTag } from "./StatusTag";
import { selectCurTableColumn, freshCurTableRows, selectCurFlowDstId, freshCurMetaData } from "../../../store/workflowSlice";
import { addDSCells, updateDSCells } from "../../../api/apitable/ds-record";
import { updateDSMeta } from "../../../api/apitable/ds-meta";
import CellEditorContext from "./CellEditorContext";
import { selectUser } from "../../../store/globalSlice";
import { blueButtonTheme } from "../../../theme/theme";
import { SocketMsgType, sendWebSocketMsg } from "../../../api/apitable/ws-msg";

import type { UpdateDSMetaParams } from "../../../api/apitable/ds-meta";
import type { AddDSCellsParams, UpdateDSCellsParams } from "../../../api/apitable/ds-record";
import type { TableColumnItem, WorkFlowStatusInfo } from "../../../store/workflowSlice";

const CustomModalRoot = styled.div`
	position: relative;
	padding: 24px 24px 24px 0;
	border-radius: 8px;
	background-color: #ffffff;
	box-shadow:
		0 6px 16px 0 rgb(0 0 0 / 8%),
		0 3px 6px -4px rgb(0 0 0 / 12%),
		0 9px 28px 8px rgb(0 0 0 / 5%);
	pointer-events: auto;

	.header {
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 0 12px 24px;

		.title {
			font-size: 18px;
			font-family: "Harmony_Sans_Medium", sans-serif;
		}
	}

	.content {
		max-height: 420px;
		overflow: auto;
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
	freshFlowItem: () => void;
	statusList: WorkFlowStatusInfo[];
	modalType: string;

	editFlowItemRecord?: any | undefined;
	children?: React.ReactNode;
}
const filterColumns = (arr: TableColumnItem[]) => {
	return arr.filter(item => {
		return item.type !== 26;
	});
};
const CustomModal: React.FC<CustomModalProps> = ({ title, statusList, modalType, open, setOpen, editFlowItemRecord }) => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const dstColumns = useAppSelector(selectCurTableColumn);
	const [showDstColumns, setShowDstColumns] = useState(filterColumns(dstColumns));
	const curDstId = useAppSelector(selectCurFlowDstId);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<{ [id: string]: string }>({});
	useEffect(() => {
		setShowDstColumns(filterColumns(dstColumns));
	}, [dstColumns]);

	// esc handler
	useEffect(() => {
		if (!open) {
			return;
		}
		const keydownHandler = (e: KeyboardEvent) => {
			if (e.code === "Escape") {
				setOpen(false);
			}
		};
		document.addEventListener("keydown", keydownHandler, true);
		return () => {
			document.removeEventListener("keydown", keydownHandler, true);
		};
	}, [open]);

	useEffect(() => {
		if (!open) {
			return;
		}
		if (modalType === "edit" && editFlowItemRecord) {
			const { key, flowItemId, statusId, ...temp } = editFlowItemRecord;
			setForm(temp);
			inputForm.setFieldsValue(temp);
		}
		if (modalType === "add") {
			if (statusList && statusList.length > 0) {
			}
			setForm({});
		}
	}, [open]);

	const handleAddField = async () => {
		if (!curDstId) {
			return;
		}
		const param: UpdateDSMetaParams = {
			dstId: curDstId,
			name: "字段" + (showDstColumns.length + 1),
			type: "SingleText"
		};
		try {
			await updateDSMeta(param);
			await dispatch(freshCurMetaData(curDstId));
		} catch (error) {
			console.log("updateFieldHandler error", error);
		}
	};

	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		const params: AddDSCellsParams = {
			dstId: curDstId!,
			fieldKey: "id",
			records: [
				{
					fields: form
				}
			]
		};
		try {
			await inputForm.validateFields();
			await addDSCells(params);
			dispatch(freshCurTableRows(curDstId!));

			// 同步 ws
			sendWebSocketMsg({
				user,
				dstId: curDstId!,
				type: SocketMsgType.AddRecords,
				recordId: "",
				row: {}
			});
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	const updateRecord = async () => {
		const { recordId, id, ...rest } = form;
		inputForm.setFieldsValue(rest);
		const params: UpdateDSCellsParams = {
			dstId: curDstId!,
			fieldKey: "id",
			records: [
				{
					recordId,
					fields: rest
				}
			]
		};
		try {
			await inputForm.validateFields();
			await updateDSCells(params);
			dispatch(freshCurTableRows(curDstId!));
			// 同步
			sendWebSocketMsg({
				user,
				dstId: curDstId!,
				type: SocketMsgType.SetRecords,
				recordId,
				row: rest
			});
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		// console.log("saveTableRecord", form);
		inputForm.setFieldsValue(form);
		if (modalType === "add") {
			createRecord();
		} else {
			updateRecord();
		}
	};

	return (
		<CustomModalRoot>
			<div className="header">
				<Button type="text" icon={<CloseFilled style={{ fontSize: "12px", color: "#707683" }} />} onClick={() => setOpen(false)} />
				<div className="title">{title}</div>
				<div>
					<StatusTag statusList={statusList} {...{ form, setForm }} />
				</div>
			</div>
			<div className="content">
				<Form form={inputForm} name="recordForm" colon={false} wrapperCol={{ flex: 1 }} preserve={false}>
					{showDstColumns.length > 0 ? <CellEditorContext form={form} setForm={setForm} dstColumns={showDstColumns} modalType={modalType} /> : <NoFieldData />}
				</Form>
			</div>
			<div className="footer">
				<Button icon={<PlusOutlined style={{ fontSize: "12px", color: "#707683" }} />} onClick={handleAddField}>
					添加
				</Button>
				<ConfigProvider theme={blueButtonTheme}>
					<Button type="primary" onClick={handleSaveRecord}>
						{modalType === "add" ? "创建" : "修改"}
					</Button>
				</ConfigProvider>
			</div>
		</CustomModalRoot>
	);
};

export default CustomModal;
