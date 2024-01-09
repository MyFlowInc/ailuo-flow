import React, { useEffect } from "react";
import { Space, Form, Input, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ReverSedNumFieldType } from "../../TableColumnRender";

import type { TableColumnItem } from "../../../../store/workflowSlice";

interface CellLabelEditorProps {
	cell: TableColumnItem;
	updateField: (m: string, n: string) => void;
	onRead: () => void;
	children?: React.ReactNode;
}

const CellLabelEditor: React.FC<CellLabelEditorProps> = ({ cell, updateField, onRead }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldValue("title", cell.name);
	}, []);

	const onFinish = () => {
		form
			.validateFields()
			.then(async values => {
				const k = ReverSedNumFieldType[cell.type as unknown as keyof typeof ReverSedNumFieldType] || "NotSupport";
				updateField(values.title, k);
			})
			.catch(info => {
				console.log("Validate Failed:", info);
			});
	};

	return (
		<Form form={form} name="labelForm" layout="inline" initialValues={{ title: cell.name }} onFinish={onFinish} autoComplete="off">
			<Space.Compact>
				<Form.Item name="title" style={{ padding: 0, margin: 0 }}>
					<Input style={{ width: "48px" }} />
				</Form.Item>
				<Form.Item style={{ padding: 0, margin: 0 }}>
					<Button icon={<CheckOutlined style={{ fontSize: "12px" }} />} onClick={onFinish}></Button>
					<Button icon={<CloseOutlined style={{ fontSize: "12px" }} />} onClick={onRead}></Button>
				</Form.Item>
			</Space.Compact>
		</Form>
	);
};

export default CellLabelEditor;
