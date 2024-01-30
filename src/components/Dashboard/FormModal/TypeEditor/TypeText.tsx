/**
 * type=3
 */

import React, { useRef, useEffect, SyntheticEvent, useState } from "react";
import { Input } from "antd";
import _ from "lodash";

interface TypeTextEditorProps {
	cell: { key: string; dataIndex: string; name: string };
	form: any;
	setForm: any;
}
const { TextArea } = Input;

const TypeText: React.FC<TypeTextEditorProps> = (
	props: TypeTextEditorProps,
) => {
	const { cell, form, setForm } = props;
	const el = useRef<any>(null);
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (_.get(cell, 'disabled')) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [cell])

	useEffect(() => {
		forceSetValue();
	}, [form]);

	const onChangeContent = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		setForm({
			...form,
			[cell.dataIndex]: value,
		});
	};

	const forceSetValue = () => {
		if (el.current) {
			const input = el.current.resizableTextArea.textArea;
			input.value = form[cell.dataIndex] || "";
			input.setAttribute("value", form[cell.dataIndex] || "");
		}
	};
	return (
		<TextArea
			disabled={disabled}
			rows={3}
			value={form[cell.dataIndex]}
			ref={(input) => {
				if (!input) {
					return;
				}
				el.current = input;
				forceSetValue();
			}}
			key={"key_" + cell.name}
			placeholder="请输入"
			onChange={onChangeContent}
		/>
	);
};

export default TypeText;
