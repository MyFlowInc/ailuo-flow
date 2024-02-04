import React from "react";
import { Form } from "antd";
import styled from "styled-components";
import { NumFieldType } from "../TableColumnRender";
import TypeEditor from "./TypeEditor";

const CellEditorRoot = styled.div`
	color: #848484;
	flex-grow: 1;
`;

interface CellEditorProps {
	cell: any;
	form: { [id: string]: string };
	setForm: (value: any) => void;
	modalType: string;
}

const CellEditor: React.FC<CellEditorProps> = props => {
	const { cell, form, setForm, modalType } = props;

	let rules: any;

	switch (cell.type) {
		case NumFieldType.OptionStatus:
			return <div className="hidden"></div>;
		case NumFieldType.Email:
			rules = [{ type: "email", message: "请输入有效的邮箱地址." }];
			break;
		case NumFieldType.Phone:
			rules = [
				{
					pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
					message: "请输入有效的手机号码."
				}
			];
			break;
		case NumFieldType.Member:
		case NumFieldType.MultiSelect:
			rules = [{ type: "array" }];
			break;
		case NumFieldType.Number:
			rules = [{ type: "number" }];
			break;

		default:
	}

	return (
		<CellEditorRoot>
			<Form.Item name={cell.fieldId} rules={rules}>
				<TypeEditor {...{ cell, form, setForm, modalType }} />
			</Form.Item>
		</CellEditorRoot>
	);
};

export default CellEditor;
