/**
 * type=3
 */

import React, { useRef, SyntheticEvent } from "react";
import { Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { TableColumnItem } from "../../../../store/workflowSlice";

interface TypeEmailProps {
	mode?: "multiple";
	cell: TableColumnItem;
	form: any;
	setForm: any;
}

const TypeEmail: React.FC<TypeEmailProps> = (props: TypeEmailProps) => {
	const { cell, form, setForm } = props;
	const el = useRef<any>(null);

	const forceSetValue = () => {
		if (el.current) {
			const input = el.current.input;

			input.value = form[cell.fieldId] || "";

			input.setAttribute("value", form[cell.fieldId] || "");
		}
	};

	const onChangeContent = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		setForm({
			...form,
			[cell.fieldId]: value
		});
	};

	return (
		<Input
			ref={input => {
				if (!input) {
					return;
				}
				el.current = input;
				forceSetValue();
			}}
			placeholder="请输入邮箱地址"
			onChange={onChangeContent}
			suffix={<MailOutlined />}
		/>
	);
};

export default TypeEmail;
