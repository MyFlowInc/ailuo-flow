/**
 * type=3
 */

import React, { useRef, useEffect, SyntheticEvent } from "react";
import { Input } from "antd";

interface TypeMultiSelectEditorProps {
	mode?: "multiple";
	cell: { key: string; dataIndex: string; name: string };
	form: any;
	setForm: any;
}

const TypeSingleText: React.FC<TypeMultiSelectEditorProps> = (props: TypeMultiSelectEditorProps) => {
	const { mode, cell, form, setForm } = props;
	const el = useRef<any>(null);

	useEffect(() => {
		// console.log('useEffect--TypeSingleText', form)
		forceSetValue();
	}, [form]);

	const onChangeContent = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		setForm({
			...form,
			[cell.dataIndex]: value
		});
		// console.log("onChangeContent", form);
	};

	const forceSetValue = () => {
		if (el.current) {
			const input = el.current.input;

			input.value = form[cell.dataIndex] || "";

			input.setAttribute("value", form[cell.dataIndex] || "");
		}
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
			key={"key_" + cell.name}
			placeholder="请输入"
			onChange={onChangeContent}
		/>
	);
};

export default TypeSingleText;
